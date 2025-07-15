package com.sweettreats.SweetTreats.controller;

import com.sweettreats.SweetTreats.dto.*;
import com.sweettreats.SweetTreats.model.ProductModel;
import com.sweettreats.SweetTreats.service.impl.ReportsServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Reportes", description = "Estadísticas y métricas del sistema")
@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final ReportsServiceImpl svc;

    public ReportsController(ReportsServiceImpl s) {
        this.svc = s;
    }

    @Operation(
            summary = "Ventas totales",
            description = "Devuelve el total de ventas para un período dado. Ej: day, week, month"
    )
    @ApiResponse(responseCode = "200", description = "Total de ventas obtenido")
    @GetMapping("/sales")
    public SalesTotalDto sales(
            @Parameter(description = "Período: day, week o month", example = "week")
            @RequestParam String period
    ) {
        return svc.getSalesTotal(period);
    }

    @Operation(
            summary = "Tendencia de ventas",
            description = "Devuelve la evolución de ventas para un período dado"
    )
    @ApiResponse(responseCode = "200", description = "Datos de tendencia de ventas obtenidos")
    @GetMapping("/sales-trend")
    public TrendDto salesTrend(
            @Parameter(description = "Período: day, week o month", example = "month")
            @RequestParam String period
    ) {
        return svc.getSalesTrend(period);
    }

    @Operation(
            summary = "Promedio de ticket",
            description = "Devuelve el promedio de ingresos por venta en un período"
    )
    @ApiResponse(responseCode = "200", description = "Promedio de ticket obtenido")
    @GetMapping("/ticket-average")
    public SalesTotalDto ticketAverage(
            @Parameter(description = "Período: day, week o month", example = "day")
            @RequestParam String period
    ) {
        return svc.getTicketAverage(period);
    }

    @Operation(
            summary = "Crecimiento de ventas",
            description = "Muestra el porcentaje de crecimiento o caída en ventas respecto al período anterior"
    )
    @ApiResponse(responseCode = "200", description = "Datos de crecimiento de ventas obtenidos")
    @GetMapping("/sales-growth")
    public SalesGrowthDto salesGrowth(
            @Parameter(description = "Período: day, week o month", example = "month")
            @RequestParam String period
    ) {
        return svc.getSalesGrowth(period);
    }

    @Operation(
            summary = "Productos más vendidos",
            description = "Retorna un listado de los productos con más ventas"
    )
    @ApiResponse(responseCode = "200", description = "Lista de productos más vendidos")
    @GetMapping("/top-products")
    public List<ProductStatDto> topProducts() {
        return svc.getTopProducts();
    }

    @Operation(
            summary = "Productos con bajo stock",
            description = "Lista los productos con stock por debajo de un umbral (por defecto 10 unidades)"
    )
    @ApiResponse(responseCode = "200", description = "Lista de productos con bajo stock")
    @GetMapping("/low-stock")
    public List<ProductModel> lowStock() {
        return svc.getLowStock(10);
    }

    @Operation(
            summary = "Productos sin ventas",
            description = "Devuelve productos que no se han vendido en X días"
    )
    @ApiResponse(responseCode = "200", description = "Lista de productos sin ventas recientes")
    @GetMapping("/no-sales")
    public List<ProductModel> noSales(
            @Parameter(description = "Cantidad de días sin ventas", example = "30")
            @RequestParam int sinceDays
    ) {
        return svc.getNoSales(sinceDays);
    }
}
