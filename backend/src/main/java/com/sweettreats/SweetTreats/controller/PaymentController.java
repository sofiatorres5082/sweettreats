package com.sweettreats.SweetTreats.controller;


import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @PostMapping("/create-payment-intent")
    public Map<String, String> createPaymentIntent(@RequestBody Map<String, Object> data) throws StripeException {
        // data deberá venir: { amount: 12345, currency: "usd" }
        Long amount = ((Number)data.get("amount")).longValue();
        String currency = (String)data.getOrDefault("currency", "usd");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount);
        params.put("currency", currency);
        params.put("automatic_payment_methods", Map.of("enabled", true));

        PaymentIntent intent = PaymentIntent.create(params);
        return Map.of("clientSecret", intent.getClientSecret());
    }
}