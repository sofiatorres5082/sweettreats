package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.model.CartItemModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItemModel, Long> {
}
