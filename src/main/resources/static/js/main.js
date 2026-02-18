// ====================================
// MAIN FUNCTIONALITY
// ====================================

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const profileDropdown = document.getElementById('profile-dropdown');
const dropdownMenu = document.getElementById('dropdown-menu');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScroll();
    setupThemeToggle();
    setupDropdown();
    loadSavedTheme();
});

// Função viewProduct usada nos botões "Detalhe" dos produtos
function viewProduct(productId) {
    console.log(`Ver detalhes do produto ${productId}`);
    alert(`Visualizando produto ${productId}. Esta funcionalidade será conectada ao backend via Thymeleaf.`);
}

// Smooth scroll para navegação (apenas para âncoras internas)
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Ignorar links de dropdown que não são âncoras de seção
        if (anchor.closest('.dropdown-menu')) return;

        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Só aplicar smooth scroll para âncoras que existem na página
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Theme Toggle Functions
function setupThemeToggle() {
    if (!themeToggle) return;
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update button icon
    const iconElement = themeToggle.querySelector('i');
    if (newTheme === 'light') {
        iconElement.className = 'fas fa-moon';
        themeToggle.title = 'Alternar para tema escuro';
    } else {
        iconElement.className = 'fas fa-sun';
        themeToggle.title = 'Alternar para tema claro';
    }
}

function loadSavedTheme() {
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Update button icon based on saved theme
    const iconElement = themeToggle.querySelector('i');
    if (savedTheme === 'light') {
        iconElement.className = 'fas fa-moon';
        themeToggle.title = 'Alternar para tema escuro';
    } else {
        iconElement.className = 'fas fa-sun';
        themeToggle.title = 'Alternar para tema claro';
    }
}

// Dropdown Functions
function setupDropdown() {
    if (!profileDropdown || !dropdownMenu) return;

    profileDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!profileDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
            closeDropdown();
        }
    });
}

function toggleDropdown() {
    const dropdown = profileDropdown.parentElement;
    dropdown.classList.toggle('active');
}

function closeDropdown() {
    if (!profileDropdown) return;
    const dropdown = profileDropdown.parentElement;
    dropdown.classList.remove('active');
}
