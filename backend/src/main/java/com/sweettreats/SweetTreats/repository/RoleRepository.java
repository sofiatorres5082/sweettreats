package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.model.RoleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<RoleModel, Long> {

    List<RoleModel> findRoleEntitiesByRoleEnumIn(List<String> roleNames);

}