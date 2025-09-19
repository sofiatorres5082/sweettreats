package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.model.CartModel;
import com.sweettreats.SweetTreats.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<CartModel, Long> {
    Optional<CartModel> findByUser(UserModel user);
}
