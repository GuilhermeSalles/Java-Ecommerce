# Ecommerce - Baltazar Store

> Projeto de e-commerce moderno, seguro e escalável, desenvolvido com Spring Boot, Java 21, Thymeleaf, PostgreSQL (via Docker) e seguindo as melhores práticas de arquitetura e desenvolvimento.

---

## 🏛️ Estrutura de Código e Princípios

- **MVC (Model-View-Controller):** Toda a estrutura do projeto segue o padrão MVC, separando claramente responsabilidades entre entidades (model), controllers (lógica de fluxo e endpoints), views (Thymeleaf) e repositórios (persistência).
- **SOLID:** Os princípios SOLID são aplicados na modelagem das entidades, controllers e repositórios, promovendo baixo acoplamento, alta coesão e facilidade de manutenção/extensão.
- **TDD (Test-Driven Development):** O projeto está preparado para TDD, com estrutura de testes automatizados utilizando Spring Boot Test, facilitando a escrita de testes antes ou durante o desenvolvimento de novas funcionalidades.

## 🚀 Visão Geral

Este projeto é uma plataforma de e-commerce full-stack, com painel administrativo, autenticação segura, gestão de produtos, pedidos e usuários, interface responsiva e integração com banco de dados relacional. O objetivo é demonstrar domínio de arquitetura limpa, segurança, boas práticas de código e uso de tecnologias modernas.

---

## 🏗️ Arquitetura & Tecnologias

- **Backend:** Spring Boot 4, Java 21, Spring Security, Spring Data JPA
- **Frontend:** Thymeleaf, HTML5, CSS3 (custom + FontAwesome), JavaScript
- **Banco de Dados:**
  - Inicialmente: H2 (memória, para prototipação rápida)
  - Atualmente: PostgreSQL 16, orquestrado via Docker Compose
- **Build & Deploy:** Maven Wrapper, Dockerfile multi-stage
- **Testes:** Spring Boot Test, validação de entidades e controllers
- **Outros:**
  - BCrypt para hash de senhas
  - Enum para status e permissões
  - Responsividade e acessibilidade

---

## 🐳 Como rodar localmente (Docker)

1. **Pré-requisitos:** Docker e Docker Compose instalados
2. Clone o repositório:
   ```bash
   git clone https://github.com/GuilhermeSalles/Java-Ecommerce.git
   cd Java-Ecommerce
   ```
3. Suba os containers:
   ```bash
   docker-compose up --build
   ```
4. Acesse em: [http://localhost:8080](http://localhost:8080)

---

## 📝 Funcionalidades

- Cadastro e login de usuários (com hash seguro de senha)
- Painel administrativo completo (produtos, pedidos, usuários)
- CRUD de produtos e usuários
- Gestão de pedidos, status de envio e pagamento
- Dashboard com métricas (vendas, usuários, produtos mais vendidos)
- Filtros, buscas e formulários validados
- Interface responsiva e moderna
- Controle de permissões (ADMIN/USUARIO)
- Logout seguro, CSRF, Remember-me

---

## 📦 Estrutura do Projeto

```
src/
	main/
		java/com/ecommerce/
			config/         # Configurações de segurança e beans
			controller/     # Controllers MVC (Admin, Home, Auth)
			entity/         # Entidades JPA (User, Product, Order...)
			repository/     # Repositórios Spring Data
			service/        # (Pronto para lógica de negócio extra)
		resources/
			templates/      # Templates Thymeleaf (admin, index, auth...)
			static/         # CSS, JS, imagens
			application.properties
	test/
		java/com/ecommerce/ # Testes automatizados
```

---

## 🛡️ Boas Práticas Adotadas

- **Arquitetura MVC**: Separação clara entre controller, serviço, entidade e repositório
- **Segurança**: Spring Security, BCrypt, CSRF, validação de entrada, enum para roles/status
- **Clean Code**: Métodos pequenos, nomes claros, comentários úteis, enums para estados
- **Responsividade**: CSS customizado, mobile-first, acessibilidade
- **Testabilidade**: Dependências injetadas, uso de interfaces, testes automatizados
- **Escalabilidade**: Pronto para camadas de serviço, fácil extensão de entidades e controllers
- **Versionamento**: Uso de Maven Wrapper, Dockerfile multi-stage, Docker Compose
- **Documentação**: README detalhado, comentários no código, exemplos de uso

---

## 📝 Histórico de Commits (Principais)

- **feat:** Implementação de autenticação, painel admin, CRUD, dashboard, integração com PostgreSQL via Docker
- **fix:** Correções de dependências, melhorias de estrutura, ajustes de templates
- **refactor:** Melhoria de HTML, integração de Thymeleaf, organização de código
- **infra:** Adição de Dockerfile, docker-compose.yml, configuração de ambiente

---

## 💡 Diferenciais Técnicos

- Uso de **Docker Compose** para ambiente de desenvolvimento consistente
- **Migração de H2 para PostgreSQL** para simular ambiente real
- **Painel Admin** completo, com métricas e filtros
- **Enum** para status, permissões e estados, facilitando manutenção
- **Validação** de dados e feedbacks claros ao usuário
- **Design moderno** e responsivo, pronto para produção
- **Código limpo** e pronto para extensão (serviços, integrações, testes)

---

## 👨‍💻 Sobre o Autor

Desenvolvido por [Guilherme Salles](https://www.linkedin.com/in/guilhermesalles/)

---

## 📄 Licença

MIT
