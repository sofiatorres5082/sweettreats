package com.sweettreats.SweetTreats.config.filter;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.sweettreats.SweetTreats.util.JwtUtil;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;

// Ejecuta este filtro por cada request.
public class JwtTokenValidator extends OncePerRequestFilter {
    private JwtUtil jwtUtils;

    public JwtTokenValidator(JwtUtil jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String jwtToken = null;

        // Buscar la cookie llamada "token"
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("jwt")) {
                    System.out.println("Cookie recibida: " + cookie.getName() + "=" + cookie.getValue());

                    jwtToken = cookie.getValue();
                    break;
                }
            }
        }

        if (jwtToken != null) {
            try {
                DecodedJWT decodedJWT = jwtUtils.validateToken(jwtToken);

                String username = jwtUtils.extractUsername(decodedJWT);
                String stringAuthorities = jwtUtils.getSpecificClaim(decodedJWT, "authorities").asString();

                Collection<? extends GrantedAuthority> authorities =
                        AuthorityUtils.commaSeparatedStringToAuthorityList(stringAuthorities);

                SecurityContext context = SecurityContextHolder.createEmptyContext();
                Authentication authenticationToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
                context.setAuthentication(authenticationToken);
                SecurityContextHolder.setContext(context);

            } catch (Exception ex) {
                // Puedes loguear o manejar la excepción si el token no es válido
                System.out.println("Token inválido: " + ex.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
