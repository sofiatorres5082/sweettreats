package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.dto.OrderRequest;
import com.sweettreats.SweetTreats.dto.OrderResponse;
import com.sweettreats.SweetTreats.model.OrderEnum;
import com.sweettreats.SweetTreats.model.UserModel;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface OrderService {
    OrderResponse crearPedido(OrderRequest request, UserModel user);
    List<OrderResponse> obtenerPedidosDeUsuario(UserModel user);
    OrderResponse obtenerPedidoPorId(UserModel user, Long id);
    Page<OrderResponse> obtenerTodosLosPedidos(Pageable pageable);
    OrderResponse updateOrderStatus(Long id, OrderEnum nuevoEstado);
    OrderResponse cancelOrderByUser(Long orderId, UserModel user);
}
