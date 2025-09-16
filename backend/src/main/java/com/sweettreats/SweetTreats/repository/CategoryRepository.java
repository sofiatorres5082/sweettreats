package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.model.CategoryModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryModel, Long> {
    Optional<CategoryModel> findByNombre(String nombre);
}
