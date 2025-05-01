package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.dto.AuthCreateUserRequest;
import com.sweettreats.SweetTreats.dto.AuthLoginRequest;
import com.sweettreats.SweetTreats.dto.AuthResponse;
import com.sweettreats.SweetTreats.model.RoleEnum;
import com.sweettreats.SweetTreats.model.RoleModel;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.RoleRepository;
import com.sweettreats.SweetTreats.repository.UserRepository;
import com.sweettreats.SweetTreats.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements IUserDetailsService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // Metodo que busca un usuario en base de datos
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

        return new User(userModel.getEmail(),
                userModel.getPassword(),
                userModel.isEnabled(),
                userModel.isAccountNoExpired(),
                userModel.isCredentialNoExpired(),
                userModel.isAccountNoLocked(),
                authorityList
                );
    }

    // Metodo para crear/registrar un usuario
    @Override
    public AuthResponse createUser(AuthCreateUserRequest createUserRequest) {
        String name = createUserRequest.name();
        String email = createUserRequest.email();
        String password = createUserRequest.password();

        Set<RoleModel> roleModels;

        if (createUserRequest.roleRequest() != null &&
                createUserRequest.roleRequest().roleListName() != null &&
                !createUserRequest.roleRequest().roleListName().isEmpty()) {

            roleModels = new HashSet<>(
                    roleRepository.findRoleEntitiesByRoleEnumIn(createUserRequest.roleRequest().roleListName())
            );

            if (roleModels.isEmpty()) {
                throw new IllegalArgumentException("Los roles especificados no existen.");
            }

        } else {
            roleModels = Set.of(
                    roleRepository.findByRoleEnum(RoleEnum.USER)
                            .orElseThrow(() -> new RuntimeException("El rol USER no fue encontrado en la base de datos."))
            );
        }

        UserModel user = UserModel.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .roles(roleModels)
                .isEnabled(true)
                .accountNoExpired(true)
                .accountNoLocked(true)
                .credentialNoExpired(true)
                .build();

        UserModel savedUser = userRepository.save(user);

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        savedUser.getRoles().forEach(role -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRoleEnum().name())));
        savedUser.getRoles().stream()
                .flatMap(role -> role.getPermissionList().stream())
                .forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission.getName())));

        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser, null, authorities);
        String token = jwtUtil.createToken(authentication);

        return new AuthResponse(name, "User created successfully", token, true);
    }

    // Metodo que permite loguearnos
    @Override
    public AuthResponse loginUser(AuthLoginRequest authLoginRequest) {
        String email = authLoginRequest.email();
        String password = authLoginRequest.password();

        Authentication authentication = authenticate(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtUtil.createToken(authentication);

        return new AuthResponse(email, "Inicio de sesión exitoso", token, true);
    }

    // Metodo que permite autenticarnos
    @Override
    public Authentication authenticate(String email, String password) {
        UserDetails userDetails = loadUserByUsername(email);

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Contraseña incorrecta");
        }

        return new UsernamePasswordAuthenticationToken(email, password, userDetails.getAuthorities());
    }

}

