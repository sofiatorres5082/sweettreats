package com.sweettreats.SweetTreats;

import com.sweettreats.SweetTreats.model.*;
import com.sweettreats.SweetTreats.repository.ProductRepository;
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
	CommandLineRunner init(UserRepository userRepository, ProductRepository productRepository) {
		return args -> {

			// ==== Usuarios ====
			Optional<UserModel> existingAdmin = userRepository.findUserModelByEmail("sofia@admin.com");

			if (existingAdmin.isEmpty()) {
				PermissionModel create = PermissionModel.builder().name("CREATE").build();
				PermissionModel read = PermissionModel.builder().name("READ").build();
				PermissionModel update = PermissionModel.builder().name("UPDATE").build();
				PermissionModel delete = PermissionModel.builder().name("DELETE").build();

				RoleModel roleAdmin = RoleModel.builder()
						.roleEnum(RoleEnum.ADMIN)
						.permissionList(Set.of(create, read, update, delete))
						.build();

				RoleModel roleUser = RoleModel.builder()
						.roleEnum(RoleEnum.USER)
						.permissionList(Set.of(create, read))
						.build();

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

				// ==== Productos ====
				if (productRepository.count() == 0) {
					productRepository.saveAll(List.of(
							new ProductModel("Blueberry Cake", "Pastel esponjoso con arándanos frescos", 1300.0, "blueberry", 10),
							new ProductModel("Cheesecake", "Clásico cheesecake al horno con base de galleta", 1400.0, "cheesecake", 12),
							new ProductModel("Drip Cake de Chocolate", "Decorado con ganache y chispas", 1500.0, "chocolatedrip", 8),
							new ProductModel("Confetti Cake", "Pastel festivo con confites de colores", 1250.0, "confetti", 10),
							new ProductModel("Pastel de Frutos Rojos", "Con frambuesas, moras y arándanos", 1450.0, "frutosrojos", 9),
							new ProductModel("Red Velvet", "Pastel rojo intenso con frosting de queso crema", 1500.0, "redvelvet", 6),
							new ProductModel("Tiramisú", "Clásico postre italiano con café y cacao", 1350.0, "tiramisu", 7),
							new ProductModel("Triple Chocolate", "Bizcocho de chocolate con mousse y cobertura", 1600.0, "triplechocolate", 5)
					));
				}

			}
		};
	}
}
