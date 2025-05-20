package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.dto.ProductStatDto;
import com.sweettreats.SweetTreats.model.ProductModel;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public interface ProductRepository extends JpaRepository<ProductModel, Long> {
    @Query("""
      SELECT new com.sweettreats.SweetTreats.dto.ProductStatDto(
        p.nombre,
        SUM(d.cantidad),
        SUM(d.cantidad * d.precioUnitario)
      )
      FROM OrderDetailModel d
      JOIN d.productModel p
      GROUP BY p.nombre
      ORDER BY SUM(d.cantidad) DESC
    """)
    List<ProductStatDto> findTopProducts(Pageable top10);

    @Query("""
      SELECT p
      FROM ProductModel p
      WHERE NOT EXISTS (
        SELECT 1
        FROM OrderDetailModel d
        WHERE d.productModel = p
          AND d.orderModel.createdAt >= :since
      )
    """)
    List<ProductModel> findNoSalesSince(@Param("since") LocalDateTime since);

    // Bajo stock
    List<ProductModel> findByStockLessThan(int threshold);
}
