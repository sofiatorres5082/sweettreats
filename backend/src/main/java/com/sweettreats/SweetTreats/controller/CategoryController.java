package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.model.CategoryModel;
import com.sweettreats.SweetTreats.service.impl.CategoryServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Categorías", description = "CRUD de categorías de productos")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryServiceImpl service;

    public CategoryController(CategoryServiceImpl service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<CategoryModel>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(service.getAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryModel> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<CategoryModel> create(@RequestParam String nombre) {
        return ResponseEntity.ok(service.create(nombre));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryModel> update(
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
