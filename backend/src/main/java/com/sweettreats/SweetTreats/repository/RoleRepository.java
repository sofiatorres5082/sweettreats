package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.model.RoleEnum;
import com.sweettreats.SweetTreats.model.RoleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleModel, Long> {

    List<RoleModel> findRoleEntitiesByRoleEnumIn(List<String> roleNames);

    Optional<RoleModel> findByRoleEnum(RoleEnum roleEnum);

}