package com.sweettreats.SweetTreats.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@PreAuthorize("denyAll()")
public class TestAuthController {

    @GetMapping("/get")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('VISITOR')")
    public String helloGet() {
        return "Hello world - GET";
    }

    @PostMapping("/post")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public String helloPost() {
        return "Hello world - POST";
    }

    @PutMapping("/put")
    @PreAuthorize("hasRole('ADMIN')")
    public String helloPut() {
        return "Hello world - PUT";
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public String helloDelete() {
        return "Hello world - DELETE";
    }

    @PatchMapping("/patch")
    @PreAuthorize("hasRole('ADMIN')")
    public String helloPatch() {
        return "Hello world - PATCH";
    }

}
