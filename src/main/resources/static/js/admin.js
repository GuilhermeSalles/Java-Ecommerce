// ====================================
// ADMIN (ONLY WHAT IS USED)
// - Theme toggle
// - Product table search + category filter
// - Pagination + page size (10/20/50/100)
// - Money input mask + validation (> 0)
// - Reset form on "Adicionar Produto" / "Cancelar"
// - Delete modal (products)
// ====================================

document.addEventListener('DOMContentLoaded', function () {
  setupThemeToggle();

  // filtros + paginação
  setupProductsTableUI();

  // form
  initMoneyInput();
  bindProductFormActions();
  syncPriceMaskFromHidden();

  // delete modal
  setupDeleteModal();
});

// =======================
// THEME TOGGLE
// =======================
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  themeToggle.addEventListener('click', toggleTheme);
  loadSavedTheme();
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const iconElement = document.querySelector('#theme-toggle i');
  if (!iconElement) return;
  iconElement.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// =======================
// PRODUCTS TABLE UI
// - search (#search-produtos)
// - category select (#filter-categoria)
// - page size (#page-size)
// - pagination container (#table-pagination)
// =======================
function setupProductsTableUI() {
  const table = document.getElementById('produtos-table');
  const tbody = document.getElementById('produtos-tbody') || table?.querySelector('tbody');
  const searchInput = document.getElementById('search-produtos');
  const categorySelect = document.getElementById('filter-categoria');
  const pageSizeSelect = document.getElementById('page-size');
  const paginationEl = document.getElementById('table-pagination');
  const emptyRow = document.getElementById('row-empty');

  if (!table || !tbody || !paginationEl || !pageSizeSelect) return;

  let currentPage = 1;

  function getAllDataRows() {
    // só linhas com TD (ignora th:if "nenhum produto" ou algo estranho)
    return Array.from(tbody.querySelectorAll('tr')).filter(r => r.querySelector('td'));
  }

  function normalize(v) {
    return (v || '').toString().trim().toLowerCase();
  }

  function normalizeUpper(v) {
    return (v || '').toString().trim().toUpperCase();
  }

  function applyFiltersAndPaginate() {
    const rows = getAllDataRows();

    // filtros
    const search = normalize(searchInput?.value);
    const selectedCategory = normalizeUpper(categorySelect?.value);

    // primeiro: marca quais passam no filtro
    const filtered = rows.filter(row => {
      // Nome (col 1) / Categoria (col 2)
      const nome = normalize(row.cells[1]?.textContent);
      const categoria = normalizeUpper(row.cells[2]?.textContent);

      const matchSearch =
        !search ||
        (nome && nome.includes(search)) ||
        (categoria && categoria.toLowerCase().includes(search));

      const matchCategory =
        !selectedCategory || selectedCategory === '' || categoria === selectedCategory;

      return matchSearch && matchCategory;
    });

    // paginação
    const pageSize = parseInt(pageSizeSelect.value, 10) || 10;
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    // garante página válida
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    // esconde tudo
    rows.forEach(r => (r.style.display = 'none'));

    // mostra apenas o slice paginado
    filtered.slice(start, end).forEach(r => (r.style.display = ''));

    // linha "Nenhum produto"
    if (emptyRow) {
      emptyRow.style.display = totalItems === 0 ? '' : 'none';
    }

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    paginationEl.innerHTML = '';

    // se só 1 página, some
    if (totalPages <= 1) return;

    const mkBtn = (label, page, disabled = false, active = false) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-outline btn-small';
      b.textContent = label;

      // leve destaque para o ativo
      if (active) b.classList.add('btn-primary');

      b.disabled = disabled;

      b.addEventListener('click', () => {
        currentPage = page;
        applyFiltersAndPaginate();
      });

      return b;
    };

    // Prev
    paginationEl.appendChild(
      mkBtn('«', currentPage - 1, currentPage === 1)
    );

    // Janela de páginas (para não criar 100 botões)
    const windowSize = 5;
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);

    if (end - start + 1 < windowSize) {
      start = Math.max(1, end - windowSize + 1);
    }

    if (start > 1) {
      paginationEl.appendChild(mkBtn('1', 1, false, currentPage === 1));
      if (start > 2) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.style.opacity = '.7';
        dots.style.padding = '0 .25rem';
        paginationEl.appendChild(dots);
      }
    }

    for (let p = start; p <= end; p++) {
      paginationEl.appendChild(mkBtn(String(p), p, false, p === currentPage));
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.style.opacity = '.7';
        dots.style.padding = '0 .25rem';
        paginationEl.appendChild(dots);
      }
      paginationEl.appendChild(
        mkBtn(String(totalPages), totalPages, false, currentPage === totalPages)
      );
    }

    // Next
    paginationEl.appendChild(
      mkBtn('»', currentPage + 1, currentPage === totalPages)
    );
  }

  // eventos
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      applyFiltersAndPaginate();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      currentPage = 1;
      applyFiltersAndPaginate();
    });
  }

  pageSizeSelect.addEventListener('change', () => {
    currentPage = 1;
    applyFiltersAndPaginate();
  });

  // inicial
  applyFiltersAndPaginate();
}

