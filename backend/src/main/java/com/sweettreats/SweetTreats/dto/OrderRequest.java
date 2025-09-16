package com.sweettreats.SweetTreats.dto;

import java.math.BigDecimal;
import java.util.List;

public record OrderRequest(
        String direccionEnvio,
        Long metodoPagoId,
        List<OrderItem> items
) {}
