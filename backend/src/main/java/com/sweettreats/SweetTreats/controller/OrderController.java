package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.dto.OrderRequest;
import com.sweettreats.SweetTreats.model.OrderModel;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.OrderRepository;
import com.sweettreats.SweetTreats.repository.UserRepository;
import com.sweettreats.SweetTreats.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService, UserRepository userRepository, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<List<OrderModel>> obtenerPedidosDelUsuario(Authentication authentication) {
        UserModel user = userRepository.findUserModelByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<OrderModel> pedidos = orderService.obtenerPedidosDeUsuario(user);
        return ResponseEntity.ok(pedidos);
    }


    @PostMapping
    public ResponseEntity<OrderModel> crearPedido(@RequestBody @Valid OrderRequest request, Authentication authentication) {
        UserModel user = userRepository.findUserModelByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        OrderModel nuevoPedido = orderService.crearPedido(request, user);
        return ResponseEntity.ok(nuevoPedido);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderModel> obtenerPedido(@PathVariable Long id, Authentication authentication) {
        UserModel user = userRepository.findUserModelByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        OrderModel pedido = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (!pedido.getUsermodel().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(pedido);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<OrderModel>> obtenerTodosLosPedidos() {
        return ResponseEntity.ok(orderRepository.findAll());
    }


}
