// Form Kontak: cuma 1 jalur -- semua pesan dikirim ke email (Web3Forms)
// sebagai keluhan. Routing ke WhatsApp/subjek lain udah dihapus sesuai
// permintaan atasan (Sept 2026).
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // Ambil access key gratis di web3forms.com (masukin email tujuan, key
  // langsung keluar) -- ganti string di bawah ini pakai key aslinya.
  const WEB3FORMS_KEY = "6affb6bc-8752-44f7-abf7-97c331aa15d4";
  const COMPLAINT_EMAIL = "gunungmas138@gmail.com";

  const nameInput = document.getElementById("cfKeluhanName");
  const emailInput = document.getElementById("cfKeluhanEmail");
  const phoneInput = document.getElementById("cfKeluhanPhone");
  const complaintCategorySelect = document.getElementById("cfComplaintCategory");
  const complaintReasonSelect = document.getElementById("cfComplaintReason");
  const orderNumberInput = document.getElementById("cfOrderNumber");
  const incidentDateInput = document.getElementById("cfIncidentDate");
  const messageInput = document.getElementById("cfKeluhanMessage");
  const submitBtn = form.querySelector(".contact-form__submit");

  // Sub-alasan per kategori keluhan -- "Lainnya" sengaja nggak punya
  // sub-alasan, langsung lanjut ke kolom pesan
  const SUB_REASONS = {
    Kiriman: ["Pengiriman Terlambat", "Sikap Kurir Kurang Sopan"],
    Barang: ["Barang Rusak", "Jumlah Tidak Sesuai Pesanan"],
    Administrasi: ["Admin/Sales Kurang Responsif", "Permintaan Dokumen Tidak Dipenuhi"],
    Lainnya: [],
  };

  function updateComplaintReasonOptions() {
    const category = complaintCategorySelect.value;
    const reasons = SUB_REASONS[category] || [];

    if (reasons.length === 0) {
      complaintReasonSelect.hidden = true;
      complaintReasonSelect.required = false;
      complaintReasonSelect.innerHTML = '<option value="" disabled selected>Pilih Alasan</option>';
    } else {
      complaintReasonSelect.hidden = false;
      complaintReasonSelect.required = true;
      complaintReasonSelect.innerHTML =
        '<option value="" disabled selected>Pilih Alasan</option>' +
        reasons.map((r) => `<option value="${r}">${r}</option>`).join("");
    }
  }

  complaintCategorySelect.addEventListener("change", updateComplaintReasonOptions);

  async function sendViaEmail(payload) {
    const { name, email, phone, complaintCategory, complaintReason, orderNumber, incidentDate, message } = payload;
    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Mengirim...";

    // Gabung kategori + sub-alasan buat ditampilin di email (misal
    // "Kiriman - Pengiriman Terlambat")
    const kategoriLabel = complaintReason ? `${complaintCategory} - ${complaintReason}` : complaintCategory;

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          to: COMPLAINT_EMAIL,
          subject: `[Website] Keluhan: ${kategoriLabel} - dari ${name}`,
          from_name: name,
          name,
          email,
          phone,
          kategori_keluhan: kategoriLabel,
          nomor_pesanan: orderNumber || "-",
          tanggal_kejadian: incidentDate || "-",
          pesan: message,
        }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Keluhan Anda berhasil dikirim. Tim kami akan segera menghubungi Anda.");
        form.reset();
        complaintReasonSelect.hidden = true;
      } else {
        throw new Error(data.message || "Gagal mengirim");
      }
    } catch (err) {
      console.error("Gagal kirim email keluhan:", err);
      alert("Maaf, pengiriman gagal. Silakan coba lagi atau hubungi kami lewat WhatsApp.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    sendViaEmail({
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      complaintCategory: complaintCategorySelect.value.trim(),
      complaintReason: complaintReasonSelect.hidden ? "" : complaintReasonSelect.value.trim(),
      orderNumber: orderNumberInput.value.trim(),
      incidentDate: incidentDateInput.value.trim(),
      message: messageInput.value.trim(),
    });
  });
})();