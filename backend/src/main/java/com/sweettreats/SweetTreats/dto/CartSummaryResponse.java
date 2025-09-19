package com.sweettreats.SweetTreats.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartSummaryResponse {
    private List<CartItemResponse> items;
    private int itemCount;
    private double total;
    private boolean stockValid;
}