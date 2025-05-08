package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productoService;

    public ProductController(ProductService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<ProductModel> getAll() {
        return productoService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductModel> getById(@PathVariable Long id) {
        return productoService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}