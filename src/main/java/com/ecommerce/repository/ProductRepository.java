package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório Spring Data JPA para operações com a entidade Product.
 * Permite persistência e consultas de produtos.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	
	Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);
}
