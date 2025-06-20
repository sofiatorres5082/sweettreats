package com.sweettreats.SweetTreats.config;

import com.sweettreats.SweetTreats.config.filter.JwtTokenValidator;
import com.sweettreats.SweetTreats.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration // Le dice a spring que es una clase de configuracion
@EnableWebSecurity // Habilitar la seguridad web
@EnableMethodSecurity // Permite hacer configs con anotaciones propias de spring security
public class SecurityConfig {

    @Autowired
    private JwtUtil jwtUtils;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
       return httpSecurity
               .cors(Customizer.withDefaults())
               .csrf(csrf -> csrf.disable())
               .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
               .authorizeHttpRequests(http -> {
                   // 🔓 SWAGGER
                   http.requestMatchers(
                           "/swagger-ui/**",
                           "/swagger-ui.html",
                           "/v3/api-docs/**"
                   ).permitAll();

                   //  ENDPOINTS PÚBLICOS
                   http.requestMatchers(HttpMethod.POST, "/auth/sign-up").permitAll();
                   http.requestMatchers(HttpMethod.POST, "/auth/log-in").permitAll();
                   http.requestMatchers(HttpMethod.GET, "/api/products/**").permitAll();
                   http.requestMatchers(HttpMethod.GET, "/auth/verify-session").permitAll();
                   http.requestMatchers("/uploads/**").permitAll();

                   // 🔒 ENDPOINTS AUTENTICADOS (cualquier usuario logueado)
                   http.requestMatchers(HttpMethod.GET, "/auth/me").authenticated();
                   http.requestMatchers(HttpMethod.PUT,  "/auth/me").authenticated();
                   http.requestMatchers(HttpMethod.POST, "/auth/logout").authenticated();
                   http.requestMatchers(HttpMethod.POST, "/api/payments/**").authenticated();
                   http.requestMatchers(HttpMethod.PUT,  "/auth/change-password").authenticated();

                   // 🛒 PEDIDOS - solo usuarios autenticados con rol USER
                   http.requestMatchers(HttpMethod.POST, "/api/orders").authenticated();
                   http.requestMatchers(HttpMethod.GET, "/api/orders/**").authenticated();
                   http.requestMatchers(HttpMethod.GET, "/api/orders/{id:[0-9]+}").authenticated();
                   http.requestMatchers(HttpMethod.PUT, "/api/orders/{id:[0-9]+}/cancel").authenticated();

                   // 📊 ADMINISTRACIÓN
                   http.requestMatchers(HttpMethod.GET, "/api/orders/admin/**").hasRole("ADMIN");
                   http.requestMatchers(HttpMethod.PUT,  "/api/orders/admin/{id:[0-9]+}").hasRole("ADMIN");
                   http.requestMatchers(HttpMethod.POST, "/api/products").hasRole("ADMIN");
                   http.requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN");
                   http.requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN");
                   http.requestMatchers(HttpMethod.GET, "/api/reports/**").hasRole("ADMIN");
                   http.requestMatchers(HttpMethod.GET,    "/api/users/**").hasRole("ADMIN");
                   http.requestMatchers(HttpMethod.PUT,    "/api/users/**").hasRole("ADMIN");
                   http.requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN");

                   // ❌ CUALQUIER OTRO REQUEST SE RECHAZA
                   http.anyRequest().denyAll();
               })
               .addFilterBefore(new JwtTokenValidator(jwtUtils), BasicAuthenticationFilter.class)
               .build();
    }

    // Configurar el authentication manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder, UserDetailsService userDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


}
