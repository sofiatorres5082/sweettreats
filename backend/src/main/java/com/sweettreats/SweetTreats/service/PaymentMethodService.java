package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.model.PaymentMethodModel;
import org.springframework.data.domain.Page;

public interface PaymentMethodService {
    Page<PaymentMethodModel> getAll(int page, int size);
    PaymentMethodModel getById(Long id);
    PaymentMethodModel create(String nombre);
    PaymentMethodModel update(Long id, String nombre);
    void delete(Long id);
}
