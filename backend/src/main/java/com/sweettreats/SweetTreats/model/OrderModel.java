package com.sweettreats.SweetTreats.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderModel {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private UserModel usermodel;

    private BigDecimal total;

    private String direccionEnvio;

    private String metodoPago;

    @Enumerated(EnumType.STRING)
    private OrderEnum estado;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "orderModel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetailModel> detalles;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
