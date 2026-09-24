/* ============================================================
   MOBILE MENU — CV. Gunung Mas 138
   Muat file ini SETELAH main.js:
   <script src="js/mobile-menu.js"></script>

   PENTING: hapus dulu placeholder alert di main.js
   (blok "11. Mobile burger" yang isinya alert("Menu mobile
   menyusul...")) supaya nggak dobel event.
   ============================================================ */
(function () {
  const navbar = document.getElementById("navbar");
  const burger = document.getElementById("navBurger");
  const panel = document.getElementById("navMobilePanel");
  if (!navbar || !burger || !panel) return;

  function setOpen(open) {
    navbar.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }

  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-controls", "navMobilePanel");

  burger.addEventListener("click", () => {
    setOpen(!navbar.classList.contains("is-open"));
  });

  // klik link di panel -> tutup menu, lalu scroll jalan normal
  panel.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });

  // tap di luar navbar -> tutup
  document.addEventListener("click", (e) => {
    if (navbar.classList.contains("is-open") && !navbar.contains(e.target)) {
      setOpen(false);
    }
  });

  // Escape -> tutup (buat yang pakai keyboard/tablet)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // pindah ke desktop pas menu kebuka -> reset
  window.matchMedia("(min-width: 901px)").addEventListener("change", (mq) => {
    if (mq.matches) setOpen(false);
  });
})();
