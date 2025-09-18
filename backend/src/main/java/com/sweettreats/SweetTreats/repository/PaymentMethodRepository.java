package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.model.PaymentMethodModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethodModel, Long> {
    Page<PaymentMethodModel> findAllByActivoTrue(Pageable pageable);
    List<PaymentMethodModel> findAllByActivoTrue();
}
