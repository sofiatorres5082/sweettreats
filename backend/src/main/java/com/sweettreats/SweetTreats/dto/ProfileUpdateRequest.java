package com.sweettreats.SweetTreats.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ProfileUpdateRequest(
        @NotBlank String name,
        @NotBlank @Email String email
) {}