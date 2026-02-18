package com.ecommerce.controller;

import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    private final ProductRepository productRepository;

    public HomeController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("pageTitle", "Baltazar Store");
        model.addAttribute("brandName", "Baltazar Store");
        model.addAttribute("products", productRepository.findAll());
        return "index";
    }
}
