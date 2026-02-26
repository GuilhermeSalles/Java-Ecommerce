package com.ecommerce.controller;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.StatusUsuario;
import com.ecommerce.entity.User;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;

@Controller
/**
 * Controller responsável pelo painel administrativo.
 * Gerencia produtos, pedidos, usuários e dashboard de métricas.
 *
 * @author guilherme.sales
 * @since 26/02/2026
 */
public class AdminController {

	private final ProductRepository productRepository;
	private final OrderRepository orderRepository;
	private final UserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder;
	private final OrderItemRepository orderItemRepository;

	public AdminController(ProductRepository productRepository, OrderRepository orderRepository,
			UserRepository userRepository, BCryptPasswordEncoder passwordEncoder,
			OrderItemRepository orderItemRepository) {
		this.productRepository = productRepository;
		this.orderRepository = orderRepository;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.orderItemRepository = orderItemRepository;
	}

	// LISTA / ADMIN
	/**
	 * Endpoint do painel administrativo principal.
	 * Exibe dashboard, produtos, pedidos e usuários, conforme a seção ativa.
	 *
	 * @param section Seção ativa do painel (dashboard, products, orders, users)
	 * @param category Categoria de produto filtrada
	 * @param userStatus Status de usuário filtrado
	 * @param model Modelo de dados para a view
	 * @return Template admin.html
	 */
	@GetMapping("/admin")
	public String admin(@RequestParam(name = "section", required = false, defaultValue = "dashboard") String section,
			@RequestParam(name = "category", required = false) String category,
			@RequestParam(name = "userStatus", required = false) String userStatus, Model model) {
		String activeSection = normalizeSection(section);

		model.addAttribute("pageTitle", "Painel Administrativo - Baltazar Store");
		model.addAttribute("brandName", "Baltazar Store");
		model.addAttribute("adminName", "Admin");

		model.addAttribute("activeSection", activeSection);

		// Produtos (ordenado por id)
		List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
		model.addAttribute("products", products);
		model.addAttribute("totalProducts", products.size());

		model.addAttribute("selectedCategory", category == null ? "" : category.trim().toUpperCase());

		// Pedidos
		List<Order> orders = orderRepository.findAll();
		model.addAttribute("orders", orders);
		model.addAttribute("totalOrders", orders.size());

		// Total em vendas = soma dos pedidos pagos
		BigDecimal totalSales = orders.stream().filter(Order::isPaid)
				.map(o -> o.getTotalAmount() == null ? BigDecimal.ZERO : o.getTotalAmount())
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		model.addAttribute("totalSales", totalSales);
		
		var recentOrders = orderRepository
		        .findAllByOrderByCreatedAtDesc(PageRequest.of(0, 5));

		model.addAttribute("recentOrders", recentOrders);

		var topProducts = orderItemRepository.findTopSellingProducts(PageRequest.of(0, 5));
		model.addAttribute("topProducts", topProducts);

		// TOTAL USERS (para o dashboard)
		model.addAttribute("totalUsers", (int) userRepository.count());

		// Form padrão Produtos
		model.addAttribute("formMode", "create");
		model.addAttribute("productForm", new Product());

		// ===== USERS =====
		model.addAttribute("statusUsuarioOptions", StatusUsuario.values());

		// Form padrão Users
		model.addAttribute("formModeUser", "create");
		model.addAttribute("userForm", new User()); // usado só para first/last/email/phone/status (não usa hash no
													// form)

		if ("users".equals(activeSection)) {
			StatusUsuario parsedStatus = parseStatusUsuario(userStatus);
			model.addAttribute("selectedUserStatus", parsedStatus == null ? "" : parsedStatus.name());

			List<User> users;
			if (parsedStatus != null) {
				users = userRepository.findByStatusUsuario(parsedStatus, Sort.by(Sort.Direction.ASC, "id"));
			} else {
				users = userRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
			}

			model.addAttribute("users", users);
		} else {
			model.addAttribute("users", Collections.emptyList());
			model.addAttribute("selectedUserStatus", "");
		}

		return "admin";
	}

	// =========================
	// PRODUCTS
	// =========================

