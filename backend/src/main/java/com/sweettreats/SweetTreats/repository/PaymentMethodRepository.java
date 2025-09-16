package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.model.PaymentMethodModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethodModel, Long> {
}
