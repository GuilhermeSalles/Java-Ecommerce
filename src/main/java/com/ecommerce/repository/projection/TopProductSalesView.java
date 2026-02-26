package com.ecommerce.repository.projection;

import java.math.BigDecimal;

/**
 * Projeção para exibir ranking de produtos mais vendidos.
 * Utilizada em consultas customizadas do OrderItemRepository.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */
public interface TopProductSalesView {
    Long getProductId();
    String getProductName();
    Long getTotalQuantity();
    BigDecimal getTotalRevenue();
}