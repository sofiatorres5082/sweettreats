package com.sweettreats.SweetTreats.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "Pagos", description = "Endpoints para procesar pagos con Stripe")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @Operation(
            summary     = "Crear PaymentIntent",
            description = "Genera un PaymentIntent en Stripe. El cuerpo debe incluir 'amount' (en centavos) y opcionalmente 'currency'."
    )
    @ApiResponse(responseCode = "200", description = "Se devuelve el clientSecret del PaymentIntent")
    @ApiResponse(responseCode = "400", description = "Datos de solicitud inválidos")
    @PostMapping("/create-payment-intent")
    public Map<String, String> createPaymentIntent(
            @RequestBody(
                    description = "{ \"amount\": 12345, \"currency\": \"usd\" }",
                    required = true
            )
            @org.springframework.web.bind.annotation.RequestBody Map<String, Object> data
    ) throws StripeException {
        Long amount = ((Number) data.get("amount")).longValue();
        String currency = (String) data.getOrDefault("currency", "usd");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount);
        params.put("currency", currency);
        params.put("automatic_payment_methods", Map.of("enabled", true));

        PaymentIntent intent = PaymentIntent.create(params);
        return Map.of("clientSecret", intent.getClientSecret());
    }
}