	/**
	 * Endpoint para exibir o formulário de edição de produto.
	 *
	 * @param id ID do produto a ser editado
	 * @param model Modelo de dados para a view
	 * @return Template admin.html com dados do produto
	 */
	@GetMapping("/admin/product/edit/{id}")
	public String editProduct(@PathVariable("id") Long id, Model model) {

		List<Product> products = productRepository.findAll();
		model.addAttribute("products", products);

		model.addAttribute("pageTitle", "Painel Administrativo - Baltazar Store");
		model.addAttribute("brandName", "Baltazar Store");
		model.addAttribute("adminName", "Admin");

		model.addAttribute("activeSection", "products");
		model.addAttribute("selectedCategory", "");

		Optional<Product> found = productRepository.findById(id);
		if (!found.isPresent()) {
			model.addAttribute("formMode", "create");
			model.addAttribute("productForm", new Product());
			model.addAttribute("saveError", "Produto não encontrado.");
			return "admin";
		}

		model.addAttribute("formMode", "edit");
		model.addAttribute("productForm", found.get());

		// defaults para evitar null na tela
		model.addAttribute("totalUsers", (int) userRepository.count());
		model.addAttribute("totalProducts", products.size());
		model.addAttribute("orders", orderRepository.findAll());
		model.addAttribute("totalOrders", orderRepository.count());
		model.addAttribute("users", Collections.emptyList());
		model.addAttribute("statusUsuarioOptions", StatusUsuario.values());
		model.addAttribute("formModeUser", "create");
		model.addAttribute("userForm", new User());
		model.addAttribute("selectedUserStatus", "");

		return "admin";
	}

	/**
	 * Endpoint para salvar (criar ou atualizar) um produto.
	 *
	 * @param id ID do produto (null para novo)
	 * @param name Nome do produto
	 * @param category Categoria
	 * @param price Preço
	 * @param state Estado (ativo/inativo)
	 * @param description Descrição
	 * @return Redireciona para a seção de produtos
	 */
	@PostMapping("/admin/product/save")
	public String saveProduct(@RequestParam(name = "id", required = false) Long id, @RequestParam("name") String name,
			@RequestParam("category") String category, @RequestParam("price") BigDecimal price,
			@RequestParam("state") String state, @RequestParam("description") String description) {
		if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
			return "redirect:/admin?section=products&error=price";
		}

		Product p;

		if (id != null) {
			p = productRepository.findById(id).orElse(new Product());
			p.setId(id);
		} else {
			p = new Product();
		}

		p.setName(name);
		p.setCategory(category);
		p.setPrice(price);
		p.setState(state);
		p.setDescription(description);

		productRepository.save(p);

