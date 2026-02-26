package com.ecommerce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class SignInController {

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