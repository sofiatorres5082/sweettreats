package com.sweettreats.SweetTreats.service;

import com.sweettreats.SweetTreats.dto.UserResponse;
import com.sweettreats.SweetTreats.dto.UserUpdateRequest;
import java.util.List;

public interface IUserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    UserResponse updateUser(Long id, UserUpdateRequest request);
    void deleteUser(Long id);
}
