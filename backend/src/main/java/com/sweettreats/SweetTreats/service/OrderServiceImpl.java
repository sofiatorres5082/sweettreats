package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.dto.OrderDetailResponse;
import com.sweettreats.SweetTreats.dto.OrderRequest;
import com.sweettreats.SweetTreats.dto.OrderResponse;
import com.sweettreats.SweetTreats.model.*;
import com.sweettreats.SweetTreats.repository.OrderRepository;
import com.sweettreats.SweetTreats.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }
    @Override
    @Transactional
    public OrderResponse crearPedido(OrderRequest request, UserModel user) {
        OrderModel order = new OrderModel();
        order.setUsermodel(user);
        order.setDireccionEnvio(request.direccionEnvio());
        order.setMetodoPago(request.metodoPago());
        order.setEstado(OrderEnum.PENDIENTE);

        List<OrderDetailModel> detalles = request.items().stream()
                .map(item -> {
                    ProductModel prod = productRepository.findById(item.productId())
                            .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.NOT_FOUND, "Producto no encontrado"));

                    if (item.cantidad() > prod.getStock()) {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Stock insuficiente para producto " + prod.getId()
                        );
                    }

                    // ↓ Actualizamos el stock aquí
                    prod.setStock(prod.getStock() - item.cantidad());

                    OrderDetailModel det = new OrderDetailModel();
                    det.setOrderModel(order);
                    det.setProductModel(prod);
                    det.setCantidad(item.cantidad());
                    det.setPrecioUnitario(BigDecimal.valueOf(prod.getPrecio()));
                    return det;
                })
                .collect(Collectors.toList());

        BigDecimal total = detalles.stream()
                .map(d -> d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotal(total);
        order.setDetalles(detalles);

        OrderModel saved = orderRepository.save(order);

        List<OrderDetailResponse> detalleResp = saved.getDetalles().stream()
                .map(d -> new OrderDetailResponse(
                        d.getProductModel().getId(),
                        d.getProductModel().getNombre(),
                        d.getCantidad(),
                        d.getPrecioUnitario()
                ))
                .collect(Collectors.toList());

        return new OrderResponse(
                saved.getId(),
                saved.getUsermodel().getEmail(),
                saved.getDireccionEnvio(),
                saved.getMetodoPago(),
                saved.getTotal(),
                saved.getEstado(),
                saved.getCreatedAt(),
                detalleResp
        );
    }

    @Override
    public List<OrderResponse> obtenerPedidosDeUsuario(UserModel user) {
        return orderRepository.findAllByUsermodel(user).stream()
                .map(order -> {
                    List<OrderDetailResponse> detalles = order.getDetalles().stream()
                            .map(d -> new OrderDetailResponse(
                                    d.getProductModel().getId(),
                                    d.getProductModel().getNombre(),
                                    d.getCantidad(),
                                    d.getPrecioUnitario()
                            ))
                            .collect(Collectors.toList());
                    return new OrderResponse(
                            order.getId(),
                            order.getUsermodel().getEmail(),
                            order.getDireccionEnvio(),
                            order.getMetodoPago(),
                            order.getTotal(),
                            order.getEstado(),
                            order.getCreatedAt(),
                            detalles
                    );
                })
                .collect(Collectors.toList());
    }


    @Override
    public OrderResponse obtenerPedidoPorId(UserModel user, Long id) {
        OrderModel order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));
        if (!order.getUsermodel().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes acceso a este pedido");
        }
        return mapToResponse(order);
    }

    @Override
    public Page<OrderResponse> obtenerTodosLosPedidos(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private OrderModel buildOrderEntity(OrderRequest request, UserModel user) {
        OrderModel order = new OrderModel();
        order.setUsermodel(user);
        order.setDireccionEnvio(request.direccionEnvio());
        order.setMetodoPago(request.metodoPago());
        order.setEstado(OrderEnum.PENDIENTE);

        List<OrderDetailModel> detalles = request.items().stream().map(item -> {
            ProductModel prod = productRepository.findById(item.productId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
            if (item.cantidad() > prod.getStock()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock insuficiente para producto " + prod.getId());
            }
            OrderDetailModel det = new OrderDetailModel();
            det.setOrderModel(order);
            det.setProductModel(prod);
            det.setCantidad(item.cantidad());
            det.setPrecioUnitario(BigDecimal.valueOf(prod.getPrecio()));
            return det;
        }).collect(Collectors.toList());

        BigDecimal total = detalles.stream()
                .map(d -> d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setDetalles(detalles);
        order.setTotal(total);
        return order;
    }

    private OrderResponse mapToResponse(OrderModel saved) {
        List<OrderDetailResponse> detalleResp = saved.getDetalles().stream()
                .map(d -> new OrderDetailResponse(
                        d.getProductModel().getId(),
                        d.getProductModel().getNombre(),
                        d.getCantidad(),
                        d.getPrecioUnitario()))
                .collect(Collectors.toList());
        return new OrderResponse(
                saved.getId(),
                saved.getUsermodel().getEmail(),
                saved.getDireccionEnvio(),
                saved.getMetodoPago(),
                saved.getTotal(),
                saved.getEstado(),
                saved.getCreatedAt(),
                detalleResp);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderEnum nuevoEstado) {
        // Buscamos la orden o lanzamos 404
        OrderModel order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Pedido no encontrado")
                );

        // Actualizamos el estado
        order.setEstado(nuevoEstado);

        // Guardamos
        OrderModel saved = orderRepository.save(order);

        // Mapeamos a DTO y devolvemos
        return mapToResponse(saved);
    }


    public OrderResponse obtenerPedidoAdminPorId(Long id) {
        OrderModel order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Pedido no encontrado"));
        return mapToResponse(order);
    }

}
