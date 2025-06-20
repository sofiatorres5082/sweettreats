package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.dto.OrderRequest;
import com.sweettreats.SweetTreats.dto.OrderResponse;
import com.sweettreats.SweetTreats.model.OrderEnum;
import com.sweettreats.SweetTreats.model.UserModel;
import com.sweettreats.SweetTreats.repository.OrderRepository;
import com.sweettreats.SweetTreats.repository.UserRepository;
import com.sweettreats.SweetTreats.service.OrderServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Tag(name = "Pedidos", description = "Gestión de pedidos para usuarios y administradores")
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderServiceImpl orderService;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public OrderController(OrderServiceImpl orderService,
                           UserRepository userRepository,
                           OrderRepository orderRepository) {
        this.orderService   = orderService;
        this.userRepository = userRepository;
        this.orderRepository= orderRepository;
    }

    // ————————————— Usuario normal —————————————

    @Operation(
            summary     = "Listar mis pedidos",
            description = "Devuelve todos los pedidos realizados por el usuario autenticado"
    )
    @ApiResponse(responseCode = "200", description = "Lista de pedidos retornada")
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(
            Authentication auth
    ) {
        UserModel user = userRepository.findUserModelByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
        return ResponseEntity.ok(orderService.obtenerPedidosDeUsuario(user));
    }

    @Operation(
            summary     = "Obtener pedido por ID",
            description = "Devuelve el detalle de un pedido propio del usuario"
    )
    @ApiResponse(responseCode = "200", description = "Pedido encontrado")
    @ApiResponse(responseCode = "401", description = "Usuario no autenticado")
    @Parameter(name = "id", description = "ID del pedido", required = true, example = "123")
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            Authentication auth
    ) {
        UserModel user = userRepository.findUserModelByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
        return ResponseEntity.ok(orderService.obtenerPedidoPorId(user, id));
    }

    @Operation(
            summary     = "Crear un nuevo pedido",
            description = "Genera un pedido con los ítems indicados para el usuario autenticado"
    )
    @ApiResponse(responseCode = "201", description = "Pedido creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos de pedido inválidos")
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication auth
    ) {
        UserModel user = userRepository.findUserModelByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
        OrderResponse resp = orderService.crearPedido(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @Operation(summary = "Cancelar pedido (usuario)", description = "Permite que el dueño cancele su pedido si está PENDIENTE")
    @ApiResponse(responseCode = "200", description = "Pedido cancelado")
    @ApiResponse(responseCode = "403", description = "No autorizado o no es tu pedido")
    @ApiResponse(responseCode = "400", description = "No está en estado PENDIENTE")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrderByUser(
            @PathVariable Long id,
            Authentication auth
    ) {
        UserModel user = userRepository.findUserModelByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
        OrderResponse canceled = orderService.cancelOrderByUser(id, user);
        return ResponseEntity.ok(canceled);
    }

    // ————————————— Admin sólo (paginado list) —————————————

    @Operation(
            summary     = "Listar todos los pedidos (ADMIN)",
            description = "Devuelve una página de todos los pedidos (solo ADMIN)"
    )
    @ApiResponse(responseCode = "200", description = "Página de pedidos retornada")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            Pageable pageable
    ) {
        return ResponseEntity.ok(orderService.obtenerTodosLosPedidos(pageable));
    }

    @Operation(
            summary     = "Obtener cualquier pedido por ID (ADMIN)",
            description = "Devuelve el detalle de un pedido cualquiera (solo ADMIN)"
    )
    @ApiResponse(responseCode = "200", description = "Pedido encontrado")
    @ApiResponse(responseCode = "404", description = "Pedido no encontrado")
    @PreAuthorize("hasRole('ADMIN')")
    @Parameter(name = "id", description = "ID del pedido", required = true, example = "456")
    @GetMapping("/admin/{id}")
    public ResponseEntity<OrderResponse> getOrderAdminById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(orderService.obtenerPedidoAdminPorId(id));
    }

    @Operation(
            summary     = "Actualizar estado de pedido (ADMIN)",
            description = "Permite cambiar el estado de un pedido (solo ADMIN)"
    )
    @ApiResponse(responseCode = "200", description = "Estado del pedido actualizado")
    @ApiResponse(responseCode = "400", description = "Estado inválido")
    @PreAuthorize("hasRole('ADMIN')")
    @Parameter(name = "id", description = "ID del pedido", required = true, example = "789")
    @PutMapping("/admin/{id}")
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
