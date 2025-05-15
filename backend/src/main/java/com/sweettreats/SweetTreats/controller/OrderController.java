package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.dto.OrderRequest;
import com.sweettreats.SweetTreats.dto.OrderResponse;
import com.sweettreats.SweetTreats.model.OrderEnum;
import com.sweettreats.SweetTreats.model.OrderModel;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.OrderRepository;
import com.sweettreats.SweetTreats.repository.UserRepository;
import com.sweettreats.SweetTreats.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService,
                           UserRepository userRepository,
                           OrderRepository orderRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    // ————————————— Usuario normal —————————————

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(Authentication auth) {
        UserModel user = userRepository.findUserModelByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
        return ResponseEntity.ok(orderService.obtenerPedidosDeUsuario(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            Authentication auth) {
        UserModel user = userRepository.findUserModelByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
        return ResponseEntity.ok(orderService.obtenerPedidoPorId(user, id));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication auth) {
        UserModel user = userRepository.findUserModelByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
        OrderResponse resp = orderService.crearPedido(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    // ————————————— Admin sólo (paginado list) —————————————

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(Pageable pageable) {
        return ResponseEntity.ok(orderService.obtenerTodosLosPedidos(pageable));
    }

    // 🎯 Nuevo: ver detalle de **cualquier** pedido
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> getOrderAdminById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.obtenerPedidoAdminPorId(id));
    }

    // 🎯 Editar estado de **cualquier** pedido
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body  // { "estado": "ENTREGADO" }
    ) {
        String newState = body.get("estado");
        OrderResponse updated = orderService.updateOrderStatus(
                id, OrderEnum.valueOf(newState));
        return ResponseEntity.ok(updated);
    }

}
