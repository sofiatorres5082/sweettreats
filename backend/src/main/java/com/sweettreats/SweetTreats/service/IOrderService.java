package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.dto.OrderRequest;
import com.sweettreats.SweetTreats.model.OrderModel;
import com.sweettreats.SweetTreats.model.UserModel;

import java.util.List;

public interface IOrderService {
    OrderModel crearPedido(OrderRequest request, UserModel usuario);

    List<OrderModel> obtenerPedidosDeUsuario(UserModel user);
}
