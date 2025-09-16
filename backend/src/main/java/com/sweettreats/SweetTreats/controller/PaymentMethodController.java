package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.model.PaymentMethodModel;
import com.sweettreats.SweetTreats.service.impl.PaymentMethodServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Métodos de Pago", description = "CRUD de métodos de pago (solo ADMIN)")
@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    private final PaymentMethodServiceImpl service;

    public PaymentMethodController(PaymentMethodServiceImpl service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<PaymentMethodModel>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(service.getAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethodModel> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<PaymentMethodModel> create(@RequestParam String nombre) {
        return ResponseEntity.ok(service.create(nombre));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentMethodModel> update(
            @PathVariable Long id,
            @RequestParam String nombre
    ) {
        return ResponseEntity.ok(service.update(id, nombre));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
