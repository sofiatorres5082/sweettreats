package com.sweettreats.SweetTreats.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record OrderItem(
        @NotNull Long productId,
        @NotNull @Positive Integer cantidad,
        @NotNull @Positive BigDecimal precioUnitario )
{ }