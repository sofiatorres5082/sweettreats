package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.dto.CartItemRequest;
import com.sweettreats.SweetTreats.dto.CartItemResponse;
import com.sweettreats.SweetTreats.model.UserModel;

import java.util.List;

public interface CartService {

    /**
     * Obtiene todos los items del carrito del usuario
     */
    List<CartItemResponse> getCart(UserModel user);

    /**
     * Agrega un item al carrito o incrementa la cantidad si ya existe
     */
    CartItemResponse addItem(UserModel user, CartItemRequest request);

    /**
     * Actualiza la cantidad de un item específico
     */
    CartItemResponse updateItem(UserModel user, CartItemRequest request);

    /**
     * Remueve completamente un item del carrito
     */
    void removeItem(UserModel user, Long productId);

    /**
     * Vacía completamente el carrito del usuario
     */
    void clearCart(UserModel user);

    /**
     * Calcula el total del carrito
     */
    double getCartTotal(UserModel user);

    /**
     * Valida que todos los items del carrito tengan stock disponible
     */
    boolean validateCartStock(UserModel user);
}