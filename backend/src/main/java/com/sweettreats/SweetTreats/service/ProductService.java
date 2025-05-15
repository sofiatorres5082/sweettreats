package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService implements IProductService{

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public Page<ProductModel> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
        return repo.findAll(pageable);
    }

    public ProductModel getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    public ProductModel create(ProductModel p) {
        return repo.save(p);
    }

    public ProductModel update(Long id, ProductModel p) {
        ProductModel existing = getById(id);
        existing.setNombre(p.getNombre());
        existing.setPrecio(p.getPrecio());
        existing.setStock(p.getStock());
        existing.setDescripcion(p.getDescripcion());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        repo.deleteById(id);
    }
}
