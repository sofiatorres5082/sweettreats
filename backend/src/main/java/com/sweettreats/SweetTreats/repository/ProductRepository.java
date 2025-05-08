package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.model.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductModel, Long> {
    List<ProductModel> findByNombreContainingIgnoreCase(String nombre);
}
