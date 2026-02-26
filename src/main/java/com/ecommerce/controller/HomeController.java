package com.ecommerce.controller;

import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
/**
 * Controller responsável pela página inicial e navegação pública do e-commerce.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */
public class HomeController {

    private final ProductRepository productRepository;

    public HomeController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Endpoint da página inicial do e-commerce.
     * Exibe a home com lista de produtos e informações da loja.
     *
     * @param model Modelo de dados para a view
     * @return Template index.html
     */
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("pageTitle", "Baltazar Store");
        model.addAttribute("brandName", "Baltazar Store");
        model.addAttribute("products", productRepository.findAll());
        return "index";
    }
}
