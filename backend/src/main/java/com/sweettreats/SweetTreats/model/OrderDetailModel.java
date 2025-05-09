package com.sweettreats.SweetTreats.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_details")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailModel {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private OrderModel orderModel;

    @ManyToOne
    private ProductModel productModel;

    private Integer cantidad;
    private BigDecimal precioUnitario;
}
