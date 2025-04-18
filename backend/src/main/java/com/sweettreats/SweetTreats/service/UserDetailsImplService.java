package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserDetailsImplService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        UserModel userModel = userRepository.findUserModelByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("El email " + email + " no existe."));

        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();

        userModel.getRoles()
                .forEach(role -> authorityList.add(new SimpleGrantedAuthority("ROLE_".concat(role.getRoleEnum().name()))));

        userModel.getRoles().stream()
                .flatMap(role -> role.getPermissionList().stream())
                .forEach(permission -> authorityList.add(new SimpleGrantedAuthority(permission.getName())));


        return new User(userModel.getName(),
                userModel.getEmail(),
                userModel.isEnabled(),
                userModel.isAccountNoExpired(),
                userModel.isCredentialNoExpired(),
                userModel.isAccountNoLocked(),
                authorityList
                );
    }


}

