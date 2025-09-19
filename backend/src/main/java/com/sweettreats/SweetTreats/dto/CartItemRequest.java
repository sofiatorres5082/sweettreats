package com.sweettreats.SweetTreats.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemRequest {
    private Long productId;
    private int cantidad;
}

