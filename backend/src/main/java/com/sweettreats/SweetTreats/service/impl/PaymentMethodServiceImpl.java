package com.sweettreats.SweetTreats.service.impl;

import com.sweettreats.SweetTreats.dto.PaymentMethodDTO;
import com.sweettreats.SweetTreats.model.PaymentMethodModel;
import com.sweettreats.SweetTreats.repository.PaymentMethodRepository;
import com.sweettreats.SweetTreats.service.PaymentMethodService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {

    private final PaymentMethodRepository repo;

    public PaymentMethodServiceImpl(PaymentMethodRepository repo) {
        this.repo = repo;
    }

    @Override
    public Page<PaymentMethodModel> getAll(int page, int size) {
        Pageable pg = PageRequest.of(page, size, Sort.by("id"));
        return repo.findAll(pg);
    }

    @Override
    public PaymentMethodModel getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Método de pago no encontrado"));
    }

    @Override
    public PaymentMethodModel create(String nombre) {
        PaymentMethodModel pm = new PaymentMethodModel();
        pm.setNombre(nombre);
        return repo.save(pm);
    }

    @Override
    public PaymentMethodModel update(Long id, String nombre) {
        PaymentMethodModel existing = getById(id);
        existing.setNombre(nombre);
        return repo.save(existing);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        PaymentMethodModel existing = getById(id);
        repo.delete(existing);
    }

    @Override
    public List<PaymentMethodDTO> getAllPaymentMethods() {
        return repo.findAll()
                .stream()
                .map(pm -> new PaymentMethodDTO(pm.getId(), pm.getNombre()))
                .collect(Collectors.toList());
    }
}
