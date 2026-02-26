package com.ecommerce.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ecommerce.entity.PermissaoUsuario;
import com.ecommerce.entity.StatusUsuario;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;

@Controller
/**
 * Controller responsável pelo cadastro de novos usuários.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */
public class SignUpController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public SignUpController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Endpoint da tela de cadastro de usuário (signup).
     * Exibe formulário de cadastro e mensagens de sucesso/erro.
     *
     * @param success Mensagem de sucesso
     * @param error Mensagem de erro
     * @param model Modelo de dados para a view
     * @return Template signup.html
     */
    @GetMapping("/signup")
    public String signup(
            @RequestParam(name = "success", required = false) String success,
            @RequestParam(name = "error", required = false) String error,
            Model model
    ) {
        model.addAttribute("pageTitle", "Cadastro - Baltazar Store");
        model.addAttribute("brandName", "Baltazar Store");

        model.addAttribute("success", success != null);
        model.addAttribute("error", error != null);
        

        return "signup";
    }

    /**
     * Endpoint para processar o cadastro de novo usuário.
     * Recebe dados do formulário, valida e salva o usuário.
     *
     * @param firstName Nome
     * @param lastName Sobrenome
     * @param email Email
     * @param phone Telefone
     * @param password Senha
     * @param confirmPassword Confirmação de senha
     * @param model Modelo de dados para a view
     * @return Redireciona para tela de cadastro com mensagem
     */
    @PostMapping("/signup")
    public String signupPost(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("password") String password,
            @RequestParam("confirmPassword") String confirmPassword
    ) {
        // validações mínimas (backend)
        if (isBlank(firstName) || isBlank(lastName) || isBlank(email) || isBlank(phone) || isBlank(password)) {
            return "redirect:/signup?error=1";
        }

        if (!password.equals(confirmPassword)) {
            return "redirect:/signup?error=1";
        }

        String emailNorm = email.trim().toLowerCase();

        if (userRepository.existsByEmail(emailNorm)) {
            return "redirect:/signup?error=1";
        }

        User u = new User();
        u.setFirstName(firstName.trim());
        u.setLastName(lastName.trim());
        u.setEmail(emailNorm);
        u.setPhone(phone.trim());
        u.setPasswordHash(passwordEncoder.encode(password));
        u.setStatusUsuario(StatusUsuario.ATIVO);
        u.setPermissao(PermissaoUsuario.USUARIO); // antes do save
        userRepository.save(u);

        return "redirect:/signin?success=1";
    }

    private boolean isBlank(String v) {
        return v == null || v.trim().isEmpty();
    }
}