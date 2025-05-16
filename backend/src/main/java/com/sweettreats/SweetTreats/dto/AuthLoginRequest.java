package com.sweettreats.SweetTreats.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthLoginRequest(
        @NotBlank(message = "El campo email no debe estar vacío")
        @Email(message = "El formato del email es inválido")
        String email,

        @NotBlank(message = "El campo contraseña no debe estar vacío")
        String password

) {}
