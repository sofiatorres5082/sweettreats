package com.sweettreats.SweetTreats.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private Long productId;
    private String nombre;
    private String imagen;
    private int cantidad;
    private double precioUnitario;
    private int stock;
}