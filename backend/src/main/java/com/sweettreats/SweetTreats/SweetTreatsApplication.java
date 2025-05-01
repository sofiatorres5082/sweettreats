package com.sweettreats.SweetTreats;

import com.sweettreats.SweetTreats.model.PermissionModel;
import com.sweettreats.SweetTreats.model.RoleEnum;
import com.sweettreats.SweetTreats.model.RoleModel;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@SpringBootApplication
public class SweetTreatsApplication {

	public static void main(String[] args) {
		SpringApplication.run(SweetTreatsApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UserRepository userRepository) {
		return args -> {

			// Verificar si ya existe el admin
			Optional<UserModel> existingAdmin = userRepository.findUserModelByEmail("sofia@admin.com");

			if (existingAdmin.isEmpty()) {
				// Permisos
				PermissionModel create = PermissionModel.builder().name("CREATE").build();
				PermissionModel read = PermissionModel.builder().name("READ").build();
				PermissionModel update = PermissionModel.builder().name("UPDATE").build();
				PermissionModel delete = PermissionModel.builder().name("DELETE").build();

				// Roles
				RoleModel roleAdmin = RoleModel.builder()
						.roleEnum(RoleEnum.ADMIN)
						.permissionList(Set.of(create, read, update, delete))
						.build();

				RoleModel roleUser = RoleModel.builder()
						.roleEnum(RoleEnum.USER)
						.permissionList(Set.of(create, read))
						.build();

				// Usuarios
				UserModel userAdmin = UserModel.builder()
						.name("sofia")
						.email("sofia@admin.com")
						.password("$2a$10$S.UYJXQW4D/sZLwPRj5c4uPs.e5bjcqwmp06sZprUcrhmNwxgKa4K") // hashed
						.isEnabled(true)
						.accountNoExpired(true)
						.accountNoLocked(true)
						.credentialNoExpired(true)
						.roles(Set.of(roleAdmin))
						.build();

				UserModel userRafe = UserModel.builder()
						.name("Rafe")
						.email("rafe@user.com")
						.password("$2a$10$S.UYJXQW4D/sZLwPRj5c4uPs.e5bjcqwmp06sZprUcrhmNwxgKa4K")
						.isEnabled(true)
						.accountNoExpired(true)
						.accountNoLocked(true)
						.credentialNoExpired(true)
						.roles(Set.of(roleUser))
						.build();

				userRepository.saveAll(List.of(userAdmin, userRafe));
			}
		};
	}
}
