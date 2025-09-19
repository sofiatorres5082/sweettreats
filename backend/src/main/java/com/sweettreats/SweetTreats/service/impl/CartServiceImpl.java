package com.sweettreats.SweetTreats.service.impl;

import com.sweettreats.SweetTreats.dto.CartItemRequest;
import com.sweettreats.SweetTreats.dto.CartItemResponse;
import com.sweettreats.SweetTreats.model.CartItemModel;
import com.sweettreats.SweetTreats.model.CartModel;
import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.CartItemRepository;
import com.sweettreats.SweetTreats.repository.CartRepository;
import com.sweettreats.SweetTreats.repository.ProductRepository;
import com.sweettreats.SweetTreats.service.CartService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           CartItemRepository cartItemRepository,
                           ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    private CartModel getOrCreateCart(UserModel user) {
        log.debug("Obteniendo o creando carrito para usuario: {}", user.getEmail());

        Optional<CartModel> existingCart = cartRepository.findByUser(user);

        if (existingCart.isPresent()) {
            CartModel cart = existingCart.get();
            log.debug("Carrito existente encontrado con {} items", cart.getItems().size());
            return cart;
        }

        CartModel newCart = CartModel.builder()
                .user(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        CartModel savedCart = cartRepository.save(newCart);
        log.info("Nuevo carrito creado para usuario: {}, ID: {}", user.getEmail(), savedCart.getId());

        return savedCart;
    }

    @Override
    public List<CartItemResponse> getCart(UserModel user) {
        log.debug("Obteniendo carrito para usuario: {}", user.getEmail());

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario no puede ser null");
        }

        CartModel cart = getOrCreateCart(user);
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        log.debug("Carrito obtenido: {} items, total: ${}", items.size(),
                items.stream().mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad()).sum());

        return items;
    }

    @Override
    public CartItemResponse addItem(UserModel user, CartItemRequest request) {
        log.debug("Agregando item al carrito - Usuario: {}, Producto: {}, Cantidad: {}",
                user.getEmail(), request.getProductId(), request.getCantidad());

        validateUser(user);
        validateCartItemRequest(request);

        CartModel cart = getOrCreateCart(user);

        // Refrescar datos del producto desde la BD
        ProductModel product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> {
                    log.error("Producto no encontrado: {}", request.getProductId());
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
                });

        if (product.getStock() <= 0) {
            log.warn("Intento de agregar producto sin stock: {}", product.getId());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Producto sin stock disponible");
        }

        Optional<CartItemModel> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        CartItemModel cartItem;

        if (existingItemOpt.isPresent()) {
            cartItem = existingItemOpt.get();
            int newQuantity = cartItem.getCantidad() + request.getCantidad();

            if (newQuantity > product.getStock()) {
                log.warn("Stock insuficiente - Producto: {}, Disponible: {}, Solicitado: {}",
                        product.getId(), product.getStock(), newQuantity);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        String.format("Stock insuficiente. Disponible: %d, Total solicitado: %d",
                                product.getStock(), newQuantity));
            }

            cartItem.setCantidad(newQuantity);
            cartItem.setUpdatedAt(LocalDateTime.now());
            cartItem = cartItemRepository.save(cartItem);

            log.info("Cantidad actualizada - Producto: {}, Nueva cantidad: {}",
                    product.getId(), newQuantity);
        } else {
            if (request.getCantidad() > product.getStock()) {
                log.warn("Stock insuficiente para nuevo item - Producto: {}, Disponible: {}, Solicitado: {}",
                        product.getId(), product.getStock(), request.getCantidad());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        String.format("Stock insuficiente. Disponible: %d, Solicitado: %d",
                                product.getStock(), request.getCantidad()));
            }

            cartItem = CartItemModel.builder()
                    .cart(cart)
                    .product(product)
                    .cantidad(request.getCantidad())
                    .addedAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            cartItem = cartItemRepository.save(cartItem);
            cart.getItems().add(cartItem);

            log.info("Nuevo item agregado - Producto: {}, Cantidad: {}",
                    product.getId(), request.getCantidad());
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        return mapToResponse(cartItem);
    }

    @Override
    public CartItemResponse updateItem(UserModel user, CartItemRequest request) {
        log.debug("Actualizando item del carrito - Usuario: {}, Producto: {}, Nueva cantidad: {}",
                user.getEmail(), request.getProductId(), request.getCantidad());

        validateUser(user);
        if (request.getProductId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product ID no puede ser null");
        }
        if (request.getCantidad() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad no puede ser negativa");
        }

        CartModel cart = getOrCreateCart(user);

        CartItemModel cartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElseThrow(() -> {
                    log.error("Item no encontrado en carrito - Usuario: {}, Producto: {}",
                            user.getEmail(), request.getProductId());
                    return new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Item no encontrado en el carrito");
                });

        // Si la cantidad es 0, remover el item y retornar null
        if (request.getCantidad() == 0) {
            log.info("Removiendo item del carrito - Cantidad cero - Producto: {}",
                    request.getProductId());

            cart.getItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
            cart.setUpdatedAt(LocalDateTime.now());
            cartRepository.save(cart);

            // En lugar de lanzar excepción, retornamos null para indicar eliminación
            return null;
        }

        // Refrescar datos del producto desde la BD para tener stock actualizado
        ProductModel product = productRepository.findById(cartItem.getProduct().getId())
                .orElse(cartItem.getProduct());

        if (request.getCantidad() > product.getStock()) {
            log.warn("Stock insuficiente para actualización - Producto: {}, Disponible: {}, Solicitado: {}",
                    product.getId(), product.getStock(), request.getCantidad());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Stock insuficiente. Disponible: %d, Solicitado: %d",
                            product.getStock(), request.getCantidad()));
        }

        cartItem.setCantidad(request.getCantidad());
        cartItem.setUpdatedAt(LocalDateTime.now());
        cartItem = cartItemRepository.save(cartItem);

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        log.info("Item actualizado correctamente - Producto: {}, Nueva cantidad: {}",
                product.getId(), request.getCantidad());

        return mapToResponse(cartItem);
    }

    @Override
    public void removeItem(UserModel user, Long productId) {
        log.debug("Removiendo item del carrito - Usuario: {}, Producto: {}",
                user.getEmail(), productId);

        validateUser(user);
        if (productId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product ID no puede ser null");
        }

        CartModel cart = getOrCreateCart(user);

        CartItemModel itemToRemove = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> {
                    log.error("Item no encontrado para remover - Usuario: {}, Producto: {}",
                            user.getEmail(), productId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Item no encontrado en el carrito");
                });

        cart.getItems().remove(itemToRemove);
        cartItemRepository.delete(itemToRemove);

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        log.info("Item removido exitosamente - Producto: {}", productId);
    }

    @Override
    public void clearCart(UserModel user) {
        log.debug("Vaciando carrito - Usuario: {}", user.getEmail());

        validateUser(user);

        CartModel cart = getOrCreateCart(user);

        if (cart.getItems().isEmpty()) {
            log.debug("Carrito ya está vacío - Usuario: {}", user.getEmail());
            return;
        }

        int itemCount = cart.getItems().size();

        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        log.info("Carrito vaciado exitosamente - Usuario: {}, {} items eliminados",
                user.getEmail(), itemCount);
    }

    @Override
    public double getCartTotal(UserModel user) {
        log.debug("Calculando total del carrito - Usuario: {}", user.getEmail());

        validateUser(user);

        CartModel cart = getOrCreateCart(user);
        double total = cart.getItems().stream()
                .mapToDouble(item -> item.getProduct().getPrecio() * item.getCantidad())
                .sum();

        log.debug("Total del carrito calculado: ${}", total);
        return total;
    }

    @Override
    public boolean validateCartStock(UserModel user) {
        log.debug("Validando stock del carrito - Usuario: {}", user.getEmail());

        validateUser(user);

        CartModel cart = getOrCreateCart(user);

        boolean isValid = cart.getItems().stream()
                .allMatch(item -> {
                    // Refrescar datos del producto desde BD
                    ProductModel product = productRepository.findById(item.getProduct().getId())
                            .orElse(item.getProduct());

                    boolean hasEnoughStock = item.getCantidad() <= product.getStock();

                    if (!hasEnoughStock) {
                        log.warn("Stock insuficiente detectado - Producto: {}, En carrito: {}, Disponible: {}",
                                product.getId(), item.getCantidad(), product.getStock());
                    }

                    return hasEnoughStock;
                });

        log.debug("Validación de stock completada - Válido: {}", isValid);
        return isValid;
    }

    private CartItemResponse mapToResponse(CartItemModel item) {
        if (item == null) {
            return null;
        }

        // Obtener datos frescos del producto para incluir stock actual
        ProductModel freshProduct = productRepository.findById(item.getProduct().getId())
                .orElse(item.getProduct());

        return CartItemResponse.builder()
                .productId(item.getProduct().getId())
                .nombre(item.getProduct().getNombre())
                .imagen(item.getProduct().getImagen())
                .cantidad(item.getCantidad())
                .precioUnitario(item.getProduct().getPrecio())
                .stock(freshProduct.getStock()) // Agregar stock actual
                .build();
    }

    private void validateUser(UserModel user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario no puede ser null");
        }
    }

    private void validateCartItemRequest(CartItemRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request no puede ser null");
        }
        if (request.getProductId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product ID no puede ser null");
        }
        if (request.getCantidad() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La cantidad debe ser mayor a 0");
        }
    }
}