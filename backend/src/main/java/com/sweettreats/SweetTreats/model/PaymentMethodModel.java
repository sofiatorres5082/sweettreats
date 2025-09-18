package com.sweettreats.SweetTreats.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "payment_methods")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentMethodModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; // Ej: "Tarjeta de crédito", "Transferencia bancaria", "MercadoPago"

    @OneToMany(mappedBy = "metodoPago", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderModel> pedidos;

    private Boolean activo = true;
}
