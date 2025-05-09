package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.dto.OrderItem;
import com.sweettreats.SweetTreats.dto.OrderRequest;
import com.sweettreats.SweetTreats.model.*;
import com.sweettreats.SweetTreats.repository.OrderRepository;
import com.sweettreats.SweetTreats.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    public OrderModel crearPedido(OrderRequest request, UserModel usuario) {
        OrderModel pedido = new OrderModel();
        pedido.setUsermodel(usuario);
        pedido.setDireccionEnvio(request.direccionEnvio());
        pedido.setMetodoPago(request.metodoPago());
        pedido.setEstado(OrderEnum.PENDIENTE);

        List<OrderDetailModel> detalles = new ArrayList<>();
        for (OrderItem item : request.items()) {
            ProductModel producto = productRepository.findById(item.productId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            OrderDetailModel detalle = new OrderDetailModel();
            detalle.setOrderModel(pedido);
            detalle.setProductModel(producto);
            detalle.setCantidad(item.cantidad());
            detalle.setPrecioUnitario(item.precioUnitario());

            detalles.add(detalle);
        }

        BigDecimal total = detalles.stream()
                .map(detalle -> detalle.getPrecioUnitario().multiply(BigDecimal.valueOf(detalle.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        pedido.setTotal(total);

        pedido.setDetalles(detalles);

        return orderRepository.save(pedido);
    }

    public List<OrderModel> obtenerPedidosDeUsuario(UserModel user) {
        return orderRepository.findAllByUsermodel(user);
    }

}
