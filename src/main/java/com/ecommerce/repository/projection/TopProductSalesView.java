package com.ecommerce.repository.projection;

import java.math.BigDecimal;

public interface TopProductSalesView {
    Long getProductId();
    String getProductName();
    Long getTotalQuantity();
    BigDecimal getTotalRevenue();
}