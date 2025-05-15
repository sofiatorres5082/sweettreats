package com.sweettreats.SweetTreats.dto;

import com.sweettreats.SweetTreats.model.RoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public record UserUpdateRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        Set<RoleEnum> roles
) {}