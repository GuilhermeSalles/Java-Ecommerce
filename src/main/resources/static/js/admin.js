// ====================================
// ADMIN (HARDENED - NO INFINITE RELOAD)
// - Theme toggle
// - Products: local search + server-side nav (pPage/pSize) WITHOUT form.submit
// - Orders: local search + server-side nav (oPage/oSize) WITHOUT form.submit
// - Money input mask + validation (> 0)
// - Reset form on "Adicionar Produto" / "Cancelar"
// - Delete modal (products)
// ====================================

document.addEventListener('DOMContentLoaded', function () {
  setupThemeToggle();
  setupProductsTableUI();
  setupOrdersTableUI();
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
// EXPECTED HTML:
// - form#products-filter-form
// - input#page-input  (hidden name="pPage")
// - select#filter-categoria (name="category")
// - select#page-size (name="pSize")
// - input#search-produtos
// - table#produtos-table
// =======================
function setupProductsTableUI() {
  const filterForm = document.getElementById('products-filter-form');
  const categorySelect = document.getElementById('filter-categoria');
  const pageSizeSelect = document.getElementById('page-size');
  const pageInput = document.getElementById('page-input');

  const searchInput = document.getElementById('search-produtos');
  const table = document.getElementById('produtos-table');
  const tbody = table?.querySelector('tbody');

  if (!filterForm || !categorySelect || !pageSizeSelect || !pageInput) return;

  // Nunca submeter automaticamente
  filterForm.addEventListener('submit', (e) => e.preventDefault());

  function navigateProducts() {
    const url = new URL(window.location.href);
    url.searchParams.set('section', 'products');

    const category = (categorySelect.value || '').trim();
    const pSize = (pageSizeSelect.value || '').trim();

    if (category) url.searchParams.set('category', category);
    else url.searchParams.delete('category');

    if (pSize) url.searchParams.set('pSize', pSize);
    else url.searchParams.delete('pSize');

    url.searchParams.set('pPage', '0');

    if (url.toString() !== window.location.href) {
      window.location.assign(url.toString());
    }
  }

  const onlyUser = (evt, fn) => {
    if (!evt || evt.isTrusted !== true) return;
    fn();
  };

  categorySelect.addEventListener('change', (e) => onlyUser(e, navigateProducts));
  pageSizeSelect.addEventListener('change', (e) => onlyUser(e, navigateProducts));

  // Search local (somente página atual)
  if (searchInput && tbody) {
    const normalize = (v) => (v || '').toString().trim().toLowerCase();

    let t = null;
    searchInput.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const q = normalize(searchInput.value);
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.forEach((row) => {
          if (row.querySelector('td[colspan]')) return;
          const text = normalize(row.innerText);
          row.style.display = text.includes(q) ? '' : 'none';
        });
      }, 120);
    });
  }
}

// =======================
// ORDERS TABLE UI (SERVER-SIDE PAGEABLE)
// EXPECTED HTML:
// - form#orders-filter-form
// - input#orders-page-input (hidden name="oPage")
// - select#filter-shipping (name="shippingStatus")
// - select#filter-paid (name="paid")
// - select#orders-page-size (name="oSize")
// - input#search-orders
// - table#pedidos-table
// =======================
function setupOrdersTableUI() {
  const filterForm = document.getElementById('orders-filter-form');
  const shippingSelect = document.getElementById('filter-shipping');
  const paidSelect = document.getElementById('filter-paid');
  const sizeSelect = document.getElementById('orders-page-size');
  const pageInput = document.getElementById('orders-page-input');

  const searchInput = document.getElementById('search-orders');
  const table = document.getElementById('pedidos-table');
  const tbody = table?.querySelector('tbody');

  if (!filterForm || !shippingSelect || !paidSelect || !sizeSelect || !pageInput) return;

  filterForm.addEventListener('submit', (e) => e.preventDefault());

  function navigateOrders() {
    const url = new URL(window.location.href);
    url.searchParams.set('section', 'orders');

    const shipping = (shippingSelect.value || '').trim();
    const paid = (paidSelect.value || '').trim();
    const oSize = (sizeSelect.value || '').trim();

    if (shipping) url.searchParams.set('shippingStatus', shipping);
    else url.searchParams.delete('shippingStatus');

    if (paid !== '') url.searchParams.set('paid', paid);
    else url.searchParams.delete('paid');

    if (oSize) url.searchParams.set('oSize', oSize);
    else url.searchParams.delete('oSize');

    url.searchParams.set('oPage', '0');

    if (url.toString() !== window.location.href) {
      window.location.assign(url.toString());
    }
  }

  const onlyUser = (evt, fn) => {
    if (!evt || evt.isTrusted !== true) return;
    fn();
  };

  shippingSelect.addEventListener('change', (e) => onlyUser(e, navigateOrders));
  paidSelect.addEventListener('change', (e) => onlyUser(e, navigateOrders));
  sizeSelect.addEventListener('change', (e) => onlyUser(e, navigateOrders));

  // Search local (somente página atual)
  if (searchInput && tbody) {
    const normalize = (v) => (v || '').toString().trim().toLowerCase();

    let t = null;
    searchInput.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const q = normalize(searchInput.value);
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.forEach((row) => {
          if (row.querySelector('td[colspan]')) return;
          const text = normalize(row.innerText);
          row.style.display = text.includes(q) ? '' : 'none';
        });
      }, 120);
    });
  }
}

// =======================
// MONEY INPUT (Product Price)
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