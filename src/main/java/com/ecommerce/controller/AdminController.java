package com.ecommerce.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;

@Controller
public class AdminController {

    private final ProductRepository productRepository;

    public AdminController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/admin")
    public String admin(
            @RequestParam(name = "category", required = false) String category,
            Model model
    ) {
        // Dados base da página
        model.addAttribute("pageTitle", "Painel Administrativo - E-commerce Baltazar");
        model.addAttribute("brandName", "E-commerce Baltazar");
        model.addAttribute("adminName", "Admin"); // depois você troca por usuário logado

        // Produtos
        List<Product> products = productRepository.findAll();
        model.addAttribute("products", products);

        // Stats (por enquanto só produto real; outros placeholders)
        model.addAttribute("totalProducts", products.size());
        model.addAttribute("totalUsers", 0);
        model.addAttribute("totalOrders", 0);
        model.addAttribute("totalSales", BigDecimal.ZERO);

        // Para deixar pré-selecionado o filtro no SELECT (se tiver ?category=)
        model.addAttribute("selectedCategory", category == null ? "" : category.trim().toUpperCase());

        return "admin";
    }
}
