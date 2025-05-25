package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.dto.AuthCreateUserRequest;
import com.sweettreats.SweetTreats.dto.AuthLoginRequest;
import com.sweettreats.SweetTreats.dto.AuthResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserDetailsService extends org.springframework.security.core.userdetails.UserDetailsService {
    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;

    AuthResponse createUser(AuthCreateUserRequest createRoleRequest);

    AuthResponse loginUser(AuthLoginRequest authLoginRequest);

    Authentication authenticate(String email, String password);
}
