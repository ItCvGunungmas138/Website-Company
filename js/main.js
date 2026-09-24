const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   0. VIDEO LOOP — crossfade antar 2 video biar transisi mulus
   (bukan native loop yang "lompat" pas ganti dari akhir ke awal)
   ============================================================ */
(function initSeamlessVideoLoop() {
  const videoA = document.getElementById("heroVideoA");
  const videoB = document.getElementById("heroVideoB");
  if (!videoA || !videoB) return;

  const PLAYBACK_SPEED = 0.6; // 1 = normal, 0.5 = setengah kecepatan (pelan), 1.5/2 = dipercepat
  videoA.playbackRate = PLAYBACK_SPEED;
  videoB.playbackRate = PLAYBACK_SPEED;

  if (prefersReducedMotion) {
    // fallback sederhana: native loop, tanpa video kedua jalan
    videoA.loop = true;
    videoA.play().catch(() => {});
    videoB.style.display = "none";
    return;
  }

  const CROSSFADE = 0.9; // detik, mulai transisi sebelum video berakhir

  let current = videoA;
  let next = videoB;
  let transitioning = false;

  function handleTimeUpdate(video) {
    if (video !== current || transitioning) return;
    if (!video.duration || isNaN(video.duration)) return;

    if (video.currentTime >= video.duration - CROSSFADE) {
      transitioning = true;

      next.currentTime = 0;
      next.play().catch(() => {});

      gsap.to(next, { opacity: 1, duration: CROSSFADE, ease: "sine.inOut" });
      gsap.to(video, {
        opacity: 0,
        duration: CROSSFADE,
        ease: "sine.inOut",
        onComplete() {
          video.pause();
          const temp = current;
          current = next;
          next = temp;
          transitioning = false;
        },
      });
    }
  }

  videoA.addEventListener("timeupdate", () => handleTimeUpdate(videoA));
  videoB.addEventListener("timeupdate", () => handleTimeUpdate(videoB));

  videoA.play().catch(() => {});
})();

/* ============================================================
   1. LENIS — smooth scroll, disinkronkan ke gsap.ticker
   ============================================================ */
let lenis;
if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ============================================================
   2. GSAP — reveal hero & statsbar, muncul berurutan setelah jeda
   ============================================================ */
let introTl = null;

if (prefersReducedMotion) {
  gsap.set("[data-reveal], .stats-bar__inner", { opacity: 1 });
} else {
  gsap.timeline({ delay: 1.5 }).fromTo(
    "#navbar",
    { opacity: 0, y: -16 },
    { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
  );

  // statsbar muncul duluan, animasinya 1.3 detik
  gsap.timeline({ delay: 0.6 }).fromTo(
    ".stats-bar__inner",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.3, ease: "power3.out" }
  );

  introTl = gsap.timeline({ delay: 2 });

  introTl.fromTo(
    "[data-reveal]",
    { opacity: 0, y: 26 },
    { opacity: 1, y: 0, duration: 1.15, stagger: 0.16, ease: "back.out(1.5)" }
  );
}


const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("navbar--scrolled", window.scrollY > 20);
});

/* ============================================================
   3. COUNT-UP angka di stats bar — langsung jalan begitu halaman
   dimuat (statsbar sekarang tampil instan, tidak lagi menunggu
   intro timeline teks hero).
   ============================================================ */
function startStatsCounters() {
  document.querySelectorAll(".stats-bar__item").forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const valueEl = el.querySelector(".stats-bar__value");
    const counter = { val: 0 };

    gsap.to(counter, {
      val: target,
      duration: prefersReducedMotion ? 0 : 1.3,
      ease: "power2.out",
      onUpdate: () => {
        valueEl.textContent = Math.floor(counter.val).toLocaleString("id-ID");
      },
    });
  });
}

if (prefersReducedMotion) {
  startStatsCounters();
} else {
  gsap.delayedCall(0.6, startStatsCounters);
}

/* ============================================================
   7. Reveal saat discroll — pakai IntersectionObserver
   (sebelumnya pakai ScrollTrigger tapi kadang nggak nyala di
   section yang posisinya deket hero, karena sinkronisasi sama
   Lenis suka meleset. IntersectionObserver lebih sederhana &
   nggak bergantung kalkulasi posisi scroll sama sekali.)
   ============================================================ */
function revealOnScroll(el, { y = 26, duration = 1.1, threshold = 0.2 } = {}) {
  if (!el) return;
  if (prefersReducedMotion) { el.style.opacity = 1; return; }

  gsap.set(el, { opacity: 0, y });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      gsap.to(el, { opacity: 1, y: 0, duration, ease: "power3.out" });
      io.unobserve(entry.target);
    });
  }, { threshold });
  io.observe(el);
}

