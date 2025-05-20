package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.dto.*;
import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.service.ReportsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final ReportsService svc;
    public ReportsController(ReportsService s){ this.svc = s; }

    @GetMapping("/sales")
    public SalesTotalDto sales(@RequestParam String period) {
        return svc.getSalesTotal(period);
    }

    @GetMapping("/sales-trend")
    public TrendDto salesTrend(@RequestParam String period) {
        return svc.getSalesTrend(period);
    }

    @GetMapping("/ticket-average")
    public SalesTotalDto ticketAverage(@RequestParam String period) {
        return svc.getTicketAverage(period);
    }

    @GetMapping("/sales-growth")
    public SalesGrowthDto salesGrowth(@RequestParam String period) {
        return svc.getSalesGrowth(period);
    }

    @GetMapping("/top-products")
    public List<ProductStatDto> topProducts() {
        return svc.getTopProducts();
    }

    @GetMapping("/low-stock")
    public List<ProductModel> lowStock() {
        return svc.getLowStock(10);
    }

    @GetMapping("/no-sales")
    public List<ProductModel> noSales(@RequestParam int sinceDays) {
        return svc.getNoSales(sinceDays);
    }
}
