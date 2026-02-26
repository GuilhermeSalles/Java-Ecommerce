package com.ecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.entity.Order;

/**
 * Repositório Spring Data JPA para operações com a entidade Order.
 * Permite consultas de pedidos, incluindo ordenação por data de criação.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
}