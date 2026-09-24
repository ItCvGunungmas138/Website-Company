document.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  let currentCategory = "Semua";
  let currentBrand = "Semua";
  let searchQuery = "";

  const gridEl = document.getElementById("shopProductGrid");
  const cartListEl = document.getElementById("cartItemsList");
  const cartCountEl = document.getElementById("cartCountBadge");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");
  const searchInput = document.getElementById("searchInput");
  const catList = document.getElementById("categoryList");
  const brandPills = document.getElementById("brandPills");
  const clearCartBtn = document.getElementById("clearCartBtn");

  const formatIDR = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  function renderProducts() {
    const filtered = SHOP_PRODUCTS.filter(p => {
      const matchCat = currentCategory === "Semua" || p.category === currentCategory;
      const matchBrand = currentBrand === "Semua" || p.brand === currentBrand;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchBrand && matchSearch;
    });

    if (filtered.length === 0) {
      gridEl.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--color-stone-400); padding: 3rem;">Produk tidak ditemukan.</p>`;
      return;
    }

   gridEl.innerHTML = filtered.map(p => `
  <div class="shop-card">
    <div class="shop-card__img">
      <span class="shop-card__brand">${p.brand}</span>
      <button class="shop-wishlist-btn">♡</button>
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
    </div>
    <div class="shop-card__body">
      <h4 class="shop-card__title">${p.name}</h4>
      <span class="shop-card__unit">📦 ${p.unit}</span>
      <div class="shop-card__footer">
        <span class="shop-card__price">${formatIDR(p.price)}</span>
        <button class="shop-add-btn" data-id="${p.id}">+ Keranjang</button>
      </div>
    </div>
  </div>
`).join("");
  }

  function renderCart() {
    if (cart.length === 0) {
      cartListEl.innerHTML = `<p class="cart-empty-text">Keranjang masih kosong</p>`;
      cartCountEl.textContent = "0";
      subtotalEl.textContent = formatIDR(0);
      totalEl.textContent = formatIDR(25000);
      return;
    }

    let subtotal = 0;
    cartListEl.innerHTML = cart.map(item => {
      subtotal += item.price * item.qty;
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item__img" />
          <div class="cart-item__info">
            <h5>${item.name}</h5>
            <span class="cart-item__brand">${item.brand}</span>
            <div class="cart-item__controls">
              <button class="qty-btn" data-action="minus" data-id="${item.id}">-</button>
              <span>${item.qty}</span>
              <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
              <span class="cart-item__price">${formatIDR(item.price * item.qty)}</span>
            </div>
          </div>
          <button class="cart-item__del" data-action="del" data-id="${item.id}">🗑</button>
        </div>
      `;
    }).join("");

    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
    cartCountEl.textContent = totalItems;
    subtotalEl.textContent = formatIDR(subtotal);
    totalEl.textContent = formatIDR(subtotal + 25000);
  }

  // Event Listener Tambah ke Keranjang
  gridEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("shop-add-btn")) {
      const id = e.target.dataset.id;
      const product = SHOP_PRODUCTS.find(p => p.id === id);
      const existing = cart.find(i => i.id === id);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...product, qty: 1 });
      }
      renderCart();
    }
  });

  // Event Listener Aksi di Keranjang (+, -, hapus)
  cartListEl.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const action = e.target.dataset.action;
    if (!id || !action) return;

    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (action === "plus") item.qty += 1;
    if (action === "minus") {
      item.qty -= 1;
      if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    if (action === "del") cart = cart.filter(i => i.id !== id);

    renderCart();
  });

  clearCartBtn.addEventListener("click", () => {
    cart = [];
    renderCart();
  });

  // Filter Kategori Sidebar
  catList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    catList.querySelectorAll("li").forEach(el => el.classList.remove("active"));
    li.classList.add("active");
    currentCategory = li.dataset.cat;
    renderProducts();
  });

  // Filter Brand Pills
  brandPills.addEventListener("click", (e) => {
    const btn = e.target.closest(".brand-pill");
    if (!btn) return;
    brandPills.querySelectorAll(".brand-pill").forEach(el => el.classList.remove("active"));
    btn.classList.add("active");
    currentBrand = btn.dataset.brand;
    renderProducts();
  });

  // Real-time Search
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // Inisialisasi awal
  renderProducts();
  renderCart();
});