// src/main/java/com/sweettreats/SweetTreats/config/WebMvcConfig.java
package com.sweettreats.SweetTreats.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        System.out.println(">> Mapeando /uploads/** → file:" + uploadDir + "/ y classpath:/static/uploads/");
        registry.addResourceHandler("/uploads/**")
                // primero pruebo en disco (uploads reales),
                // luego en classpath (tus imágenes seed)
                .addResourceLocations(
                        "file:" + uploadDir.replace("\\","/") + "/",
                        "classpath:/static/uploads/"
                )
                .setCachePeriod(0);
    }

}

