package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.dto.*;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.UserRepository;
import com.sweettreats.SweetTreats.service.CustomUserDetailsService;
import com.sweettreats.SweetTreats.service.IUserService;
import com.sweettreats.SweetTreats.service.UserService;
import com.sweettreats.SweetTreats.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private CustomUserDetailsService userDetailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/sign-up")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthCreateUserRequest userRequest, HttpServletResponse response) {
        AuthResponse authResponse = this.userDetailService.createUser(userRequest);

        ResponseCookie cookie = ResponseCookie.from("jwt", authResponse.jwt())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/log-in")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody AuthLoginRequest userRequest, HttpServletResponse response) {
        AuthResponse authResponse = this.userDetailService.loginUser(userRequest);

        ResponseCookie cookie = ResponseCookie.from("jwt", authResponse.jwt())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        UserModel user = userRepository.findUserModelByEmail(userRequest.email())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRoles(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );

        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().build();
    }

    // Verificar si el JWT es válido
    @GetMapping("/verify-session")
    public ResponseEntity<Void> verifySession(HttpServletRequest request) {
        String token = extractTokenFromCookies(request);
        if (token != null && jwtUtil.validateToken(token) != null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // Obtener datos del usuario actual usando el JWT
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        UserModel user = userRepository.findUserModelByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRoles(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest req,
            HttpServletResponse response
    ) {
        // 1) obtener la entidad UserModel de la sesión
        UserModel me = userRepository.findUserModelByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2) delegar a UserService.updateProfile
        UserResponse updated = userService.updateProfile(me.getId(), req);

        // 3) generar nuevo JWT (mantener mismas authorities)
        List<SimpleGrantedAuthority> authorities = authentication.getAuthorities().stream()
                .map(a -> new SimpleGrantedAuthority(a.getAuthority()))
                .collect(Collectors.toList());
        Authentication newAuth = new UsernamePasswordAuthenticationToken(
                updated.email(), null, authorities
        );
        String newJwt = jwtUtil.createToken(newAuth);

        // 4) sobreescribir cookie
        ResponseCookie cookie = ResponseCookie.from("jwt", newJwt)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(updated);
    }


    // Método auxiliar para extraer el token de las cookies
    private String extractTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
