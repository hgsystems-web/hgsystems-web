const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const menuToggle = $("#menuToggle");
const nav = $("#mainNav");
function setMenu(open) {
  nav.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", open);
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}
menuToggle?.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$(".nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
matchMedia("(min-width:901px)").addEventListener("change", e => { if (e.matches) setMenu(false); });

const slides = $$(".slide");
const dots = $("#dots");
let current = 0;
let timer;

slides.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("aria-label", `Ir a la diapositiva ${i + 1}`);
  b.addEventListener("click", () => showSlide(i));
  dots.appendChild(b);
});

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("active", i === current));
  $$("#dots button").forEach((b, i) => b.classList.toggle("active", i === current));
  clearInterval(timer);
  timer = setInterval(() => showSlide(current + 1), 5500);
}
$("#prev")?.addEventListener("click", () => showSlide(current - 1));
$("#next")?.addEventListener("click", () => showSlide(current + 1));
showSlide(0);

const form = $("#contactForm");
form?.addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#name").value.trim();
  const device = $("#device").value.trim();
  const service = $("#service").value || "consulta general";
  const message = $("#message").value.trim();
  const note = $("#formNote");
  const text = `Hola, HG SYSTEMS. Soy ${name}. Necesito ${service} para mi equipo ${device}.${message ? " Problema: " + message : ""}`;
  // Replace this URL with your real WhatsApp number when you have it.
  const whatsappNumber = "591 74911773";
  if (whatsappNumber.includes("X")) {
    note.textContent = "Formulario listo. Para activar WhatsApp, cambia 591XXXXXXXX por tu número en menu.js.";
    return;
  }
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
});

$("#year").textContent = new Date().getFullYear();

const topBtn = $("#topBtn");
window.addEventListener("scroll", () => topBtn.classList.toggle("show", window.scrollY > 500));
topBtn.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, {threshold:.08});
$$(".service-card,.price-card,.process-step,.faq-list,.contact-box").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(18px)";
  el.style.transition = "opacity .6s ease, transform .6s ease";
  observer.observe(el);
});

/* ===== MEJORAS ===== */
window.addEventListener("load", () => setTimeout(() => $("#loader")?.classList.add("done"), 600));
const header = $(".header"), bar = $("#progress");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.width = (scrollY / (h.scrollHeight - innerHeight) * 100) + "%";
  header.classList.toggle("small", scrollY > 60);
}, { passive: true });

// Menú: sección activa
const links = [...$$(".nav a:not(.nav-cta)")];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("header[id],section[id]").forEach(s => spy.observe(s));

// Texto que cambia
const words = ["Más rápido.", "Más limpio.", "Sin fallas.", "Más rápido."], typed = $("#typed");
let w = 0, c = 0, del = false;
(function type() {
  const t = words[w % 3];
  c += del ? -1 : 1; typed.textContent = t.slice(0, c);
  let d = del ? 45 : 95;
  if (!del && c === t.length) { del = true; d = 1600; }
  else if (del && c === 0) { del = false; w++; d = 300; }
  setTimeout(type, d);
})();

// Contadores
const cnt = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; cnt.unobserve(e.target);
  const el = e.target, n = +el.dataset.n, s = el.dataset.s; let t0;
  const f = t => { t0 ??= t; const p = Math.min((t - t0) / 1800, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + s; if (p < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}), { threshold: .5 });
$$("[data-n]").forEach(el => cnt.observe(el));

// Inclinación 3D en tarjetas
$$(".service-card,.price-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => card.style.transform = "");
});

// Partículas sobre el video (también sirven si el video no carga)
const cv = $("#fx"), ctx = cv.getContext("2d"); let P = [], mx = -999, my = -999;
function size() { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; P = Array.from({ length: Math.min(70, cv.width / 20) }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5 })); }
size(); addEventListener("resize", size);
cv.parentElement.addEventListener("mousemove", e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
(function draw() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  P.forEach((p, i) => {
    p.x = (p.x + p.vx + cv.width) % cv.width; p.y = (p.y + p.vy + cv.height) % cv.height;
    ctx.fillStyle = "rgba(255,70,70,.8)"; ctx.fillRect(p.x, p.y, 2, 2);
    for (let j = i + 1; j < P.length; j++) {
      const q = P[j], d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 110) { ctx.strokeStyle = `rgba(255,60,60,${.25 * (1 - d / 110)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
    }
    const dm = Math.hypot(p.x - mx, p.y - my);
    if (dm < 160) { ctx.strokeStyle = `rgba(255,150,60,${.6 * (1 - dm / 160)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my); ctx.stroke(); }
  });
  requestAnimationFrame(draw);
})();

// Entrada escalonada
$$(".service-card,.price-card,.process-step").forEach((el, i) => el.style.transitionDelay = (i % 3) * 120 + "ms");
// Luces RGB de fondo: aparecen al terminar la presentación (hero)
const rgbBg = $("#rgbBg");
const rgbCheck = () => rgbBg.classList.toggle("on", scrollY > innerHeight * 0.6);
addEventListener("scroll", rgbCheck, { passive: true });
rgbCheck();
