package com.sweettreats.SweetTreats.dto;

import java.math.BigDecimal;

public class ProductStatDto {
    private String nombre;
    private Long totalCantidad;
    private BigDecimal totalIngresos;

    // Hibernate necesita exactamente este constructor:
    public ProductStatDto(String nombre, Long totalCantidad, BigDecimal totalIngresos) {
        this.nombre = nombre;
        this.totalCantidad = totalCantidad;
        this.totalIngresos = totalIngresos;
    }

    // getters (y setters si los necesitás)
    public String getNombre() {
        return nombre;
    }

    public Long getTotalCantidad() {
        return totalCantidad;
    }

    public BigDecimal getTotalIngresos() {
        return totalIngresos;
    }
}
