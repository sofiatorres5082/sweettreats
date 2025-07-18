package com.sweettreats.SweetTreats.service.impl;

import com.sweettreats.SweetTreats.dto.ChangePasswordRequest;
import com.sweettreats.SweetTreats.dto.ProfileUpdateRequest;
import com.sweettreats.SweetTreats.dto.UserResponse;
import com.sweettreats.SweetTreats.dto.UserUpdateRequest;
import com.sweettreats.SweetTreats.model.RoleModel;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.RoleRepository;
import com.sweettreats.SweetTreats.repository.UserRepository;
import com.sweettreats.SweetTreats.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = encoder;
    }

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findByIsEnabledTrue(pageable)
                .map(this::toResponse);
    }

    @Override
    public UserResponse getUserById(Long id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return toResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id, UserUpdateRequest req) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        user.setName(req.name());
        user.setEmail(req.email());

        List<String> roleNames = req.roles()
                .stream()
                .map(Enum::name)
                .toList();

        Set<RoleModel> nuevosRoles = new HashSet<>(
                roleRepository.findRoleEntitiesByRoleEnumIn(roleNames)
        );
        if (nuevosRoles.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Roles inválidos");
        }
        user.setRoles(nuevosRoles);

        UserModel saved = userRepository.save(user);
        return toResponse(saved);
    }

    public UserResponse updateProfile(Long id, ProfileUpdateRequest req) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        user.setName(req.name());
        user.setEmail(req.email());

        UserModel saved = userRepository.save(user);
        return toResponse(saved);
    }


    @Override
    public void deleteUser(Long id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        user.setEnabled(false);
        user.setAccountNoExpired(false);
        user.setAccountNoLocked(false);
        user.setCredentialNoExpired(false);
        userRepository.save(user);
    }


    public void changePassword(Long userId, ChangePasswordRequest req) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (!passwordEncoder.matches(req.oldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contraseña actual incorrecta");
        }
        user.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);
    }

    private UserResponse toResponse(UserModel u) {
        Set<String> roles = u.getRoles().stream()
                .map(r -> r.getRoleEnum().name())
                .collect(Collectors.toSet());
        return new UserResponse(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getRoles(),
                u.getCreatedAt(),
                u.getUpdatedAt()
        );
    }
}