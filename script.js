/* ============================================================
   KaVeDi — клиентский скрипт
   ============================================================ */

/* -----------------------------------------------------------
   1. НАСТРОЙКИ TELEGRAM
   -----------------------------------------------------------
   Вставьте сюда токен вашего бота и ID чата/менеджера.

   Где взять:
   • TELEGRAM_BOT_TOKEN — получите у @BotFather (команда /newbot).
   • TELEGRAM_CHAT_ID   — ID чата, куда придёт заявка.
       Узнать свой ID можно у бота @userinfobot.
       Для группы добавьте бота в группу и используйте ID группы
       (обычно начинается с -100...).

   ВАЖНО: токен будет виден в коде сайта (это публичный фронтенд).
   Если нужна полная безопасность — используйте серверную функцию
   (см. файл /api/send.js и README, раздел «Безопасный вариант»).
   ----------------------------------------------------------- */
const TELEGRAM_BOT_TOKEN = "ВСТАВЬТЕ_ТОКЕН_БОТА";
const TELEGRAM_CHAT_ID   = "ВСТАВЬТЕ_CHAT_ID";

/* Если true — заявка уходит на серверную функцию /api/send
   (безопасно, токен на сервере). Если false — напрямую в Telegram. */
const USE_SERVER_ENDPOINT = false;

/* ===== Год в подвале ===== */
document.getElementById("year").textContent = new Date().getFullYear();

/* ===== Шапка при прокрутке ===== */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
});

/* ===== Бургер-меню ===== */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  nav.classList.toggle("open");
});
nav.querySelectorAll(".nav__link").forEach((link) => {
  link.addEventListener("click", () => {
    burger.classList.remove("active");
    nav.classList.remove("open");
  });
});

/* ===== Анимация появления блоков ===== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ===== Марки и модели авто ===== */
const CARS = {
  "Lada": ["Granta", "Vesta", "Largus", "Niva", "XRAY", "Kalina", "Priora"],
  "Kia": ["Rio", "Cerato", "Sportage", "Optima", "Soul", "Ceed", "Sorento"],
  "Hyundai": ["Solaris", "Creta", "Tucson", "Elantra", "Santa Fe", "i30", "Accent"],
  "Toyota": ["Camry", "Corolla", "RAV4", "Land Cruiser", "Highlander", "Avensis"],
  "Volkswagen": ["Polo", "Passat", "Tiguan", "Golf", "Jetta", "Touareg"],
  "Skoda": ["Octavia", "Rapid", "Kodiaq", "Superb", "Karoq", "Fabia"],
  "BMW": ["3 Series", "5 Series", "X3", "X5", "X6", "7 Series", "1 Series"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "S-Class", "A-Class"],
  "Audi": ["A4", "A6", "Q5", "Q7", "A3", "Q3", "A5"],
  "Nissan": ["Qashqai", "X-Trail", "Almera", "Juke", "Murano", "Terrano"],
  "Renault": ["Logan", "Duster", "Sandero", "Kaptur", "Arkana", "Megane"],
  "Ford": ["Focus", "Mondeo", "Kuga", "Fiesta", "Explorer", "EcoSport"],
  "Chevrolet": ["Cruze", "Aveo", "Lacetti", "Niva", "Captiva", "Cobalt"],
  "Mazda": ["3", "6", "CX-5", "CX-30", "CX-9"],
  "Mitsubishi": ["Outlander", "ASX", "Lancer", "Pajero", "Eclipse Cross"],
  "Honda": ["Civic", "CR-V", "Accord", "Pilot", "HR-V"],
  "Geely": ["Coolray", "Atlas", "Tugella", "Monjaro", "Emgrand"],
  "Chery": ["Tiggo 4", "Tiggo 7 Pro", "Tiggo 8 Pro", "Arrizo"],
  "Haval": ["Jolion", "F7", "F7x", "Dargo", "H9"],
};

const brandInput = document.getElementById("brand");
const brandList = document.getElementById("brands");
const modelInput = document.getElementById("model");
const modelList = document.getElementById("models");

/* Заполняем список марок */
Object.keys(CARS).forEach((brand) => {
  const opt = document.createElement("option");
  opt.value = brand;
  brandList.appendChild(opt);
});

/* Обновляем модели при выборе марки */
brandInput.addEventListener("input", () => {
  const models = CARS[brandInput.value] || [];
  modelList.innerHTML = "";
  models.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m;
    modelList.appendChild(opt);
  });
  modelInput.placeholder = models.length
    ? "Выберите или введите модель"
    : "Введите модель вручную";
});

/* ===== Маска телефона (простая) ===== */
const phoneInput = document.getElementById("phone");
phoneInput.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.startsWith("8")) v = "7" + v.slice(1);
  if (!v.startsWith("7")) v = "7" + v;
  v = v.slice(0, 11);
  let out = "+7";
  if (v.length > 1) out += " (" + v.slice(1, 4);
  if (v.length >= 4) out += ") " + v.slice(4, 7);
  if (v.length >= 7) out += "-" + v.slice(7, 9);
  if (v.length >= 9) out += "-" + v.slice(9, 11);
  e.target.value = out;
});

/* ===== Отправка формы ===== */
const form = document.getElementById("orderForm");
const submitBtn = document.getElementById("submitBtn");
const successBox = document.getElementById("formSuccess");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  /* Валидация обязательных полей */
  const required = ["name", "phone", "service", "brand"];
  let valid = true;
  required.forEach((id) => {
    const field = document.getElementById(id);
    if (!field.value.trim()) {
      field.classList.add("invalid");
      valid = false;
    } else {
      field.classList.remove("invalid");
    }
  });
  if (!valid) return;

  const data = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim() || "—",
    brand: form.brand.value.trim(),
    model: form.model.value.trim() || "—",
    service: form.service.value,
    comment: form.comment.value.trim() || "—",
  };

  const text =
    "🚗 Новая заявка с сайта KaVeDi\n\n" +
    `👤 Имя: ${data.name}\n` +
    `📞 Телефон: ${data.phone}\n` +
    `✉️ Email: ${data.email}\n` +
    `🏷 Марка: ${data.brand}\n` +
    `🚙 Модель: ${data.model}\n` +
    `🛠 Услуга: ${data.service}\n` +
    `💬 Комментарий: ${data.comment}`;

  submitBtn.disabled = true;
  submitBtn.textContent = "Отправляем...";

  try {
    if (USE_SERVER_ENDPOINT) {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, data }),
      });
    } else {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: "HTML",
        }),
      });
      if (!res.ok) throw new Error("Telegram error");
    }

    /* Успех */
    form.querySelectorAll("input, select, textarea, button").forEach(
      (el) => (el.style.display = "none")
    );
    successBox.hidden = false;
    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить заявку";
    alert(
      "Не удалось отправить заявку. Позвоните нам: 8 (8452) 586-586 — или попробуйте ещё раз."
    );
  }
});
