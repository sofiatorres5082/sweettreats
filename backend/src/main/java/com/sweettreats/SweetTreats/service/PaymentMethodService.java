package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.dto.PaymentMethodDTO;
import com.sweettreats.SweetTreats.model.PaymentMethodModel;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PaymentMethodService {
    List<PaymentMethodDTO> getAllPaymentMethods();

    Page<PaymentMethodModel> getAll(int page, int size);
    PaymentMethodModel getById(Long id);
    PaymentMethodModel create(String nombre);
    PaymentMethodModel update(Long id, String nombre);
    void delete(Long id);
}
