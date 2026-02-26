package com.ecommerce.service;

import java.util.List;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ecommerce.entity.PermissaoUsuario;
import com.ecommerce.entity.StatusUsuario;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.CustomUserDetails;

@Service
/**
 * Serviço responsável por buscar usuários no banco de dados para autenticação.
 * Implementa UserDetailsService do Spring Security.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */
public class DbUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public DbUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String emailNorm = (email == null ? "" : email.trim().toLowerCase());

        User u = userRepository.findByEmail(emailNorm)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        // Se status vier null (ou diferente de ATIVO), bloqueia
        if (u.getStatusUsuario() == null || u.getStatusUsuario() != StatusUsuario.ATIVO) {
            throw new DisabledException("Usuário não está ativo");
        }

        // Se permissao vier null, assume USUARIO (evita NPE em base antiga)
        PermissaoUsuario perm = (u.getPermissao() == null) ? PermissaoUsuario.USUARIO : u.getPermissao();

        String role = "ROLE_" + perm.name();

        return new CustomUserDetails(
                u,
                List.of(new SimpleGrantedAuthority(role))
        );
    }
}