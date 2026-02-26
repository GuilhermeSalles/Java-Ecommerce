package com.ecommerce.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
/**
 * Entidade JPA que representa um pedido realizado na loja.
 * Armazena dados do cliente, status de envio, valor total e itens do pedido.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// No futuro vira FK para User
	@Column(name = "customer_name", nullable = false, length = 120)
	private String customerName;

	@Column(name = "customer_email", length = 160)
	private String customerEmail;

	@Enumerated(EnumType.STRING)
	@Column(name = "shipping_status", nullable = false, length = 20)
	private OrderShippingStatus shippingStatus = OrderShippingStatus.PLACED;

	@Column(name = "paid", nullable = false)
	private boolean paid = false;

	@Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
	private BigDecimal totalAmount = BigDecimal.ZERO;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItem> items = new ArrayList<>();

	// =========================
	// Regras básicas
	// =========================

	public void addItem(OrderItem item) {
		if (item == null)
			return;
		item.setOrder(this);
		this.items.add(item);
		recalculateTotal();
	}

	public void removeItem(OrderItem item) {
		if (item == null)
			return;
		this.items.remove(item);
		item.setOrder(null);
		recalculateTotal();
	}

	public void recalculateTotal() {
		BigDecimal sum = BigDecimal.ZERO;
		for (OrderItem item : items) {
			if (item.getLineTotal() != null) {
				sum = sum.add(item.getLineTotal());
			}
		}
		this.totalAmount = sum;
	}

	// =========================
	// Getters/Setters
	// =========================

	public Long getId() {
		return id;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getCustomerEmail() {
		return customerEmail;
	}

	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
	}

	public OrderShippingStatus getShippingStatus() {
		return shippingStatus;
	}

	public void setShippingStatus(OrderShippingStatus shippingStatus) {
		this.shippingStatus = shippingStatus;
	}

	public boolean isPaid() {
		return paid;
	}

	public void setPaid(boolean paid) {
		this.paid = paid;
	}

	public BigDecimal getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(BigDecimal totalAmount) {
		this.totalAmount = totalAmount;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public List<OrderItem> getItems() {
		return items;
	}

	public void setItems(List<OrderItem> items) {
		this.items = items;
	}
}