function revealGroupOnScroll(container, itemSelector, { y = 26, stagger = 0.08, duration = 0.9, threshold = 0.1 } = {}) {
  if (!container) return;
  const items = container.querySelectorAll(itemSelector);
  if (!items.length) return;
  if (prefersReducedMotion) { items.forEach((it) => (it.style.opacity = 1)); return; }

  gsap.set(items, { opacity: 0, y });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      gsap.to(items, { opacity: 1, y: 0, duration, stagger, ease: "power3.out" });
      io.unobserve(entry.target);
    });
  }, { threshold });
  io.observe(container);
}

// Judul section (eyebrow + heading)
document.querySelectorAll("[data-reveal-scroll]").forEach((el) => revealOnScroll(el));

// Testimoni — muncul dari bawah berurutan
revealGroupOnScroll(document.querySelector(".testimonials__grid"), ".testimonial-card", { stagger: 0.08, y: 24 });

// Siapa Kami — 3 kartu fitur
revealGroupOnScroll(document.querySelector(".about__features-row"), ".about__feature-card", { stagger: 0.1, y: 20 });

// Kualitas & Pengiriman — 3 badge + 2 kartu fitur
revealGroupOnScroll(document.querySelector(".about__quality-badges"), ".about__quality-badge", { stagger: 0.1, y: 20 });
revealGroupOnScroll(document.querySelector(".about__quality-features"), ".about__quality-feature", { stagger: 0.12, y: 20 });

// Gudang Terpusat — 4 angka stats + 3 poin navy
revealGroupOnScroll(document.querySelector(".about__warehouse-stats"), ".about__warehouse-stat", { stagger: 0.08, y: 16 });
revealGroupOnScroll(document.querySelector(".about__warehouse-overlay"), ".about__warehouse-point", { stagger: 0.1, y: 20 });

// Cara Order — 3 langkah + kartu pembayaran
revealGroupOnScroll(document.querySelector(".cara-order__steps"), ".cara-order__step", { stagger: 0.12, y: 20 });
revealGroupOnScroll(document.querySelector(".cara-order__payment-grid"), ".cara-order__payment-item", { stagger: 0.06, y: 16 });

/* ============================================================
   10. THREE.JS — layer partikel/glow ringan di atas video hero
   (BUKAN model 3D truk — sengaja dibatasi biar tidak membebani
   performa halaman sesuai kesepakatan)
   ============================================================ */
(function initHeroParticles() {
  const canvas = document.getElementById("heroParticles");
  if (!canvas || prefersReducedMotion) return;

  const heroSection = document.getElementById("hero");
  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.z = 12;

  const PARTICLE_COUNT = 90;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.06,
    color: 0xc9a227, // gold accent — konsisten dengan token warna
    transparent: true,
    opacity: 0.55,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let mouseX = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.0009;
    points.rotation.x += 0.0002;
    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
})();

/* ============================================================
   11. Mobile burger — toggle menu ditangani di index.html (script inline
   setelah main.js), bukan di sini lagi. Placeholder alert() lama dihapus.
   ============================================================ */

const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = new Date().getFullYear();

// (Sistem animasi vanilla JS lama buat .keunggulan__card udah dihapus —
// dulu ada 2 sistem jalan bareng rebutan elemen yang sama, sekarang
// cuma sisa yang GSAP+ScrollTrigger di bawah, konsisten sama section lain.)
// ============================================================

/* ============================================================
   Reveal section "Kenapa HARUS Pilih Kami" — judul dulu,
   lalu kartu satu-satu, baru stats bar di akhir
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const section = document.getElementById("keunggulan");
  if (!section) return;

  const header = section.querySelector(".keunggulan__header");
  const cards = section.querySelectorAll(".keunggulan__card");
  const stats = section.querySelector(".keunggulan__stats");

  gsap.set(header, { opacity: 0, y: -20 });
  gsap.set(cards, { opacity: 0, y: 24 });
  if (stats) gsap.set(stats, { opacity: 0, y: 20 });

  ScrollTrigger.create({
    trigger: section,
    start: "top 75%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      tl.to(header, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" })
        .to(cards, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }, "-=0.2");
      if (stats) {
        tl.to(stats, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.1");
      }
    },
  });
});

/* ============================================================
   15. PRINCIPAL KAMI — render logo & foto owner-principal
   dipindah ke js/principal-slider.js (juga nanganin pagination
   foto owner-principal, nggak cuma logo doang). Jangan diisi lagi
   di sini biar nggak ada 2 sumber data yang bentrok.
   ============================================================ */