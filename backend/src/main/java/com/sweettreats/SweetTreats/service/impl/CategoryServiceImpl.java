package com.sweettreats.SweetTreats.service.impl;

import com.sweettreats.SweetTreats.model.CategoryModel;
import com.sweettreats.SweetTreats.repository.CategoryRepository;
import com.sweettreats.SweetTreats.service.CategoryService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repo;

    public CategoryServiceImpl(CategoryRepository repo) {
        this.repo = repo;
    }

    @Override
    public Page<CategoryModel> getAll(int page, int size) {
        Pageable pg = PageRequest.of(page, size, Sort.by("id"));
        return repo.findAll(pg);
    }

    @Override
    public CategoryModel getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada"));
    }

    @Override
    public CategoryModel create(String nombre) {
        CategoryModel cat = new CategoryModel();
        cat.setNombre(nombre);
        return repo.save(cat);
    }

    @Override
    public CategoryModel update(Long id, String nombre) {
        CategoryModel existing = getById(id);
        existing.setNombre(nombre);
        return repo.save(existing);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        CategoryModel existing = getById(id);
        repo.delete(existing);
    }
}
