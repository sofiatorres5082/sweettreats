package com.sweettreats.SweetTreats.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagen;
    private Integer stock;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductModel(String nombre, String descripcion, double precio, String imagen, int stock) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.stock = stock;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
