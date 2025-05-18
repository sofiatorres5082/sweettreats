package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;
    public ProductController(ProductService service) { this.service = service; }


    // LISTADO PÚBLICO
    @GetMapping
    public ResponseEntity<Page<ProductModel>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.getAll(page, size));
    }

    // CONSULTA PÚBLICA
    @GetMapping("/{id}")
    public ResponseEntity<ProductModel> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // CREAR → sólo ADMIN
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductModel> create(
            @RequestParam String nombre,
            @RequestParam Double precio,
            @RequestParam Integer stock,
            @RequestParam(required = false) String descripcion,
            @RequestPart(required = false) MultipartFile imagen
    ) {
        ProductModel saved = service.create(nombre, precio, stock, descripcion, imagen);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ACTUALIZAR → sólo ADMIN
    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductModel> update(
            @PathVariable Long id,
            @RequestParam String nombre,
            @RequestParam Double precio,
            @RequestParam Integer stock,
            @RequestParam(required = false) String descripcion,
            @RequestPart(required = false) MultipartFile imagen,
            @RequestParam(name="mantenerImagen", required = false, defaultValue = "true") boolean mantenerImagen
    ) {
        ProductModel updated = service.update(id, nombre, precio, stock, descripcion, imagen, mantenerImagen);
        return ResponseEntity.ok(updated);
    }


    // ELIMINAR → sólo ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
