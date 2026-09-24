/* ============================================================
   PRODUK PREVIEW — Beranda
   Fetch dari API Shop asli (bukan data.js dummy lagi).
   Tampilin 5 produk per brand + kartu "Lihat Lainnya" yang
   ngelink ke produk.html dengan filter brand aktif.
   ============================================================ */
(function () {
  const API_BASE = "http://localhost:4000/api";
  const PREVIEW_COUNT = 5;

  let allProducts = [];
  let activeBrand = "";

  const tabsWrap = document.getElementById("productsTabs");
  const track = document.getElementById("productsTrack");

  function imageOrPlaceholder(path) {
    if (path) return `${API_BASE.replace("/api", "")}${path}`;
    return null;
  }

  function renderTabs() {
    const brandCounts = {};
    allProducts.forEach((p) => {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    });
    const brands = Object.keys(brandCounts).sort();

    if (!activeBrand && brands.length) activeBrand = brands[0];

    tabsWrap.innerHTML = brands
      .map(
        (brand) => `
        <button class="products__tab ${brand === activeBrand ? "is-active" : ""}" data-brand="${brand}">
          ${brand}
          <span class="products__tab-count">${brandCounts[brand]}</span>
        </button>`
      )
      .join("");

    tabsWrap.querySelectorAll(".products__tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        activeBrand = tab.dataset.brand;
        renderTabs();
        renderTrack();
      });
    });
  }

  function renderTrack() {
    const brandProducts = allProducts.filter((p) => p.brand === activeBrand);
    const preview = brandProducts.slice(0, PREVIEW_COUNT);
    const remaining = brandProducts.length - preview.length;

    const cardsHtml = preview
      .map((p) => {
        const img = imageOrPlaceholder(p.image_path);
        const imageContent = img
          ? `<img src="${img}" alt="${p.name}" loading="lazy" />`
          : `<span class="product-card__placeholder">${p.category}</span>`;

        return `
        <div class="product-card">
          <div class="product-card__image">
            ${imageContent}
          </div>
          <div class="product-card__body">
            <div class="product-card__top-row">
              <span class="product-card__principal">${p.brand}</span>
            </div>
            <h3 class="product-card__name">${p.name}</h3>
            <span class="product-card__sku">Stok: ${p.stock_quantity ?? 0} ${p.unit || ""}</span>
          </div>
        </div>`;
      })
      .join("");

    const brandParam = activeBrand ? `?brand=${encodeURIComponent(activeBrand)}` : "";
    const moreCard = `
      <a href="produk.html${brandParam}" class="product-card product-card--more">
        <div class="product-card--more__inner">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <span>Lihat ${remaining > 0 ? remaining + " Produk " : ""}Lainnya</span>
        </div>
      </a>`;

    track.innerHTML = cardsHtml + moreCard;
  }

  async function init() {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error("Gagal memuat produk");
      allProducts = await res.json();
      renderTabs();
      renderTrack();
    } catch (err) {
      console.error(err);
      track.innerHTML = `<p class="products__hint">Gagal memuat produk. Pastikan server API sedang berjalan.</p>`;
    }
  }

  init();
})();
