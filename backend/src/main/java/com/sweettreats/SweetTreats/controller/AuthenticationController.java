package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.dto.*;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.UserRepository;
import com.sweettreats.SweetTreats.service.CustomUserDetailsServiceImpl;
import com.sweettreats.SweetTreats.service.UserServiceImpl;
import com.sweettreats.SweetTreats.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name = "Autenticación", description = "Registro, login, logout y gestión de sesión")
@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private CustomUserDetailsServiceImpl userDetailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserServiceImpl userServiceImpl;

    @Operation(summary = "Registrar nuevo usuario",
            description = "Crea un usuario y devuelve un JWT en cookie HTTP-only")
    @ApiResponse(responseCode = "201", description = "Usuario creado correctamente")
    @PostMapping("/sign-up")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody AuthCreateUserRequest userRequest,
            HttpServletResponse response) {
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

    @Operation(summary = "Login de usuario",
            description = "Valida credenciales y devuelve datos de usuario más JWT en cookie")
    @ApiResponse(responseCode = "200", description = "Login exitoso")
    @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    @PostMapping("/log-in")
    public ResponseEntity<UserResponse> login(
            @Valid @RequestBody AuthLoginRequest userRequest,
            HttpServletResponse response) {
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

        if (!user.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Cuenta desactivada");
        }


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

    @Operation(summary = "Logout de usuario",
            description = "Elimina la cookie JWT")
    @ApiResponse(responseCode = "200", description = "Logout exitoso")
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

    @Operation(summary = "Verificar sesión",
            description = "Comprueba si el JWT en cookie es válido")
    @ApiResponse(responseCode = "200", description = "JWT válido")
    @ApiResponse(responseCode = "401", description = "JWT inválido o ausente")
    @GetMapping("/verify-session")
    public ResponseEntity<Void> verifySession(HttpServletRequest request) {
        String token = extractTokenFromCookies(request);
        if (token != null && jwtUtil.validateToken(token) != null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @Operation(summary = "Obtener usuario actual",
            description = "Devuelve los datos del usuario autenticado")
    @ApiResponse(responseCode = "200", description = "Datos del usuario")
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

    @Operation(summary = "Actualizar perfil",
            description = "Modifica nombre y/o email del usuario y regenera JWT")
    @ApiResponse(responseCode = "200", description = "Perfil actualizado")
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest req,
            HttpServletResponse response
    ) {
        UserModel me = userRepository.findUserModelByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UserResponse updated = userServiceImpl.updateProfile(me.getId(), req);

        List<SimpleGrantedAuthority> authorities = authentication.getAuthorities().stream()
                .map(a -> new SimpleGrantedAuthority(a.getAuthority()))
                .collect(Collectors.toList());
        Authentication newAuth = new UsernamePasswordAuthenticationToken(
                updated.email(), null, authorities
        );
        String newJwt = jwtUtil.createToken(newAuth);

        ResponseCookie cookie = ResponseCookie.from("jwt", newJwt)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Cambiar contraseña",
            description = "Permite al usuario actualizar su contraseña")
    @ApiResponse(responseCode = "200", description = "Contraseña cambiada correctamente")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest req
    ) {
        try {
            UserModel me = userRepository.findUserModelByEmail(authentication.getName())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
            userServiceImpl.changePassword(me.getId(), req);
            return ResponseEntity.ok(Map.of("message", "Contraseña cambiada correctamente"));
        } catch (ResponseStatusException ex) {
            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body(Map.of("message", ex.getReason()));
        }
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
