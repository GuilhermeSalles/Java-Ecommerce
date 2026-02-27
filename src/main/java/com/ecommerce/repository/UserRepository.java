package com.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.entity.StatusUsuario;
import com.ecommerce.entity.User;

/**
 * Repositório Spring Data JPA para operações com a entidade User.
 * Permite consultas, persistência e busca por status/email.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	List<User> findByStatusUsuario(StatusUsuario statusUsuario, Sort sort);
}