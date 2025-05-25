package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.dto.ChangePasswordRequest;
import com.sweettreats.SweetTreats.dto.ProfileUpdateRequest;
import com.sweettreats.SweetTreats.dto.UserResponse;
import com.sweettreats.SweetTreats.dto.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserResponse> getAllUsers(Pageable pageable);
    UserResponse getUserById(Long id);
    UserResponse updateUser(Long id, UserUpdateRequest request);
    void deleteUser(Long id);
    UserResponse updateProfile(Long id, ProfileUpdateRequest req);
    void changePassword(Long userId, ChangePasswordRequest req);

}
