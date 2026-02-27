// ====================================
// ADMIN (HARDENED - NO INFINITE RELOAD)
// - Theme toggle
// - Products: local search + server-side nav (category/size -> page=0) WITHOUT form.submit
// - Money input mask + validation (> 0)
// - Reset form on "Adicionar Produto" / "Cancelar"
// - Delete modal (products)
// ====================================

document.addEventListener('DOMContentLoaded', function () {
  // --- DEBUG: se isso aparecer duas vezes no console, seu JS está sendo carregado 2x ---
  // Descomente pra testar:
  // console.log('[admin.js] loaded', new Date().toISOString());

  setupThemeToggle();
  setupProductsTableUI(); // Pageable server-side (link navigation)
  initMoneyInput();
  bindProductFormActions();
  syncPriceMaskFromHidden();
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
// PRODUCTS TABLE UI (SERVER-SIDE PAGEABLE)
// HTML you have (confirmed):
// - form#products-filter-form (GET /admin)
// - input#page-input name="page"
// - select#filter-categoria name="category"
// - select#page-size name="size"
// - input#search-produtos
// - table#produtos-table
//
// Strategy:
// - NEVER submit form automatically (avoid loops)
// - On user change: navigate by updating querystring (section/products, category, size, page=0)
// - Search: local only
// =======================
function setupProductsTableUI() {
  const filterForm = document.getElementById('products-filter-form');
  const categorySelect = document.getElementById('filter-categoria');
  const pageSizeSelect = document.getElementById('page-size');
  const pageInput = document.getElementById('page-input');

  const searchInput = document.getElementById('search-produtos');
  const table = document.getElementById('produtos-table');
  const tbody = table?.querySelector('tbody');

  // Se não está na section products, sai
  if (!filterForm || !categorySelect || !pageSizeSelect || !pageInput) {
    // Mesmo assim, se tiver busca/tabela, não faz nada
    return;
  }

  // Hard stop: nunca permitir submit automático do form por JS
  // (se alguém apertar Enter dentro do form, prevenimos)
  filterForm.addEventListener('submit', function (e) {
    // Esse form é só "portador" de inputs; a navegação é via window.location.
    e.preventDefault();
  });

  // Navega alterando a URL (GET /admin?...), sem form.submit
  function navigateToProducts(params) {
    const url = new URL(window.location.href);

    // garante section
    url.searchParams.set('section', 'products');

    // aplica params
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v === null || v === undefined || v === '') {
        url.searchParams.delete(k);
      } else {
        url.searchParams.set(k, String(v));
      }
    });

    // evita navegação redundante (mesma URL)
    if (url.toString() === window.location.href) return;

    window.location.assign(url.toString());
  }

  // Dispara somente se for ação real do usuário
  function onUserChange(evt, fn) {
    if (!evt || evt.isTrusted !== true) return; // bloqueia changes automáticos do browser
    fn();
  }

  categorySelect.addEventListener('change', (evt) => onUserChange(evt, () => {
    const category = (categorySelect.value || '').trim();
    const size = (pageSizeSelect.value || '').trim();
    navigateToProducts({ category, size, page: 0 });
  }));

  pageSizeSelect.addEventListener('change', (evt) => onUserChange(evt, () => {
    const category = (categorySelect.value || '').trim();
    const size = (pageSizeSelect.value || '').trim();
    navigateToProducts({ category, size, page: 0 });
  }));

  // Search local (somente página atual)
  if (searchInput && tbody) {
    const normalize = (v) => (v || '').toString().trim().toLowerCase();

    const applySearch = () => {
      const q = normalize(searchInput.value);
      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.forEach((row) => {
        // ignora linha "Nenhum produto cadastrado."
        if (row.querySelector('td[colspan]')) return;
        const text = normalize(row.innerText);
        row.style.display = text.includes(q) ? '' : 'none';
      });
    };

    let t = null;
    searchInput.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(applySearch, 120);
    });
  }
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

  const initialValue =
    parseFloat((hiddenInput.value || '0').toString().replace(',', '.')) || 0;

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
  hiddenInput.value = v.toFixed(2);
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

  // Observação: addBtn é <a href="/admin?section=products">, ele navega de qualquer jeito.
  // Se você quer só limpar o form sem navegar, troque o <a> por <button type="button">.
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

  const numeric =
    parseFloat((hiddenInput.value || '0').toString().replace(',', '.')) || 0;

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

  document.querySelectorAll('.btn-delete').forEach((link) => {
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