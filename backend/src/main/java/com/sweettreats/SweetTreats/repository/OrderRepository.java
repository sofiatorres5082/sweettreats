package com.sweettreats.SweetTreats.repository;

import com.sweettreats.SweetTreats.model.OrderModel;
import com.sweettreats.SweetTreats.model.UserModel;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderModel, Long> {
    List<OrderModel> findByUsermodel(UserModel user);

    List<OrderModel> findAllByUsermodel(UserModel user);

    Page<OrderModel> findAll(Pageable pageable);

    // 1) total ventas en periodo
    @Query("""
      SELECT COALESCE(SUM(o.total),0)
      FROM OrderModel o
      WHERE o.createdAt >= :since
    """)
    double sumSalesSince(@Param("since") LocalDateTime since);

    // 2) tendencia diaria usando DATE_FORMAT
    @Query("""
      SELECT FUNCTION('date_format', o.createdAt, '%Y-%m-%d'),
             COALESCE(SUM(o.total),0)
      FROM OrderModel o
      WHERE o.createdAt >= :since
      GROUP BY FUNCTION('date_format', o.createdAt, '%Y-%m-%d')
      ORDER BY 1
    """)
    List<Object[]> sumSalesGroupByDay(@Param("since") LocalDateTime since);

    // 3) ticket promedio en periodo
    @Query("""
      SELECT CASE WHEN COUNT(o)>0 THEN SUM(o.total)/COUNT(o) ELSE 0 END
      FROM OrderModel o
      WHERE o.createdAt >= :since
    """)
    double avgTicketSince(@Param("since") LocalDateTime since);

}