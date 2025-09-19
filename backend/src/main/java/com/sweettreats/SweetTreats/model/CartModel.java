// CartModel.java
package com.sweettreats.SweetTreats.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserModel user;

    @OneToMany(
            mappedBy = "cart",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<CartItemModel> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Métodos de conveniencia
    public void addItem(CartItemModel item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItemModel item) {
        items.remove(item);
        item.setCart(null);
    }

    public double getTotal() {
        return items.stream()
                .mapToDouble(item -> item.getProduct().getPrecio() * item.getCantidad())
                .sum();
    }

    public int getTotalItems() {
        return items.stream()
                .mapToInt(CartItemModel::getCantidad)
                .sum();
    }
}