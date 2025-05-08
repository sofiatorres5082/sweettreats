package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.dto.AuthCreateUserRequest;
import com.sweettreats.SweetTreats.dto.AuthLoginRequest;
import com.sweettreats.SweetTreats.dto.AuthResponse;
import com.sweettreats.SweetTreats.dto.UserResponse;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.UserRepository;
import com.sweettreats.SweetTreats.service.CustomUserDetailsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private CustomUserDetailsService userDetailService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/sign-up")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthCreateUserRequest userRequest, HttpServletResponse response) {
        AuthResponse authResponse = this.userDetailService.createUser(userRequest);

        Cookie cookie = new Cookie("jwt", authResponse.jwt());
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);

        response.addCookie(cookie);

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }


    @PostMapping("/log-in")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthLoginRequest userRequest, HttpServletResponse response) {
        AuthResponse authResponse = this.userDetailService.loginUser(userRequest);

        Cookie cookie = new Cookie("jwt", authResponse.jwt());
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // una semana

        response.addCookie(cookie);

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    // llamada al backend que lee el JWT desde la cookie y me devuelve los datos del usuario logueado
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        UserModel user = userRepository.findUserModelByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRoles()
        );

        return ResponseEntity.ok(response);
    }


}
