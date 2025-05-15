package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@PreAuthorize("hasRole('ADMIN')")
public class ProductController {
    private final ProductService service;
    public ProductController(ProductService service) { this.service = service; }

    // 📄 Listar paginado
    @GetMapping
    public ResponseEntity<Page<ProductModel>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.getAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductModel> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProductModel> create(@RequestBody ProductModel p) {
        return ResponseEntity.status(201).body(service.create(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductModel> update(
            @PathVariable Long id,
            @RequestBody ProductModel p) {
        return ResponseEntity.ok(service.update(id, p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
