// ====================================
// ADMIN PANEL FUNCTIONALITY
// ====================================

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    setupThemeToggle();
    setupFilters();
    initPasswordFeatures();
});

// Theme Toggle Setup
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        loadSavedTheme();
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update button icon
    const iconElement = document.querySelector('#theme-toggle i');
    if (iconElement) {
        if (newTheme === 'light') {
            iconElement.className = 'fas fa-moon';
        } else {
            iconElement.className = 'fas fa-sun';
        }
    }
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const iconElement = document.querySelector('#theme-toggle i');
    if (iconElement) {
        if (savedTheme === 'light') {
            iconElement.className = 'fas fa-moon';
        } else {
            iconElement.className = 'fas fa-sun';
        }
    }
}

// Filters Setup
function setupFilters() {
    // Product filters
    const searchProdutos = document.getElementById('search-produtos');
    if (searchProdutos) {
        searchProdutos.addEventListener('input', filterTable.bind(null, 'produtos-table', [1, 2])); // Filtra por Nome e Categoria
    }

    // User filters
    const searchUsuarios = document.getElementById('search-usuarios');
    if (searchUsuarios) {
        searchUsuarios.addEventListener('input', filterTable.bind(null, 'usuarios-table', [1, 2])); // Filtra por Nome e Email
    }

    // Order filters
    const searchPedidos = document.getElementById('search-pedidos');
    if (searchPedidos) {
        searchPedidos.addEventListener('input', filterTable.bind(null, 'pedidos-table', [0, 1])); // Filtra por ID e Cliente
    }
}

// Função genérica para filtrar tabelas
function filterTable(tableId, columnsToSearch) {
    const searchInput = event.target;
    const tbody = document.getElementById(tableId)?.querySelector('tbody');

    if (!tbody) return;

    const search = searchInput.value.toLowerCase().trim();
    const rows = tbody.querySelectorAll('tr');

    // Se não há busca, mostra todas as linhas
    if (search === '') {
        rows.forEach(row => {
            row.style.display = '';
        });
        return;
    }

    // Filtra pelas colunas especificadas
    rows.forEach(row => {
        let found = false;

        columnsToSearch.forEach(colIndex => {
            const cellText = row.cells[colIndex]?.textContent.toLowerCase() || '';
            if (cellText.includes(search)) {
                found = true;
            }
        });

        row.style.display = found ? '' : 'none';
    });
}

// ====================================
// PASSWORD VALIDATION AND PHONE MASK
// ====================================

// Initialize all password and phone features
function initPasswordFeatures() {
    // Use setTimeout to ensure DOM is fully loaded
    setTimeout(() => {
        initPasswordToggle();
        initPasswordValidation();
        initPhoneMask();
    }, 100);
}

// Password Toggle Functionality
function initPasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordField = this.parentElement.querySelector('input[type="password"], input[type="text"]');
            const icon = this.querySelector('i');

            if (passwordField && passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else if (passwordField) {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Password Requirements Validation
function initPasswordValidation() {
    const passwordField = document.getElementById('usuario-password');
    const confirmPasswordField = document.getElementById('usuario-confirm-password');
    const requirements = document.getElementById('usuario-password-requirements');

    if (!passwordField || !requirements) {
        return;
    }

    const reqLength = document.getElementById('usuario-req-length');
    const reqUppercase = document.getElementById('usuario-req-uppercase');
    const reqNumber = document.getElementById('usuario-req-number');
    const reqSpecial = document.getElementById('usuario-req-special');

    if (!reqLength || !reqUppercase || !reqNumber || !reqSpecial) {
        return;
    }

    passwordField.addEventListener('input', function() {
        const password = this.value;

        // Check length
        validateRequirement(reqLength, password.length >= 8);

        // Check uppercase
        validateRequirement(reqUppercase, /[A-Z]/.test(password));

        // Check number
        validateRequirement(reqNumber, /\d/.test(password));

        // Check special character
        validateRequirement(reqSpecial, /[!@#$%^&*(),.?":{}|<>]/.test(password));

        // Validate confirm password if it has value
        if (confirmPasswordField && confirmPasswordField.value) {
            validatePasswordMatch();
        }
    });

    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('input', validatePasswordMatch);
    }

    function validateRequirement(element, isValid) {
        const icon = element.querySelector('i');
        if (isValid) {
            element.classList.add('valid');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-check');
        } else {
            element.classList.remove('valid');
            icon.classList.remove('fa-check');
            icon.classList.add('fa-times');
        }
    }

    function validatePasswordMatch() {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;

        if (confirmPassword && password !== confirmPassword) {
            confirmPasswordField.setCustomValidity('As senhas não coincidem');
            confirmPasswordField.classList.add('error');
        } else {
            confirmPasswordField.setCustomValidity('');
            confirmPasswordField.classList.remove('error');
        }
    }
}

// Phone Mask
function initPhoneMask() {
    const phoneField = document.getElementById('usuario-phone');
    if (!phoneField) {
        return;
    }

    phoneField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');

        // Limita a 11 dígitos
        if (value.length > 11) {
            value = value.substring(0, 11);
        }

        if (value.length >= 11) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 7) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length >= 1) {
            value = value.replace(/(\d{0,2})/, '($1');
        }

        e.target.value = value;
    });
}
