/* ============================================================
   AKTIVITAS KAMI — data statis, edit array di bawah buat
   nambah/ganti foto tiap kategori. Nggak perlu admin panel.
   ============================================================ */
const ACTIVITIES = [
  {
    id: "gathering",
    label: "Gathering Karyawan",
    photos: [
    "../assets/img/activities/gathering/gathering1.jpg",
    "../assets/img/activities/gathering/gathering3.jpg",
    "../assets/img/activities/gathering/gathering2.jpg",
    "../assets/img/activities/gathering/gathering5.jpg",
    "../assets/img/activities/gathering/gathering8.jpg",
    "../assets/img/activities/gathering/gathering9.jpg",
    "../assets/img/activities/gathering/gathering11.jpg",
    "../assets/img/activities/gathering/gathering12.jpg",
    "../assets/img/activities/gathering/gathering13.png",
    
    ],
  },
  {
    id: "support-pelanggan",
    label: "Program Support Pelanggan",
    photos: [
    
      "../assets/img/activities/support/support-5.jpeg",
      "../assets/img/activities/support/support-6.png",
     
      "../assets/img/activities/support/support-8.png",
   
      "../assets/img/activities/support/support-11.jpeg",
      "../assets/img/activities/support/support-12.jpeg",
   
      "../assets/img/activities/support/support-14.jpeg",
      "../assets/img/activities/support/support-15.jpeg",
      "../assets/img/activities/support/support-16.jpeg",
      "../assets/img/activities/support/support-17.png",
      "../assets/img/activities/support/support-18.png",
      "../assets/img/activities/support/support-19.png",
      "../assets/img/activities/support/support-20.png",
      
    ],
  },
  {
    id: "apresiasi-team",
    label: "Apresiasi Tim",
    photos: [
      "../assets/img/activities/apresiasi/apresiasi-1.jpg",
      "../assets/img/activities/apresiasi/apresiasi-2.jpg",
      "../assets/img/activities/apresiasi/apresiasi-3.jpg",
      "../assets/img/activities/apresiasi/apresiasi-4.jpg",
      "../assets/img/activities/apresiasi/apresiasi-5.jpg",
      "../assets/img/activities/apresiasi/apresiasi-7.jpg",
      "../assets/img/activities/apresiasi/apresiasi-9.jpg",
      "../assets/img/activities/apresiasi/apresiasi-10.jpg",
  
      "../assets/img/activities/apresiasi/apresiasi-12.jpg",
      "../assets/img/activities/apresiasi/apresiasi-13.jpg",
      "../assets/img/activities/apresiasi/apresiasi-14.jpg",
      "../assets/img/activities/apresiasi/apresiasi-16.jpeg",
      "../assets/img/activities/apresiasi/apresiasi-17.jpeg",
      "../assets/img/activities/apresiasi/apresiasi-18.jpeg",
      "../assets/img/activities/apresiasi/apresiasi-19.png",
      "../assets/img/activities/apresiasi/apresiasi-20.jpeg",
     "../assets/img/activities/apresiasi/apresiasi-21.jpeg",
     "../assets/img/activities/apresiasi/apresiasi-22.jpeg",

    ],
  },
  {
    id: "csr",
    label: "CSR untuk Masyarakat",
    photos: [
      "../assets/img/activities/csr/csr-1.jpg",
      "../assets/img/activities/csr/csr-2.jpg",
      "../assets/img/activities/csr/csr-3.jpg",
      "../assets/img/activities/csr/csr-4.jpg",
      "../assets/img/activities/csr/csr-5.jpg",
      "../assets/img/activities/csr/csr-6.jpg",
      "../assets/img/activities/csr/csr-7.jpg",
      "../assets/img/activities/csr/csr-8.jpg",
      "../assets/img/activities/csr/csr-12.jpeg",
      "../assets/img/activities/csr/csr-10.jpg",
      "../assets/img/activities/csr/csr-11.jpg",
      "../assets/img/activities/csr/csr-9.jpg",

    ],
  },


  
];

