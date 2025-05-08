package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.model.ProductModel;

import java.util.List;
import java.util.Optional;

public interface IProductService {
    List<ProductModel> getAll();
    Optional<ProductModel> getById(Long id);
}
