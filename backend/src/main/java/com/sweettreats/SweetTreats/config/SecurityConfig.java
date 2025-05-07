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
                   // EndPoints publicos
                   http.requestMatchers(HttpMethod.POST, "/auth/**").permitAll();

                   // EndPoints Privados
                   http.requestMatchers(HttpMethod.GET, "/auth/me").authenticated();
                   http.requestMatchers(HttpMethod.GET, "/method/get").hasAuthority("READ");
                   http.requestMatchers(HttpMethod.POST, "/method/post").hasAuthority("CREATE");
                   http.requestMatchers(HttpMethod.DELETE, "/method/delete").hasAuthority("DELETE");
                   http.requestMatchers(HttpMethod.PUT, "/method/put").hasAuthority("UPDATE");

                   http.requestMatchers(HttpMethod.GET, "/home").authenticated();  // O los roles que quieras
                   http.requestMatchers(HttpMethod.GET, "/dashboard").hasAuthority("ADMIN");

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
