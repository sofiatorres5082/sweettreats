package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.dto.UserResponse;
import com.sweettreats.SweetTreats.dto.UserUpdateRequest;
import com.sweettreats.SweetTreats.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Usuarios", description = "Gestión de usuarios (solo ADMIN)")
@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary     = "Listar usuarios",
            description = "Devuelve una página de todos los usuarios registrados"
    )
    @ApiResponse(responseCode = "200", description = "Página de usuarios obtenida")
    @GetMapping
    public ResponseEntity<Page<UserResponse>> listUsers(
            @Parameter(description = "Número de página (0-index)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página", example = "10")
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponse> usuarios = userService.getAllUsers(pageable);
        return ResponseEntity.ok(usuarios);
    }

    @Operation(
            summary     = "Obtener usuario por ID",
            description = "Devuelve los datos de un usuario específico"
    )
    @ApiResponse(responseCode = "200", description = "Usuario encontrado")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    @Parameter(name = "id", description = "ID del usuario", required = true, example = "123")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Operation(
            summary     = "Actualizar usuario (ADMIN)",
            description = "Modifica nombre, email o roles de un usuario"
    )
    @ApiResponse(responseCode = "200", description = "Usuario actualizado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos de actualización inválidos")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    @Parameter(name = "id", description = "ID del usuario", required = true, example = "123")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request
    ) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @Operation(
            summary     = "Eliminar usuario (ADMIN)",
            description = "Elimina un usuario del sistema"
    )
    @ApiResponse(responseCode = "204", description = "Usuario eliminado correctamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    @Parameter(name = "id", description = "ID del usuario", required = true, example = "123")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id
    ) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
