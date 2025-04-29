package com.sweettreats.SweetTreats.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"name", "message", "status", "jwt"})
public record AuthResponse( String name,
                            String message,
                            String jwt,
                            Boolean status) {
}
