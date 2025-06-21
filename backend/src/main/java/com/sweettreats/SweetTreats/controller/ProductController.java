package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.model.Status;
import com.sweettreats.SweetTreats.service.ProductServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Tag(name = "Productos", description = "CRUD de productos (público y ADMIN)")
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductServiceImpl service;
    public ProductController(ProductServiceImpl service) { this.service = service; }

    @Operation(
            summary     = "Listar productos activos",
            description = "Devuelve una página de productos con estado ACTIVE"
    )
    @ApiResponse(responseCode = "200", description = "Página de productos retornada")
    @GetMapping
    public ResponseEntity<Page<ProductModel>> listActive(
            @Parameter(description = "Número de página (0-index)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ProductModel> activos = service.getAll(page, size);
        return ResponseEntity.ok(activos);
    }

    @Operation(
            summary     = "Obtener detalle de un producto",
            description = "Devuelve los datos de un producto por su ID"
    )
    @ApiResponse(responseCode = "200", description = "Producto encontrado")
    @ApiResponse(responseCode = "404", description = "Producto no existe")
    @Parameter(name = "id", description = "ID del producto", required = true, example = "42")
    @GetMapping("/{id}")
    public ResponseEntity<ProductModel> get(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.getById(id));
    }

    @Operation(
            summary     = "Crear producto",
            description = "Crea un nuevo producto (solo ADMIN). Permite opcionalmente subir una imagen."
    )
    @ApiResponse(responseCode = "201", description = "Producto creado correctamente")
    @ApiResponse(responseCode = "403", description = "Acceso denegado para usuarios no administradores")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductModel> create(
            @Parameter(description = "Nombre del producto", required = true)  @RequestParam String nombre,
            @Parameter(description = "Precio del producto", required = true)  @RequestParam Double precio,
            @Parameter(description = "Stock inicial", required = true)       @RequestParam Integer stock,
            @Parameter(description = "Descripción (opcional)")              @RequestParam(required = false) String descripcion,
            @Parameter(description = "Imagen del producto (opcional)")      @RequestPart(required = false) MultipartFile imagen
    ) {
        ProductModel saved = service.create(nombre, precio, stock, descripcion, imagen);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @Operation(
            summary     = "Actualizar producto",
            description = "Modifica un producto existente (solo ADMIN). Puede mantener o reemplazar la imagen."
    )
    @ApiResponse(responseCode = "200", description = "Producto actualizado correctamente")
    @ApiResponse(responseCode = "403", description = "Acceso denegado para usuarios no administradores")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductModel> update(
            @Parameter(description = "ID del producto", required = true, example = "42") @PathVariable Long id,
            @Parameter(description = "Nuevo nombre", required = true)                   @RequestParam String nombre,
            @Parameter(description = "Nuevo precio", required = true)                   @RequestParam Double precio,
            @Parameter(description = "Nuevo stock", required = true)                    @RequestParam Integer stock,
            @Parameter(description = "Nueva descripción (opcional)")                    @RequestParam(required = false) String descripcion,
            @Parameter(description = "Nueva imagen (opcional)")                        @RequestPart(required = false) MultipartFile imagen,
            @Parameter(description = "Mantener imagen existente", example = "true")      @RequestParam(name="mantenerImagen", defaultValue = "true") boolean mantenerImagen
    ) {
        ProductModel updated = service.update(id, nombre, precio, stock, descripcion, imagen, mantenerImagen);
        return ResponseEntity.ok(updated);
    }

    @Operation(
            summary     = "Eliminar producto",
            description = "Elimina un producto (solo ADMIN). Falla si hay pedidos asociados."
    )
    @ApiResponse(responseCode = "204", description = "Producto eliminado")
    @ApiResponse(responseCode = "409", description = "No se puede eliminar; pedidos asociados")
    @ApiResponse(responseCode = "403", description = "Acceso denegado para usuarios no administradores")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> inactivate(@PathVariable Long id) {
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/status")
    public ResponseEntity<Page<ProductModel>> listByStatus(
            @RequestParam Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ProductModel> pagina = service.getByStatus(status, page, size);
        return ResponseEntity.ok(pagina);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/activate")
    public ResponseEntity<ProductModel> activate(@PathVariable Long id) {
        ProductModel p = service.reactivate(id);
        return ResponseEntity.ok(p);
    }
}