		return "redirect:/admin?section=products";
	}

	/**
	 * Endpoint para excluir um produto pelo ID.
	 *
	 * @param id ID do produto a ser excluído
	 * @return Redireciona para a seção de produtos
	 */
	@GetMapping("/admin/product/delete/{id}")
	public String deleteProduct(@PathVariable("id") Long id) {
		productRepository.deleteById(id);
		return "redirect:/admin?section=products";
	}

	// =========================
	// USERS (CREATE/EDIT/DELETE)
	// =========================

	/**
	 * Endpoint para exibir o formulário de edição de usuário.
	 *
	 * @param id ID do usuário a ser editado
	 * @param userStatus Status filtrado
	 * @param model Modelo de dados para a view
	 * @return Template admin.html com dados do usuário
	 */
	@GetMapping("/admin/user/edit/{id}")
	public String editUser(@PathVariable("id") Long id,
			@RequestParam(name = "userStatus", required = false) String userStatus, Model model) {

		model.addAttribute("pageTitle", "Painel Administrativo - Baltazar Store");
		model.addAttribute("brandName", "Baltazar Store");
		model.addAttribute("adminName", "Admin");
		model.addAttribute("activeSection", "users");

		// totals
		model.addAttribute("products", productRepository.findAll(Sort.by(Sort.Direction.ASC, "id")));
		model.addAttribute("totalProducts", productRepository.count());

		List<Order> orders = orderRepository.findAll();
		model.addAttribute("orders", orders);
		model.addAttribute("totalOrders", orders.size());

		BigDecimal totalSales = orders.stream().filter(Order::isPaid)
				.map(o -> o.getTotalAmount() == null ? BigDecimal.ZERO : o.getTotalAmount())
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		model.addAttribute("totalSales", totalSales);

		model.addAttribute("totalUsers", (int) userRepository.count());

		// status options (enum)
		model.addAttribute("statusUsuarioOptions", StatusUsuario.values());

		// filtro
		StatusUsuario parsedStatus = parseStatusUsuario(userStatus);
		model.addAttribute("selectedUserStatus", parsedStatus == null ? "" : parsedStatus.name());

		List<User> users;
		if (parsedStatus != null) {
			users = userRepository.findByStatusUsuario(parsedStatus, Sort.by(Sort.Direction.ASC, "id"));
		} else {
			users = userRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
		}
		model.addAttribute("users", users);

		Optional<User> found = userRepository.findById(id);
		if (!found.isPresent()) {
			model.addAttribute("formModeUser", "create");
			model.addAttribute("userForm", new User());
			model.addAttribute("userSaveError", "Usuário não encontrado.");
			// defaults produto form
			model.addAttribute("formMode", "create");
			model.addAttribute("productForm", new Product());
			model.addAttribute("selectedCategory", "");
			return "admin";
		}

		model.addAttribute("formModeUser", "edit");
		model.addAttribute("userForm", found.get());

		// defaults produto form
		model.addAttribute("formMode", "create");
		model.addAttribute("productForm", new Product());
		model.addAttribute("selectedCategory", "");

		return "admin";
	}

	/**
	 * Endpoint para salvar (criar ou atualizar) um usuário.
	 *
	 * @param id ID do usuário (null para novo)
	 * @param firstName Nome
	 * @param lastName Sobrenome
	 * @param email Email
	 * @param phone Telefone
	 * @param statusUsuario Status
	 * @param password Senha (opcional)
	 * @param confirmPassword Confirmação de senha
	 * @return Redireciona para a seção de usuários
	 */
	@PostMapping("/admin/user/save")
	public String saveUser(@RequestParam(name = "id", required = false) Long id,
			@RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName,
			@RequestParam("email") String email, @RequestParam("phone") String phone,
			@RequestParam("statusUsuario") String statusUsuario,
			@RequestParam(name = "password", required = false) String password,
			@RequestParam(name = "confirmPassword", required = false) String confirmPassword) {
		if (isBlank(firstName) || isBlank(lastName) || isBlank(email) || isBlank(phone)) {
			return "redirect:/admin?section=users&error=user";
		}

		StatusUsuario status = parseStatusUsuario(statusUsuario);
		if (status == null)
			status = StatusUsuario.ATIVO;

		String emailNorm = email.trim().toLowerCase();

		User u;
		if (id != null) {
			u = userRepository.findById(id).orElse(null);
			if (u == null)
				return "redirect:/admin?section=users&error=user";
		} else {
			// create
			if (userRepository.existsByEmail(emailNorm)) {
				return "redirect:/admin?section=users&error=emailExists";
			}
			u = new User();
		}

		// update campos
		u.setFirstName(firstName.trim());
		u.setLastName(lastName.trim());
		u.setEmail(emailNorm);
		u.setPhone(phone.trim());
		u.setStatusUsuario(status);

		// senha: só atualiza se veio preenchida
		if (!isBlank(password)) {
			if (!password.equals(confirmPassword)) {
				return "redirect:/admin?section=users&error=passwordMismatch";
			}
			u.setPasswordHash(passwordEncoder.encode(password));
		}

		userRepository.save(u);

		return "redirect:/admin?section=users";
	}

	/**
	 * Endpoint para excluir um usuário pelo ID.
	 *
	 * @param id ID do usuário a ser excluído
	 * @return Redireciona para a seção de usuários
	 */
	@GetMapping("/admin/user/delete/{id}")
	public String deleteUser(@PathVariable("id") Long id) {
		userRepository.deleteById(id);
		return "redirect:/admin?section=users";
	}

	// =========================
	// helpers
	// =========================

	private String normalizeSection(String section) {
		if (section == null)
			return "dashboard";
		String s = section.trim().toLowerCase();
		switch (s) {
		case "dashboard":
		case "products":
		case "orders":
		case "users":
			return s;
		default:
			return "dashboard";
		}
	}

	private boolean isBlank(String v) {
		return v == null || v.trim().isEmpty();
	}

	private StatusUsuario parseStatusUsuario(String v) {
		if (v == null || v.trim().isEmpty())
			return null;
		try {
			return StatusUsuario.valueOf(v.trim().toUpperCase());
		} catch (Exception e) {
			return null;
		}
	}
}