package com.sweettreats.SweetTreats.dto;

import com.sweettreats.SweetTreats.model.OrderEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String direccionEnvio,
        String metodoPago,
        BigDecimal total,
        OrderEnum estado,
        LocalDateTime createdAt,
        List<OrderDetailResponse> detalles
) {}