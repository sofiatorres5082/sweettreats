package com.sweettreats.SweetTreats.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI sweetTreatsOpenAPI() {
        SecurityScheme bearerAuth = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER)
                .name("Authorization");

        Schema<?> errorResponse = new Schema<>()
                .type("object")
                .addProperties("message", new StringSchema()
                        .description("Detalle del error"));

        Components components = new Components()
                .addSecuritySchemes("bearerAuth", bearerAuth)
                .addSchemas("ErrorResponse", errorResponse);
        
        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("bearerAuth");

        return new OpenAPI()
                .components(components)
                .addSecurityItem(securityRequirement)
                .info(new Info()
                        .title("SweetTreats API")
                        .version("v1.0")
                        .description("API REST para gestionar SweetTreats E-Commerce"));
    }
}