// =======================
// MONEY INPUT (Product Price)
// - visible mask: #produto-preco-mask
// - hidden to backend: #produto-preco (name="price")
// =======================
function initMoneyInput() {
  const maskInput = document.getElementById('produto-preco-mask');
  const hiddenInput = document.getElementById('produto-preco'); // name="price"
  const form = document.getElementById('produto-form');

  if (!maskInput || !hiddenInput) return;

  const initialValue = parseFloat((hiddenInput.value || '0').toString().replace(',', '.')) || 0;
  setMoneyValue(maskInput, hiddenInput, initialValue);

  maskInput.addEventListener('input', () => {
    const digits = maskInput.value.replace(/\D/g, '');
    const safeDigits = digits === '' ? '0' : digits;
    const cents = parseInt(safeDigits, 10);
    const value = cents / 100;
    setMoneyValue(maskInput, hiddenInput, value);
  });

  maskInput.addEventListener('keydown', (e) => {
    const blocked = ['-', '+', 'e', 'E', '.', ',', ' '];
    if (blocked.includes(e.key)) e.preventDefault();
  });

  maskInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text') || '';
    const digits = text.replace(/\D/g, '');
    const cents = parseInt(digits === '' ? '0' : digits, 10);
    const value = cents / 100;
    setMoneyValue(maskInput, hiddenInput, value);
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      const numeric = parseFloat(hiddenInput.value || '0');
      if (!numeric || numeric <= 0) {
        e.preventDefault();
        maskInput.focus();
        alert('O preço deve ser maior que zero.');
      }
    });
  }
}

function setMoneyValue(maskInput, hiddenInput, value) {
  const v = Math.max(0, Number(value) || 0);
  maskInput.value = formatBRL(v);
  hiddenInput.value = v.toFixed(2); // backend recebe com ponto
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// =======================
// FORM RESET (Adicionar / Cancelar)
// =======================
function bindProductFormActions() {
  const addBtn = document.getElementById('add-produto-btn');
  const cancelBtn = document.getElementById('produto-cancelar-btn');

  if (addBtn) addBtn.addEventListener('click', resetProductForm);
  if (cancelBtn) cancelBtn.addEventListener('click', resetProductForm);
}

function resetProductForm() {
  const id = document.getElementById('produto-id');
  const name = document.getElementById('produto-nome');
  const category = document.getElementById('produto-categoria');
  const state = document.getElementById('produto-estado');
  const desc = document.getElementById('produto-descricao');

  if (id) id.value = '';
  if (name) name.value = '';
  if (category) category.value = '';
  if (state) state.value = 'ACTIVE';
  if (desc) desc.value = '';

  const maskInput = document.getElementById('produto-preco-mask');
  const hiddenInput = document.getElementById('produto-preco');
  if (maskInput && hiddenInput) setMoneyValue(maskInput, hiddenInput, 0);

  if (name) name.focus();
}

function syncPriceMaskFromHidden() {
  const maskInput = document.getElementById('produto-preco-mask');
  const hiddenInput = document.getElementById('produto-preco');
  if (!maskInput || !hiddenInput) return;

  const numeric = parseFloat((hiddenInput.value || '0').toString().replace(',', '.')) || 0;
  setMoneyValue(maskInput, hiddenInput, numeric);
}

// ====================================
// DELETE MODAL (Products)
// ====================================
function setupDeleteModal() {
  const modal = document.getElementById('delete-modal');
  if (!modal) return;

  const confirmBtn = document.getElementById('delete-confirm-btn');
  const cancelBtn = document.getElementById('delete-cancel-btn');

  const nameEl = document.getElementById('delete-product-name');
  const idEl = document.getElementById('delete-product-id');
  const catEl = document.getElementById('delete-product-category');
  const priceEl = document.getElementById('delete-product-price');

  document.querySelectorAll('.btn-delete').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const href = link.getAttribute('href') || '#';
      const id = link.dataset.id || '-';
      const name = link.dataset.name || 'Produto';
      const category = link.dataset.category || '-';
      const price = link.dataset.price ? formatPriceComma(link.dataset.price) : '0,00';

      if (nameEl) nameEl.textContent = name;
      if (idEl) idEl.textContent = id;
      if (catEl) catEl.textContent = category;
      if (priceEl) priceEl.textContent = price;

      if (confirmBtn) confirmBtn.setAttribute('href', href);

      openModal();
    });
  });

  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  function formatPriceComma(value) {
    const n = Number(String(value).replace(',', '.'));
    if (Number.isNaN(n)) return '0,00';
    return n.toFixed(2).replace('.', ',');
  }
}
