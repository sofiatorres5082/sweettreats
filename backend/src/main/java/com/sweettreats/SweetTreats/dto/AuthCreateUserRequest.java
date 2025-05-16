package com.sweettreats.SweetTreats.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.lang.Nullable;

public record AuthCreateUserRequest(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 50, message = "El nombre no puede tener más de 50 caracteres")
        String name,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "Debe tener un formato de email válido")
        @Size(max = 100, message = "El email no puede tener más de 100 caracteres")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$",
                message = "Debe contener al menos una mayúscula, un número y un carácter especial"
        )
        String password,

        @Valid
        @Nullable
        AuthCreateRoleRequest roleRequest

) {}
