package com.ecommerce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
/**
 * Controller responsável pelo fluxo de autenticação (login) dos usuários.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */
public class SignInController {

    /**
     * Endpoint da tela de login (signin).
     * Exibe formulário de autenticação e mensagens de sucesso/erro/logout.
     *
     * @param success Mensagem de sucesso
     * @param error Mensagem de erro
     * @param logout Mensagem de logout
     * @param model Modelo de dados para a view
     * @return Template signin.html
     */
    @GetMapping("/signin")
    public String signin(
            @RequestParam(name = "success", required = false) String success,
            @RequestParam(name = "error", required = false) String error,
            @RequestParam(name = "logout", required = false) String logout,
            Model model
    ) {

        model.addAttribute("pageTitle", "Login - Baltazar Store");
        model.addAttribute("brandName", "Baltazar Store");

        model.addAttribute("success", success != null);
        model.addAttribute("error", error != null);
        model.addAttribute("logout", logout != null);

        return "signin";
    }
}