package com.sweettreats.SweetTreats.dto;

import com.sweettreats.SweetTreats.model.RoleModel;

import java.time.LocalDateTime;
import java.util.Set;

public record UserResponse(
        Long id,
        String name,
        String email,
        Set<RoleModel> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
