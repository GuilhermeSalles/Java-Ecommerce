package com.ecommerce.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderShippingStatus;
/**
 * Repositório Spring Data JPA para operações com a entidade Order.
 * Permite consultas de pedidos, incluindo ordenação por data de criação.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Order> findByShippingStatusOrderByCreatedAtDesc(OrderShippingStatus status, Pageable pageable);

    Page<Order> findByPaidOrderByCreatedAtDesc(boolean paid, Pageable pageable);

    Page<Order> findByShippingStatusAndPaidOrderByCreatedAtDesc(OrderShippingStatus status, boolean paid, Pageable pageable);
}