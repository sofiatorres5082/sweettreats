package com.sweettreats.SweetTreats;

import com.sweettreats.SweetTreats.model.*;
import com.sweettreats.SweetTreats.repository.CategoryRepository;
import com.sweettreats.SweetTreats.repository.PaymentMethodRepository;
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
	CommandLineRunner init(
			UserRepository userRepository,
			ProductRepository productRepository,
			CategoryRepository categoryRepository,
			PaymentMethodRepository paymentMethodRepository
	) {
		return args -> {

			// ==== Usuarios ====
			Optional<UserModel> existingAdmin = userRepository.findUserModelByEmail("sofia@admin.com");

			if (existingAdmin.isEmpty()) {
				// permisos y roles
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
						.name("Sofía")
						.email("sofia@admin.com")
						.password("$2a$10$S.UYJXQW4D/sZLwPRj5c4uPs.e5bjcqwmp06sZprUcrhmNwxgKa4K")
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

			// ==== Categorías ====
			CategoryModel cakes;
			CategoryModel cheesecakes;
			CategoryModel chocolate;
			CategoryModel fruit;

			if (categoryRepository.count() == 0) {
				cakes = categoryRepository.save(CategoryModel.builder().nombre("Cakes").build());
				cheesecakes = categoryRepository.save(CategoryModel.builder().nombre("Cheesecakes").build());
				chocolate = categoryRepository.save(CategoryModel.builder().nombre("Chocolate").build());
				fruit = categoryRepository.save(CategoryModel.builder().nombre("Fruit").build());
			} else {
				List<CategoryModel> savedCategories = categoryRepository.findAll();
				cakes = savedCategories.stream()
						.filter(c -> c.getNombre().equals("Cakes"))
						.findFirst()
						.orElseGet(() -> categoryRepository.save(CategoryModel.builder().nombre("Cakes").build()));
				cakes = savedCategories.stream()
						.filter(c -> c.getNombre().equals("Cakes"))
						.findFirst()
						.orElseGet(() -> categoryRepository.save(CategoryModel.builder().nombre("Cakes").build()));

				cheesecakes = savedCategories.stream()
						.filter(c -> c.getNombre().equals("Cheesecakes"))
						.findFirst()
						.orElseGet(() -> categoryRepository.save(CategoryModel.builder().nombre("Cheesecakes").build()));

				chocolate = savedCategories.stream()
						.filter(c -> c.getNombre().equals("Chocolate"))
						.findFirst()
						.orElseGet(() -> categoryRepository.save(CategoryModel.builder().nombre("Chocolate").build()));

				fruit = savedCategories.stream()
						.filter(c -> c.getNombre().equals("Fruit"))
						.findFirst()
						.orElseGet(() -> categoryRepository.save(CategoryModel.builder().nombre("Fruit").build()));

			}

			// ==== Productos ====
			if (productRepository.count() == 0) {
				productRepository.saveAll(List.of(
						new ProductModel("Blueberry Cake", "Pastel esponjoso con arándanos frescos", 1300.0, "/uploads/blueberry.jpg", 10, cakes),
						new ProductModel("Cheesecake", "Clásico cheesecake al horno con base de galleta", 1400.0, "/uploads/cheesecake.jpg", 12, cheesecakes),
						new ProductModel("Drip Cake de Chocolate", "Decorado con ganache y chispas", 1500.0, "/uploads/chocolatedrip.jpg", 8, chocolate),
						new ProductModel("Confetti Cake", "Pastel festivo con confites de colores", 1250.0, "/uploads/confetti.jpg", 10, cakes),
						new ProductModel("Pastel de Frutos Rojos", "Con frambuesas, moras y arándanos", 1450.0, "/uploads/frutosrojos.jpg", 9, fruit),
						new ProductModel("Red Velvet", "Pastel rojo intenso con frosting de queso crema", 1500.0, "/uploads/redvelvet.jpg", 6, chocolate),
						new ProductModel("Tiramisú", "Clásico postre italiano con café y cacao", 1350.0, "/uploads/tiramisu.jpg", 7, cakes),
						new ProductModel("Triple Chocolate", "Bizcocho de chocolate con mousse y cobertura", 1600.0, "/uploads/triplechocolate.jpg", 5, chocolate)
				));
			}

			// ==== Métodos de Pago ====
			if (paymentMethodRepository.count() == 0) {
				PaymentMethodModel cash = PaymentMethodModel.builder().nombre("Efectivo").build();
				PaymentMethodModel card = PaymentMethodModel.builder().nombre("Tarjeta").build();
				PaymentMethodModel mercadopago = PaymentMethodModel.builder().nombre("MercadoPago").build();

				paymentMethodRepository.saveAll(List.of(cash, card, mercadopago));
			}
		};
	}


}
