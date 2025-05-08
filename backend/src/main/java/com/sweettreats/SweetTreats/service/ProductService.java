package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService implements IProductService{

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<ProductModel> getAll() {
        return repo.findAll();
    }

    public Optional<ProductModel> getById(Long id) {
        return repo.findById(id);
    }
}
