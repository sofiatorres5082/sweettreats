package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.dto.ProfileUpdateRequest;
import com.sweettreats.SweetTreats.dto.UserResponse;
import com.sweettreats.SweetTreats.dto.UserUpdateRequest;
import com.sweettreats.SweetTreats.model.RoleModel;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.RoleRepository;
import com.sweettreats.SweetTreats.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
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

        // Actualizar nombre y email
        user.setName(req.name());
        user.setEmail(req.email());

        // Convertir Set<RoleEnum> a List<String>
        List<String> roleNames = req.roles()
                .stream()
                .map(Enum::name)
                .toList();

        // Buscar las entidades RoleModel por sus nombres
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
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        userRepository.deleteById(id);
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