/* ============================================================
   Principal Kami — grid logo statis + foto owner-principal
   paginated (6 per halaman, tombol geser). Bukan marquee lagi.
   ============================================================ */
const principalBrands = [
  { name: "Livi", logo: "assets/img/principals/livi.png" },
  { name: "Wilmar", logo: "assets/img/principals/wilmar.png" },
  { name: "Unilever", logo: "assets/img/principals/unilever.png" },
  { name: "Ajinomoto", logo: "assets/img/principals/ajinomoto.png" },
  { name: "Sinarmas", logo: "assets/img/principals/sinarmas.jpeg" },
  { name: "Mamasuka", logo: "assets/img/principals/mamasuka.jpeg" },
  { name: "Mi-Won", logo: "assets/img/principals/miwon.jpeg" },
  { name: "Zeelandia", logo: "assets/img/principals/zeelandia.jpeg" },
  { name: "Super Klin", logo: "assets/img/principals/superklin.jpeg" },
  { name: "Sparkle", logo: "assets/img/principals/sparkle.jpeg" },
  { name: "Jordan", logo: "assets/img/principals/jordan.jpeg" },
  { name: "Vivelle", logo: "assets/img/principals/vivelle.jpeg" },
  { name: "Unilever Pro", logo: "assets/img/principals/unilever.jpeg" },
  { name: "Dahlia", logo: "assets/img/principals/dahlia.jpeg" },
  { name: "Ladaku", logo: "assets/img/principals/ladaku.jpeg" },
  { name: "Desaku", logo: "assets/img/principals/desaku.jpeg" },
  { name: "Bumboo", logo: "assets/img/principals/bumboo.jpeg" },
  { name: "Mypets", logo: "assets/img/principals/mypets.jpeg" },
  { name: "PCG", logo: "assets/img/principals/pcg.jpeg" },
  // Tambah brand baru di sini
];

const ownerPrincipalPhotos = [
  "assets/img/owner-principals/owner-principal-01.jpeg",
  "assets/img/owner-principals/owner-principal-14.jpeg",
  "assets/img/owner-principals/owner-principal-03.jpeg",
  "assets/img/owner-principals/owner-principal-04.jpeg",
  "assets/img/owner-principals/owner-principal-09.jpeg",
  "assets/img/owner-principals/owner-principal-06.jpeg",
  "assets/img/owner-principals/owner-principal-07.jpeg",
  "assets/img/owner-principals/owner-principal-08.jpeg",
  "assets/img/owner-principals/owner-principal-05.jpeg",
  "assets/img/owner-principals/owner-principal-10.jpeg",
  "assets/img/owner-principals/owner-principal-11.jpeg",
  "assets/img/owner-principals/owner-principal-12.jpeg",
  "assets/img/owner-principals/owner-principal-13.jpeg",
  "assets/img/owner-principals/owner-principal-02.jpeg",
];

/* ---------- Grid logo brand — paginated, 8 per halaman (2 baris x 4 kolom) ---------- */
(function initPrincipalLogoSlider() {
  const grid = document.getElementById("principalLogoGrid");
  const prevBtn = document.getElementById("principalLogoPrev");
  const nextBtn = document.getElementById("principalLogoNext");
  const dotsWrap = document.getElementById("principalLogoDots");
  if (!grid || !prevBtn || !nextBtn || !dotsWrap) return;

  const PER_PAGE = 9; // 3 kolom x 3 baris
  const totalPages = Math.ceil(principalBrands.length / PER_PAGE);
  let currentPage = 0;

  function renderDots() {
    dotsWrap.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("button");
      dot.className = "ptm-photo-dot" + (i === currentPage ? " is-active" : "");
      dot.setAttribute("aria-label", `Ke halaman logo ${i + 1}`);
      dot.addEventListener("click", () => goToPage(i));
      dotsWrap.appendChild(dot);
    }
  }

  function renderPage(animate) {
    const start = currentPage * PER_PAGE;
    const pageBrands = principalBrands.slice(start, start + PER_PAGE);

    grid.innerHTML = pageBrands
      .map((b) => `
        <div class="ptm-logo-item">
          <img src="${b.logo}" alt="${b.name}" loading="lazy" />
        </div>
      `)
      .join("");

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;

    document.querySelectorAll("#principalLogoDots .ptm-photo-dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentPage);
    });

    if (animate && typeof gsap !== "undefined") {
      const items = grid.querySelectorAll(".ptm-logo-item");
      gsap.set(items, { opacity: 0, y: -16 });
      gsap.to(items, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" });
    }
  }

  function goToPage(page) {
    currentPage = Math.max(0, Math.min(page, totalPages - 1));
    renderPage(true);
  }

  prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
  nextBtn.addEventListener("click", () => goToPage(currentPage + 1));

  renderDots();
  renderPage(false); // render awal tanpa animasi; reveal scroll di bawah yang nanganin animasi pertama
})();

/* ---------- Foto owner+principal — paginated, 6 per halaman ---------- */
(function initOwnerPhotoSlider() {
  const grid = document.getElementById("ownerPhotoGrid");
  const prevBtn = document.getElementById("ownerPhotoPrev");
  const nextBtn = document.getElementById("ownerPhotoNext");
  const dotsWrap = document.getElementById("ownerPhotoDots");
  if (!grid || !prevBtn || !nextBtn || !dotsWrap) return;

  const PER_PAGE = 6;
  const totalPages = Math.ceil(ownerPrincipalPhotos.length / PER_PAGE);
  let currentPage = 0;

  function renderDots() {
    dotsWrap.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("button");
      dot.className = "ptm-photo-dot" + (i === currentPage ? " is-active" : "");
      dot.setAttribute("aria-label", `Ke halaman foto ${i + 1}`);
      dot.addEventListener("click", () => goToPage(i));
      dotsWrap.appendChild(dot);
    }
  }

  function renderPage(animate) {
    const start = currentPage * PER_PAGE;
    const pagePhotos = ownerPrincipalPhotos.slice(start, start + PER_PAGE);

    grid.innerHTML = pagePhotos
      .map((src) => `
        <div class="ptm-photo-item">
          <img src="${src}" alt="" loading="lazy" />
        </div>
      `)
      .join("");

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;

    document.querySelectorAll(".ptm-photo-dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentPage);
    });

    if (animate && typeof gsap !== "undefined") {
      const items = grid.querySelectorAll(".ptm-photo-item");
      gsap.set(items, { opacity: 0, y: -16 });
      gsap.to(items, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" });
    }
  }

  function goToPage(page) {
    currentPage = Math.max(0, Math.min(page, totalPages - 1));
    renderPage(true);
  }

  prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
  nextBtn.addEventListener("click", () => goToPage(currentPage + 1));

  renderDots();
  renderPage(false); // render awal tanpa animasi; reveal scroll di bawah yang nanganin animasi pertama
})();

/* ---------- Reveal "muncul dari atas" saat section masuk viewport ---------- */
/* ---------- Reveal "muncul dari atas" saat section masuk viewport ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  function revealGrid(containerSelector, itemSelector, stagger) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const items = container.querySelectorAll(itemSelector);
    if (!items.length) return;

    gsap.set(items, { opacity: 0, y: -20 });
    ScrollTrigger.create({
      trigger: container,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(items, { opacity: 1, y: 0, duration: 0.5, stagger, ease: "power2.out" });
      },
    });
  }

  revealGrid("#principalLogoGrid", ".ptm-logo-item", 0.06);
  revealGrid("#ownerPhotoGrid", ".ptm-photo-item", 0.05);
  revealGrid(".testimonials__grid", ".testimonial-card", 0.08);
});