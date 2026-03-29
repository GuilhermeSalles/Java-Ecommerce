# 🛒 Baltazar Store - Ecommerce Moderno

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.2-brightgreen)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://www.oracle.com/java/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> Uma plataforma de e-commerce completa, segura e escalável, projetada para oferecer uma experiência de compra moderna e um painel administrativo robusto.

---

## 🎯 Objetivo

O **Baltazar Store** foi desenvolvido para demonstrar a aplicação de padrões arquiteturais de alto nível e práticas modernas de desenvolvimento Java. O projeto resolve a complexidade de gerenciar um fluxo de vendas completo, desde o catálogo de produtos até o checkout e gestão administrativa.

### ✨ Principais Diferenciais

- **Segurança Avançada**: Autenticação e autorização robustas com Spring Security e criptografia BCrypt.
- **Painel Administrativo**: Gestão completa de produtos, pedidos e usuários com métricas em tempo real.
- **Arquitetura Limpa**: Separação clara de responsabilidades seguindo o padrão MVC e princípios SOLID.
- **Pronto para Produção**: Orquestração via Docker para ambientes de desenvolvimento e deploy consistentes.

---

## 📦 Estrutura do Projeto

A organização de pastas segue as convenções do Spring Boot, otimizada para legibilidade e manutenção:

```text
src/main/java/com/ecommerce/
├── config/             # Configurações globais (Segurança, Beans)
├── controller/         # Pontos de entrada da aplicação (Web/API)
│   └── dto/            # Objetos de Transferência de Dados
├── entity/             # Modelo de dados e mapeamento JPA
├── repository/         # Camada de persistência (Spring Data JPA)
│   └── projection/     # Consultas customizadas e views otimizadas
├── security/           # Lógica customizada de autenticação
└── service/            # Regras de negócio e serviços internos

src/main/resources/
├── static/             # Ativos front-end (CSS, JS, Imagens)
└── templates/          # Páginas renderizadas via Thymeleaf
```

### Por que essa estrutura?

- **Isolamento de Domínio**: As entidades e regras de negócio estão separadas da lógica de transporte (Controllers).
- **Escalabilidade**: A camada de `repository` com `projections` permite consultas complexas sem sobrecarregar o banco de dados.
- **Manutenibilidade**: Localização intuitiva de arquivos, facilitando a onboard de novos desenvolvedores.

---

## 🏗️ Arquitetura e Padrões

Este projeto utiliza o padrão **MVC (Model-View-Controller)**, escolhido por sua maturidade e suporte nativo no ecossistema Spring, garantindo um desacoplamento eficiente entre a interface e a lógica de negócio.

### Padrões Aplicados:

- **SOLID**: Interfaces bem definidas e responsabilidade única em cada classe.
- **TDD Ready**: Estrutura preparada para testes automatizados de unidade e integração.
- **Diferencial**: Migração transparente entre **H2** (desenvolvimento rápido) e **PostgreSQL** (produção) via perfis do Spring.

---

## 🛠️ Tecnologias Utilizadas

- **Backend**: Java 21 & Spring Boot 4.0.2
- **Segurança**: Spring Security & BCrypt
- **Persistência**: Spring Data JPA & PostgreSQL
- **Frontend**: Thymeleaf, HTML5, CSS3, JavaScript
- **Infraestrutura**: Docker & Docker Compose
- **Build**: Maven

---

## 🚀 Como Iniciar

### Pré-requisitos

- Docker e Docker Compose instalados.
- Java 21 (opcional se usar Docker).

### Instalação e Execução via Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/GuilhermeSalles/Java-Ecommerce.git

# 2. Entre na pasta
cd Java-Ecommerce

# 3. Suba os containers (Aplicação + Banco)
docker-compose up --build
```

Acesse em: `http://localhost:8080`

---

## 👤 Autor

**Guilherme Baltazar Vericimo de Sales**

- **LinkedIn**: [Conecte-se comigo](https://www.linkedin.com/in/guilherme-baltazar-0028361a1)
- **Instagram**: [@yguilhermeb](https://instagram.com/yguilhermeb)
- **GitHub**: [@GuilhermeSalles](https://github.com/GuilhermeSalles)

---

## 📜 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
