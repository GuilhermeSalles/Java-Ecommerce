package com.ecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ecommerce.entity.OrderItem;
import com.ecommerce.repository.projection.TopProductSalesView;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
        select
            p.id as productId,
            p.name as productName,
            sum(oi.quantity) as totalQuantity,
            sum(oi.lineTotal) as totalRevenue
        from OrderItem oi
        join oi.product p
        join oi.order o
        where o.paid = true
        group by p.id, p.name
        order by sum(oi.quantity) desc
    """)
    List<TopProductSalesView> findTopSellingProducts(Pageable pageable);
}