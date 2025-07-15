package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.model.Status;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {
    Page<ProductModel> getAll(int page, int size);
    ProductModel getById(Long id);
    ProductModel create(String nombre, Double precio, Integer stock, String descripcion, MultipartFile imagen);
    ProductModel update(Long id, String nombre, Double precio, Integer stock, String descripcion, MultipartFile imagen, Boolean mantenerImagen);
    Page<ProductModel> getByStatus(Status status, int page, int size);
}
