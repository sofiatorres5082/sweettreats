package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.service.CloudinaryServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Imágenes", description = "Subida de archivos de imagen a Cloudinary")
@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final CloudinaryServiceImpl cloudinaryServiceImpl;

    public ImageController(CloudinaryServiceImpl cloudinaryServiceImpl) {
        this.cloudinaryServiceImpl = cloudinaryServiceImpl;
    }

    @Operation(
            summary     = "Subir imagen",
            description = "Recibe un archivo de imagen y devuelve la URL pública alojada en Cloudinary"
    )
    @ApiResponse(responseCode = "200", description = "URL de la imagen subida")
    @ApiResponse(responseCode = "400", description = "Archivo no válido o faltante")
    @PostMapping("/upload")
    public ResponseEntity<String> upload(
            @Parameter(description = "Archivo de imagen (multipart/form-data)", required = true)
            @RequestParam("file") MultipartFile file
    ) {
        String url = cloudinaryServiceImpl.uploadFile(file);
        return ResponseEntity.ok(url);
    }
}
