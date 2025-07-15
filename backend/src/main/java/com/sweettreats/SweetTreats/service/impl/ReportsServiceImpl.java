package com.sweettreats.SweetTreats.service.impl;

import com.sweettreats.SweetTreats.dto.*;
import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
public class ReportsServiceImpl {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;

    public ReportsServiceImpl(OrderRepository orderRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }

    private LocalDateTime since(String period) {
        return switch (period) {
            case "today" -> LocalDate.now().atStartOfDay();
            case "week"  -> LocalDate.now().minusWeeks(1).atStartOfDay();
            case "month" -> LocalDate.now().minusMonths(1).atStartOfDay();
            case "year"  -> LocalDate.now().minusYears(1).atStartOfDay();
            default      -> LocalDateTime.of(1970,1,1,0,0);
        };
    }

    public SalesTotalDto getSalesTotal(String period) {
        double total = orderRepo.sumSalesSince(since(period));
        return new SalesTotalDto(total);
    }

    public TrendDto getSalesTrend(String period) {
        LocalDateTime s = since(period);
        var rows = orderRepo.sumSalesGroupByDay(s);
        List<String> labels = new ArrayList<>();
        List<Double> data   = new ArrayList<>();
        for (var r : rows) {
            labels.add((String) r[0]);
            data.add(((Number) r[1]).doubleValue());
        }
        return new TrendDto(labels, data);
    }

    public SalesTotalDto getTicketAverage(String period) {
        double avg = orderRepo.avgTicketSince(since(period));
        return new SalesTotalDto(avg);
    }

    public SalesGrowthDto getSalesGrowth(String period) {
        LocalDateTime nowSince      = since(period);
        LocalDateTime lastYearSince = nowSince.minusYears(1);
        double thisP = orderRepo.sumSalesSince(nowSince);
        double lastY = orderRepo.sumSalesSince(lastYearSince);
        return new SalesGrowthDto(thisP, lastY);
    }

    public List<ProductStatDto> getTopProducts() {
        return productRepo.findTopProducts(PageRequest.of(0, 10));
    }

    public List<ProductModel> getLowStock(int threshold) {
        return productRepo.findByStockLessThan(threshold);
    }

    public List<ProductModel> getNoSales(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return productRepo.findNoSalesSince(since);
    }
}