const ACTIVITY_TAB_ICONS = {
  "gathering": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  "support-pelanggan": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>`,
  "apresiasi-team": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4z"/><path d="M7 5H3v2a4 4 0 004 4M17 5h4v2a4 4 0 01-4 4"/></svg>`,
  "csr": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 12H3v-2a2 2 0 012-2h3l2 2"/><path d="M13 12h8v2a2 2 0 01-2 2h-3l-2-2"/><path d="M8 8l3 3-1.5 1.5a1.5 1.5 0 002 2L15 11l3-3"/></svg>`,
};

(function initActivitySection() {
  const tabsWrap = document.getElementById("activityTabs");
  const grid = document.getElementById("activityGrid");
  if (!tabsWrap || !grid) return;

  let activeId = ACTIVITIES[0]?.id;

  // ---------- Lightbox: klik foto -> muncul gede, tutup via X atau
  // klik area gelap atau tombol Escape ----------
  function setupLightbox() {
    let lightbox = document.getElementById("activityLightbox");
    if (lightbox) {
      return {
        open: (src, alt) => openLightbox(lightbox, src, alt),
        close: () => closeLightbox(lightbox),
      };
    }

    lightbox = document.createElement("div");
    lightbox.id = "activityLightbox";
    lightbox.className = "activity-lightbox";
    lightbox.innerHTML = `
      <button class="activity-lightbox__close" type="button" aria-label="Tutup">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <img class="activity-lightbox__img" src="" alt="" />
    `;
    document.body.appendChild(lightbox);

    lightbox.querySelector(".activity-lightbox__close").addEventListener("click", () => closeLightbox(lightbox));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox(lightbox); // klik area gelap, bukan fotonya
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox(lightbox);
    });

    return {
      open: (src, alt) => openLightbox(lightbox, src, alt),
      close: () => closeLightbox(lightbox),
    };
  }

  function openLightbox(lightbox, src, alt) {
    const imgEl = lightbox.querySelector(".activity-lightbox__img");
    imgEl.src = src;
    imgEl.alt = alt || "";
    lightbox.classList.add("is-open");
    document.body.classList.add("activity-lightbox-open");
  }

  function closeLightbox(lightbox) {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("activity-lightbox-open");
  }

  const lightboxCtrl = setupLightbox();
 
  function renderTabs() {
    tabsWrap.innerHTML = ACTIVITIES.map(
      (a) => `
      <button class="activity-tab ${a.id === activeId ? "is-active" : ""}" data-id="${a.id}">
        <span class="activity-tab__icon">${ACTIVITY_TAB_ICONS[a.id] || ""}</span>
        <span class="activity-tab__label">${a.label}</span>
      </button>`
    ).join("");
 
    tabsWrap.querySelectorAll(".activity-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        activeId = tab.dataset.id;
        renderTabs();
        renderGrid();
      });
    });
  }
 
  function renderGrid() {
    const active = ACTIVITIES.find((a) => a.id === activeId);
    if (!active) return;
 
    if (active.type === "video") {
      if (!active.videoIds || active.videoIds.length === 0) {
        grid.innerHTML = `<p class="activity-empty">Belum ada video untuk kategori ini.</p>`;
        return;
      }
      grid.innerHTML = active.videoIds
        .map(
          (id) => `
          <div class="activity-video">
            <iframe
              src="https://www.youtube.com/embed/${id}"
              title="${active.label}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              loading="lazy">
            </iframe>
          </div>`
        )
        .join("");
      return;
    }
 
    // default: photo
    if (!active.photos || active.photos.length === 0) {
      grid.innerHTML = `<p class="activity-empty">Belum ada foto untuk kategori ini.</p>`;
      return;
    }

    const isGathering = active.id === "gathering";
    const GATHERING_START_YEAR = 2018; // foto ke-1 = 2018, urut naik per foto

    grid.innerHTML = active.photos
      .map((src, i) => {
        const yearOverlay = isGathering
          ? `<div class="activity-photo__year"><span class="activity-photo__year-label">Gathering</span><span class="activity-photo__year-num">${GATHERING_START_YEAR + i}</span></div>`
          : "";
        return `
        <div class="activity-photo">
          <img src="${src}" alt="${active.label}" loading="lazy" />
          ${yearOverlay}
        </div>`;
      })
      .join("");

    grid.querySelectorAll(".activity-photo img").forEach((img) => {
      img.addEventListener("click", () => lightboxCtrl.open(img.src, img.alt));
    });
  }
 
  renderTabs();
  renderGrid();
})();