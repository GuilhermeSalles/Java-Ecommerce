package com.ecommerce.entity;

/**
 * Enum que representa os possíveis status de envio de um pedido.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */
public enum OrderShippingStatus {
    PLACED,     // pedido feito
    SHIPPED,    // enviado
    DELIVERED   // chegou ao destino
}
