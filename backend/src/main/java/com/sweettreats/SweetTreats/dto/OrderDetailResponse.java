package com.sweettreats.SweetTreats.dto;

import java.math.BigDecimal;

public record OrderDetailResponse(
        Long productId,
        String productName,
        Integer cantidad,
        BigDecimal precioUnitario
) {}