package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.model.OrderModel;
import com.sweettreats.SweetTreats.model.UserModel;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderModel, Long> {
    List<OrderModel> findByUsermodel(UserModel user);

    List<OrderModel> findAllByUsermodel(UserModel user);

    Page<OrderModel> findAll(Pageable pageable);

}