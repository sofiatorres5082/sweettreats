package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.dto.CartItemRequest;
import com.sweettreats.SweetTreats.dto.CartItemResponse;
import com.sweettreats.SweetTreats.dto.CartSummaryResponse;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.UserRepository;
import com.sweettreats.SweetTreats.service.CartService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@Slf4j
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    private UserModel getCurrentUser(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
        }

        return userRepository.findUserModelByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(Authentication auth) {
        try {
            UserModel user = getCurrentUser(auth);
            List<CartItemResponse> cart = cartService.getCart(user);
            log.info("Carrito obtenido para usuario: {}, items: {}", user.getEmail(), cart.size());
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            log.error("Error obteniendo carrito: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> addItem(
            @Valid @RequestBody CartItemRequest request,
            Authentication auth) {
        try {
            UserModel user = getCurrentUser(auth);
            CartItemResponse response = cartService.addItem(user, request);
            log.info("Item agregado al carrito - Usuario: {}, Producto: {}, Cantidad: {}",
                    user.getEmail(), request.getProductId(), request.getCantidad());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error agregando item al carrito: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PutMapping
    public ResponseEntity<CartItemResponse> updateItem(
            @Valid @RequestBody CartItemRequest request,
            Authentication auth) {
        try {
            UserModel user = getCurrentUser(auth);
            CartItemResponse response = cartService.updateItem(user, request);

            // Si response es null, significa que el item fue eliminado (cantidad = 0)
            if (response == null) {
                log.info("Item removido del carrito - Usuario: {}, Producto: {} (cantidad = 0)",
                        user.getEmail(), request.getProductId());
                return ResponseEntity.noContent().build();
            }

            log.info("Item actualizado en carrito - Usuario: {}, Producto: {}, Nueva cantidad: {}",
                    user.getEmail(), request.getProductId(), request.getCantidad());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error actualizando item del carrito: {}", e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long productId, Authentication auth) {
        try {
            UserModel user = getCurrentUser(auth);
            cartService.removeItem(user, productId);
            log.info("Item removido del carrito - Usuario: {}, Producto: {}",
                    user.getEmail(), productId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error removiendo item del carrito: {}", e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication auth) {
        try {
            UserModel user = getCurrentUser(auth);
            cartService.clearCart(user);
            log.info("Carrito vaciado - Usuario: {}", user.getEmail());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error vaciando carrito: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<CartSummaryResponse> getCartSummary(Authentication auth) {
        try {
            UserModel user = getCurrentUser(auth);
            List<CartItemResponse> items = cartService.getCart(user);
            double total = cartService.getCartTotal(user);
            boolean stockValid = cartService.validateCartStock(user);

            CartSummaryResponse summary = CartSummaryResponse.builder()
                    .items(items)
                    .itemCount(items.stream().mapToInt(CartItemResponse::getCantidad).sum())
                    .total(total)
                    .stockValid(stockValid)
                    .build();

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Error obteniendo resumen del carrito: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateCartStock(Authentication auth) {
        try {
            UserModel user = getCurrentUser(auth);
            boolean isValid = cartService.validateCartStock(user);
            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            log.error("Error validando stock del carrito: {}", e.getMessage(), e);
            throw e;
        }
    }
}