package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.model.UserModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findUserModelByEmail(String email);
    Page<UserModel> findByIsEnabledTrue(Pageable pageable);
}
