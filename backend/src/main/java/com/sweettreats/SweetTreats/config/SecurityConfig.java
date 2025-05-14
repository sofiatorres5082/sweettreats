package com.sweettreats.SweetTreats.config;

import com.sweettreats.SweetTreats.config.filter.JwtTokenValidator;
import com.sweettreats.SweetTreats.service.CustomUserDetailsService;
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
                   // 📌 ENDPOINTS PÚBLICOS
                   http.requestMatchers(HttpMethod.POST, "/auth/**").permitAll();              // login, register
                   http.requestMatchers(HttpMethod.GET, "/api/products").permitAll();
                   http.requestMatchers(HttpMethod.GET, "/auth/verify-session").permitAll();


                   // 🔒 ENDPOINTS AUTENTICADOS (cualquier usuario logueado)
                   http.requestMatchers(HttpMethod.GET, "/auth/me").authenticated();           // perfil
                   http.requestMatchers(HttpMethod.PUT,  "/auth/me").authenticated();          // para editar su perfil
                   http.requestMatchers(HttpMethod.GET, "/home").authenticated();              // página protegida general

                   // 🚀 Permitir a usuarios autenticados crear el PaymentIntent
                   http.requestMatchers(HttpMethod.POST, "/api/payments/**")
                           .authenticated();

                   // 🛒 PEDIDOS - solo usuarios autenticados con rol USER
                   http.requestMatchers(HttpMethod.GET, "/api/orders").authenticated();
                   http.requestMatchers(HttpMethod.POST, "/api/orders").authenticated();
                   http.requestMatchers(HttpMethod.GET, "/api/orders/**").authenticated();


                   // ⚙️ MÉTODOS ADMIN O AVANZADOS (para test)
                   http.requestMatchers(HttpMethod.GET, "/method/get").hasAuthority("READ");
                   http.requestMatchers(HttpMethod.POST, "/method/post").hasAuthority("CREATE");
                   http.requestMatchers(HttpMethod.DELETE, "/method/delete").hasAuthority("DELETE");
                   http.requestMatchers(HttpMethod.PUT, "/method/put").hasAuthority("UPDATE");

                   // 📊 ADMINISTRACIÓN
                   http.requestMatchers(HttpMethod.GET, "/dashboard").hasRole("ADMIN");
                   http.requestMatchers(HttpMethod.GET, "/api/orders/admin/**").hasRole("ADMIN");

                   // 🧑‍💼 CRUD Usuarios (solo ADMIN)
                   http.requestMatchers(HttpMethod.GET,    "/api/users").hasRole("ADMIN");
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
