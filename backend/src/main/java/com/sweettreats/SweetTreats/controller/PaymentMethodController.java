package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.dto.PaymentMethodDTO;
import com.sweettreats.SweetTreats.model.PaymentMethodModel;
import com.sweettreats.SweetTreats.service.PaymentMethodService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Métodos de Pago", description = "CRUD de métodos de pago (solo ADMIN)")
@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    private final PaymentMethodService service;

    public PaymentMethodController(PaymentMethodService service) {
        this.service = service;
    }

    // 🔒 Endpoints admin
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PaymentMethodModel>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(service.getAll(page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentMethodModel> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentMethodModel> create(@RequestParam String nombre) {
        return ResponseEntity.ok(service.create(nombre));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentMethodModel> update(
            @PathVariable Long id,
            @RequestParam String nombre
    ) {
        return ResponseEntity.ok(service.update(id, nombre));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🌐 Endpoint público para clientes
    @GetMapping("/all")
    public ResponseEntity<List<PaymentMethodDTO>> getAllNoPage() {
        List<PaymentMethodDTO> methods = service.getAllPaymentMethods(); // devuelve DTO
        return ResponseEntity.ok(methods);
    }
}
