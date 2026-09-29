console.log("SCRIPT PRODUK-KATALOG LOADED");

(function () {
  const WA_NUMBER = "6289603988885";

  function resolveApiBase() {
    const { protocol, hostname } = window.location;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}//${hostname}:4000/api`;
    }
    if (hostname.includes("devtunnels.ms")) {
      const apiHost = hostname.replace(/-3000\./, "-4000.");
      return `${protocol}//${apiHost}/api`;
    }
        return "https://shop.gunungmas138.com/api";
  }

  const API_BASE = resolveApiBase();
  console.log("API_BASE dipakai:", API_BASE);

  let allProducts = [];
  let activeCategory = "";
  let searchTerm = "";

  const pillsWrap = document.getElementById("prodPills");
  const itemsGrid = document.getElementById("prodItemsGrid");
  const itemsTitle = document.getElementById("prodItemsTitle");
  const itemsCount = document.getElementById("prodItemsCount");
  const searchInput = document.getElementById("prodSearchInput");

  function imageOrPlaceholder(path) {
    if (path) return `${API_BASE.replace("/api", "")}${path}`;
    return null;
  }

  function waTextLink(productName) {
    const msg = `Halo, saya mau tanya harga & stok untuk produk: ${productName}`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  function bukaWA(product) {
    window.open(waTextLink(product.name), "_blank");
  }

  function renderPills() {
    const categoryCounts = {};
    allProducts.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    const categories = Object.keys(categoryCounts).sort();

    pillsWrap.innerHTML =
      `<button class="prod-pill is-active" data-category="">Semua</button>` +
      categories
        .map((cat) => `<button class="prod-pill" data-category="${cat}">${cat}</button>`)
        .join("");

    document.querySelectorAll(".prod-pill[data-category]").forEach((pill) => {
      pill.addEventListener("click", () => setActiveCategory(pill.dataset.category));
    });
  }

  function renderProductGrid() {
    let filtered = allProducts;

    if (activeCategory) {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(term) || (p.category && p.category.toLowerCase().includes(term))
      );
    }

    itemsTitle.textContent = activeCategory ? `Produk ${activeCategory}` : "Semua Produk";
    itemsCount.textContent = `${filtered.length} produk ditemukan`;

    if (filtered.length === 0) {
      itemsGrid.innerHTML = `<p class="prod-items-empty">Belum ada produk yang cocok.</p>`;
      return;
    }

    itemsGrid.innerHTML = filtered
      .map((p) => {
        const img = imageOrPlaceholder(p.image_path);
        const imageContent = img
          ? `<img src="${img}" alt="${p.name}" loading="lazy" />`
          : `<div class="prod-item-card__placeholder">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                 <rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>
               </svg>
             </div>`;

        return `
        <div class="prod-item-card">
          <div class="prod-item-card__img">${imageContent}</div>
          <div class="prod-item-card__body">
            <span class="prod-item-card__category">${p.category}</span>
            <h4 class="prod-item-card__name">${p.name}</h4>
            <button type="button" class="prod-item-card__wa" data-product-id="${p.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.33C8.51 21.5 10.2 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.2c-.22.62-1.28 1.18-1.77 1.25-.45.07-1.02.1-1.65-.1-.38-.12-.87-.28-1.5-.55-2.64-1.14-4.36-3.8-4.5-3.98-.13-.18-1.07-1.42-1.07-2.7 0-1.28.67-1.92.9-2.18.23-.26.5-.32.67-.32.17 0 .34 0 .48.01.15.01.36-.06.56.43.22.53.75 1.83.82 1.96.07.13.11.29.02.47-.09.18-.13.29-.26.44-.13.15-.27.34-.39.46-.13.13-.26.27-.11.53.15.26.67 1.1 1.43 1.78.98.88 1.81 1.15 2.07 1.28.26.13.41.11.56-.07.15-.18.64-.75.81-1.01.17-.26.34-.22.57-.13.23.09 1.47.69 1.72.82.25.13.42.19.48.3.06.11.06.62-.16 1.24z"/></svg>
              Tanya via WA
            </button>
          </div>
        </div>`;
      })
      .join("");
  }

  itemsGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".prod-item-card__wa");
    if (!btn) return;
    const product = allProducts.find((p) => String(p.id) === btn.dataset.productId);
    if (product) bukaWA(product);
  });

  function setActiveCategory(category) {
    activeCategory = category;
    document.querySelectorAll(".prod-pill").forEach((p) => {
      p.classList.toggle("is-active", p.dataset.category === category);
    });
    renderProductGrid();
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value.trim();
      renderProductGrid();
    });
  }

  function setupPillsScrollUX() {
    const wrap = pillsWrap;
    const nextBtn = document.getElementById("prodPillsNext");
    const thumb = document.getElementById("prodPillsScrollThumb");
    if (!wrap || !nextBtn || !thumb) return;

    nextBtn.addEventListener("click", () => {
      wrap.scrollBy({ left: 160, behavior: "smooth" });
    });

    function updateThumb() {
      const maxScroll = wrap.scrollWidth - wrap.clientWidth;
      if (maxScroll <= 0) {
        thumb.style.width = "100%";
        thumb.style.left = "0%";
        return;
      }
      const ratio = wrap.clientWidth / wrap.scrollWidth;
      const progress = wrap.scrollLeft / maxScroll;
      thumb.style.width = `${ratio * 100}%`;
      thumb.style.left = `${progress * (100 - ratio * 100)}%`;
    }

    wrap.addEventListener("scroll", updateThumb, { passive: true });
    window.addEventListener("resize", updateThumb);
    updateThumb();
  }

  async function init() {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error("Gagal memuat produk");
      allProducts = await res.json();

      renderPills();
      setupPillsScrollUX();

      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get("category");
      if (categoryParam) {
        setActiveCategory(categoryParam);
      } else {
        renderProductGrid();
      }
    } catch (err) {
      console.error("ERROR DI INIT:", err);
      itemsCount.textContent = "";
      itemsGrid.innerHTML = `<p class="prod-items-empty">Gagal memuat produk. Pastikan server API sedang berjalan dan port 4000 juga sudah di-forward (kalau lagi diakses lewat tunnel).</p>`;
    }
  }

  init();
})();
