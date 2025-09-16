package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.model.CategoryModel;
import org.springframework.data.domain.Page;

public interface CategoryService {
    Page<CategoryModel> getAll(int page, int size);
    CategoryModel getById(Long id);
    CategoryModel create(String nombre);
    CategoryModel update(Long id, String nombre);
    void delete(Long id);
}
