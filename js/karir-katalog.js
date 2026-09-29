(function () {
  const API_BASE = "https://shop.gunungmas138.com/api";
  const GFORM_URL = "https://s.id/LokerCVGunungMas138";
  const grid = document.getElementById("karirGrid");
  if (!grid) return;

  function renderQualifications(text) {
    return text
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => `<li>${line.trim()}</li>`)
      .join("");
  }

  async function init() {
    try {
      const res = await fetch(`${API_BASE}/jobs`);
      const jobs = await res.json();

      if (jobs.length === 0) {
        grid.innerHTML = `<p>Belum ada lowongan tersedia saat ini.</p>`;
        return;
      }

      grid.innerHTML = jobs
        .map((job) => {
          const photo = job.photo_path
            ? `${API_BASE.replace("/api", "")}${job.photo_path}`
            : "assets/img/karir/placeholder.jpeg";

          return `
          <div class="karir-card">
            <div class="karir-card__photo">
              <img src="${photo}" alt="Lowongan ${job.title} CV. Gunung Mas 138" />
            </div>
            <div class="karir-card__body">
              <div class="karir-card__top">
                <span class="karir-card__badge">${job.employment_type}</span>
                <span class="karir-card__location">📍 ${job.location}</span>
              </div>
              <h3>${job.title}</h3>
              <p>${job.description}</p>
              <ul class="karir-card__list">
                ${renderQualifications(job.qualifications)}
              </ul>
              <a href="${GFORM_URL}" target="_blank" rel="noopener" class="btn btn-primary karir-card__btn">Apply Sekarang</a>
            </div>
          </div>`;
        })
        .join("");
    } catch (err) {
      console.error(err);
      grid.innerHTML = `<p>Gagal memuat lowongan. Pastikan server API sedang berjalan.</p>`;
    }
  }

  init();
})();