// ====================================
// MAIN FUNCTIONALITY
// ====================================

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const profileDropdown = document.getElementById('profile-dropdown');
const dropdownMenu = document.getElementById('dropdown-menu');

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    setupSmoothScroll();
    setupThemeToggle();
    setupDropdown();
    loadSavedTheme();
    setupCategoryFilters();
});

// Função viewProduct (se ainda usar em algum lugar)
function viewProduct(productId) {
    console.log(`Ver detalhes do produto ${productId}`);
    alert(`Visualizando produto ${productId}. Esta funcionalidade será conectada ao backend via Thymeleaf.`);
}

// ====================================
// Smooth Scroll
// ====================================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Ignorar links do dropdown que não são âncoras de seção
        if (anchor.closest('.dropdown-menu')) return;

        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);

            // Só aplicar smooth scroll para âncoras que existem na página
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

// ====================================
// Theme Toggle
// ====================================
function setupThemeToggle() {
    if (!themeToggle) return;
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    updateThemeIcon(newTheme);
}

function loadSavedTheme() {
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    if (!themeToggle) return;

    const iconElement = themeToggle.querySelector('i');
    if (!iconElement) return;

    if (theme === 'light') {
        iconElement.className = 'fas fa-moon';
        themeToggle.title = 'Alternar para tema escuro';
    } else {
        iconElement.className = 'fas fa-sun';
        themeToggle.title = 'Alternar para tema claro';
    }
}

// ====================================
// Dropdown Perfil
// ====================================
function setupDropdown() {
    if (!profileDropdown || !dropdownMenu) return;

    profileDropdown.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown();
    });

    // Fechar dropdown clicando fora
    document.addEventListener('click', function (e) {
        const dropdownWrapper = profileDropdown.parentElement; // .dropdown
        const clickedInside =
            dropdownWrapper.contains(e.target) || dropdownMenu.contains(e.target);

        if (!clickedInside) {
            closeDropdown();
        }
    });
}

function toggleDropdown() {
    const dropdown = profileDropdown.parentElement; // .dropdown
    dropdown.classList.toggle('active');
}

function closeDropdown() {
    if (!profileDropdown) return;
    const dropdown = profileDropdown.parentElement; // .dropdown
    dropdown.classList.remove('active');
}

// ====================================
// CATEGORY FILTERS (client-side)
// ====================================
function setupCategoryFilters() {
    const filterContainer = document.getElementById('categories-filter');
    const productCards = document.querySelectorAll('.product-card');

    if (!filterContainer || productCards.length === 0) return;

    const buttons = filterContainer.querySelectorAll('.category-btn');

    // aplica filtro inicial via URL (?category=ELECTRONICS etc)
    const initialCategory = getCategoryFromUrl() || 'ALL';
    applyCategoryFilter(initialCategory, buttons, productCards);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = normalizeCategory(btn.dataset.category || 'ALL');
            applyCategoryFilter(category, buttons, productCards);
            updateUrlCategory(category);
        });
    });
}

function applyCategoryFilter(category, buttons, productCards) {
    const normalized = normalizeCategory(category || 'ALL');

    // ativa o botão correto
    buttons.forEach(b => {
        const bCat = normalizeCategory(b.dataset.category || '');
        b.classList.toggle('active', bCat === normalized);
    });

    // filtra cards
    productCards.forEach(card => {
        const cardCategory = normalizeCategory(card.dataset.category || '');

        const show =
            normalized === 'ALL' ||
            normalized === '' ||
            cardCategory === normalized;

        card.style.display = show ? '' : 'none';
    });
}

function normalizeCategory(value) {
    return (value || '')
        .toString()
        .trim()
        .toUpperCase();
}

function getCategoryFromUrl() {
    const url = new URL(window.location.href);
    const cat = url.searchParams.get('category');
    return cat ? normalizeCategory(cat) : null;
}

function updateUrlCategory(category) {
    const url = new URL(window.location.href);

    if (!category || normalizeCategory(category) === 'ALL') {
        url.searchParams.delete('category');
    } else {
        url.searchParams.set('category', normalizeCategory(category));
    }

    window.history.replaceState({}, '', url.toString());
}
