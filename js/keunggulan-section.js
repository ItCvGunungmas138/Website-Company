// ============================================================
// Scroll reveal untuk section Keunggulan Kami
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".keunggulan__card");
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, i * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((card) => observer.observe(card));
});
