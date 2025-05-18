// src/main/java/com/sweettreats/SweetTreats/service/ProductService.java
package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.*;
import java.nio.file.*;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService implements IProductService {

    private final ProductRepository repo;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    @Override
    public Page<ProductModel> getAll(int page, int size) {
        Pageable pg = PageRequest.of(page, size, Sort.by("id"));
        return repo.findAll(pg);
    }

    @Override
    public ProductModel getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    @Override
    public ProductModel create(String nombre,
                               Double precio,
                               Integer stock,
                               String descripcion,
                               MultipartFile imagen) {

        ProductModel product = new ProductModel();
        product.setNombre(nombre);
        product.setPrecio(precio);
        product.setStock(stock);
        product.setDescripcion(descripcion);

        if (imagen != null && !imagen.isEmpty()) {
            product.setImagen(saveImage(imagen));
        }

        return repo.save(product);
    }

    @Override
    public ProductModel update(Long id,
                               String nombre,
                               Double precio,
                               Integer stock,
                               String descripcion,
                               MultipartFile imagen,
                               Boolean mantenerImagen) {

        ProductModel existing = getById(id);
        existing.setNombre(nombre);
        existing.setPrecio(precio);
        existing.setStock(stock);
        existing.setDescripcion(descripcion);

        if (imagen != null && !imagen.isEmpty()) {
            existing.setImagen(saveImage(imagen));
        } else if (!mantenerImagen) {
            existing.setImagen(null);
        }

        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        repo.deleteById(id);
    }

    private String saveImage(MultipartFile file) {
        try {
            // Validaciones básicas
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Archivo no es una imagen");
            }
            if (file.getSize() > 2 * 1024 * 1024) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Imagen excede 2MB");
            }

            String ext = Optional.ofNullable(file.getOriginalFilename())
                    .filter(n -> n.contains("."))
                    .map(n -> n.substring(n.lastIndexOf(".") + 1))
                    .orElse("jpg");
            String filename = UUID.randomUUID() + "." + ext;

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path target = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            System.out.println(">>> Imagen guardada en: " + target.toAbsolutePath());
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo guardar la imagen", e);
        }
    }
}
