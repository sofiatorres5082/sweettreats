package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.model.ProductModel;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IProductService {
    Page<ProductModel> getAll(int page, int size);
    ProductModel getById(Long id);
}
