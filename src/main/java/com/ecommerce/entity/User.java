package com.ecommerce.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "users", indexes = { @Index(name = "idx_users_email", columnList = "email"),
		@Index(name = "idx_users_status", columnList = "status_usuario") }, uniqueConstraints = {
				@UniqueConstraint(name = "uk_users_email", columnNames = "email") })
public class User implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "first_name", nullable = false, length = 60)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 60)
	private String lastName;

	@Column(nullable = false, length = 120)
	private String email;

	@Column(nullable = false, length = 20)
	private String phone;

	/**
	 * Armazene somente hash (BCrypt), nunca a senha em texto puro.
	 */
	@Column(name = "password_hash", nullable = false, length = 100)
	private String passwordHash;

	@Enumerated(EnumType.STRING)
	@Column(name = "status_usuario", nullable = false, length = 15)
	private StatusUsuario statusUsuario = StatusUsuario.ATIVO;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Enumerated(EnumType.STRING)
	@Column(name = "permissao", nullable = false, length = 15)
	private PermissaoUsuario permissao = PermissaoUsuario.USUARIO;

	@Column(name = "profile_image_url", length = 255)
	private String profileImageUrl;

	@PrePersist
	void onCreate() {
		this.createdAt = LocalDateTime.now();
		if (this.statusUsuario == null) {
			this.statusUsuario = StatusUsuario.ATIVO;
		}
		// normalização simples
		if (this.email != null)
			this.email = this.email.trim().toLowerCase();
		if (this.firstName != null)
			this.firstName = this.firstName.trim();
		if (this.lastName != null)
			this.lastName = this.lastName.trim();
		if (this.phone != null)
			this.phone = this.phone.trim();
		if (this.permissao == null)
			this.permissao = PermissaoUsuario.USUARIO;
	}

	/* getters/setters */

	public Long getId() {
		return id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public StatusUsuario getStatusUsuario() {
		return statusUsuario;
	}

	public void setStatusUsuario(StatusUsuario statusUsuario) {
		this.statusUsuario = statusUsuario;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public PermissaoUsuario getPermissao() {
		return permissao;
	}

	public void setPermissao(PermissaoUsuario permissao) {
		this.permissao = permissao;
	}

	public String getProfileImageUrl() {
		return profileImageUrl;
	}

	public void setProfileImageUrl(String profileImageUrl) {
		this.profileImageUrl = profileImageUrl;
	}

}