const PROJECT_LIST = typeof PROJECTS !== "undefined" ? PROJECTS : (console.warn("js/projects.js was not loaded"), []);
const NEWS_LIST = typeof NEWS !== "undefined" ? NEWS : (console.warn("js/posts.js was not loaded"), []);

const TEAM = [
  { name: "Tomo",   role: "Creator, character designer and developer.", role_es: "Creación, diseño de personajes y desarrollo.", photo: "assets/tomo_team_picture.jpg",   x: "https://x.com/ci_tomo0o" },
  { name: "Lili",   role: "Developer and co-creator.", role_es: "Desarrollo y co-creación.",                  photo: "assets/lili_team_picture.jpg",   x: "https://x.com/liliquisha" },
  { name: "Owen",   role: "Tools developer", role_es: "Desarrollo de herramientas.",                            photo: "assets/owen_team_picture.jpg",   x: "https://x.com/itowenmatcha" },
  { name: "Rampie", role: "General development assistant.", role_es: "Asistencia general de desarrollo.",             photo: "assets/rampie_team_picture.jpg", x: "https://x.com/Rampieeeee" },
  { name: "Kori",   role: "Character designer.", role_es: "Diseño de personajes.",                        photo: "assets/kori_team_picture.jpg",                            x: null },

];

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const popIO = (!reduceMotion && "IntersectionObserver" in window)
  ? new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((e, k) => {
          e.target.style.setProperty("--pop-d", Math.min(k, 8) * 140 + "ms");
          e.target.classList.add("is-in");
          popIO.unobserve(e.target);
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -4% 0px" })
  : null;
function armPop() {
  document.querySelectorAll([
    ".about__visual", ".about__title", ".about__lead", ".about__body",
    ".projects .title-row--between", ".team .title-row", ".team__desc",
    ".news .title-row", ".news-search", ".news-empty",
    ".proj-card", ".member", ".news-card",
    ".license-card"
  ].join(",")).forEach((el) => {
    if (el.dataset.pop) return;
    el.dataset.pop = "1";
    el.classList.add("pop");
    if (popIO) popIO.observe(el); else el.classList.add("is-in");
  });
}

const STAR_ICON = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#3b00e0"/><path fill="#fff" d="M10 4.6l1.5 3.3 3.6.4-2.7 2.4.8 3.5L10 12.4l-3.2 1.8.8-3.5L4.9 8.3l3.6-.4z"/></svg>';
const BIRD_ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>';
const DL_ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3"/></svg>';

const SUPPORTED_LANGS = ["en", "es"];
let lang = (() => {
  try { const saved = localStorage.getItem("lang"); if (SUPPORTED_LANGS.includes(saved)) return saved; } catch {}
  return (navigator.language || "en").toLowerCase().startsWith("es") ? "es" : "en";
})();
const t = (k) => (I18N[lang] && I18N[lang][k]) ?? I18N.en[k] ?? k;
const loc = (o) => {
  if (lang === "en" || !o || typeof o !== "object" || Array.isArray(o)) return o;
  const r = { ...o };
  for (const k in o) if (k.endsWith("_" + lang)) r[k.slice(0, -(lang.length + 1))] = o[k];
  return r;
};

const imgOrBlank = (src, alt) =>
  src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" draggable="false">`
      : `<div class="ph" role="img" aria-label="${esc(alt)} (${t("placeholderImg")})"></div>`;

const fmtDate = (iso) => {
  try { return new Date(iso + "T12:00:00").toLocaleDateString(lang === "es" ? "es" : "en-US", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return iso; }
};

const inline = (t) => esc(t)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/\*(.+?)\*/g, "<em>$1</em>")
  .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

const plain = (t) => String(t).replace(/\*\*?|\[([^\]]+)\]\([^)]*\)/g, "$1");

const ytId = (v) => (String(v).match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/) || [, v])[1];
const caption = (c) => (c ? `<figcaption>${inline(c)}</figcaption>` : "");

const prettyName = (src) => decodeURIComponent(String(src).split("/").pop().replace(/\.[a-z0-9]+$/i, "")).replace(/[-_]+/g, " ").trim();
const SP_PLAY = `<svg class="sp__ico sp__ico--play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
const SP_PAUSE = `<svg class="sp__ico sp__ico--pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>`;
const SP_VOL = `<svg class="sp__vi sp__vi--on" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg><svg class="sp__vi sp__vi--off" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M16 9l5 6M21 9l-5 6"/></svg>`;
const SP_CHEV = `<svg class="sp__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;

function renderAudio(b) {
  const raw = Array.isArray(b.audio) ? b.audio : [b.audio];
  const multi = raw.length > 1;
  const items = raw.map((a) => {
    const o = typeof a === "string" ? { src: a } : loc(a);
    return { src: o.src, title: o.title || (!multi && b.title) || prettyName(o.src) };
  });
  const pick = multi
    ? `<select class="sp__select" aria-label="${esc(t("selectSample"))}">${items.map((it, i) => `<option value="${i}" data-src="${esc(it.src)}">${esc(it.title)}</option>`).join("")}</select>${SP_CHEV}`
    : `<span class="sp__name">${esc(items[0].title)}</span>`;
  return `<figure class="sp">
    ${multi && b.title ? `<span class="sp__label">${esc(b.title)}</span>` : ""}
    <div class="sp__bar">
      <div class="sp__pick">${pick}</div>
      <button class="sp__play" type="button" aria-label="${esc(t("play"))}">${SP_PLAY}${SP_PAUSE}</button>
      <div class="sp__vol">
        <button class="sp__mute" type="button" aria-label="${esc(t("mute"))}">${SP_VOL}</button>
        <input class="sp__range sp__range--vol" type="range" min="0" max="1" step="0.01" value="1" aria-label="${esc(t("volume"))}">
      </div>
      <audio preload="none" src="${esc(items[0].src)}"></audio>
    </div>
    <input class="sp__range sp__seek" type="range" min="0" max="1000" step="1" value="0" aria-label="${esc(t("seek"))}">
    ${caption(b.caption)}
  </figure>`;
}

function renderBlock(b) {
  if (typeof b === "string") return `<p>${inline(b)}</p>`;
  b = loc(b);
  if (b.h)       return `<h4 class="post-h">${inline(b.h)}</h4>`;
  if (b.image)   return `<figure class="post-media"><img src="${esc(b.image)}" alt="${esc(b.alt || b.caption || "")}" loading="lazy">${caption(b.caption)}</figure>`;
  if (b.gallery) return `<div class="post-gallery">${b.gallery.map((g) => {
                    const o = typeof g === "string" ? { image: g } : g;
                    return `<figure class="post-media"><img src="${esc(o.image)}" alt="${esc(o.alt || o.caption || "")}" loading="lazy">${caption(o.caption)}</figure>`;
                  }).join("")}</div>`;
  if (b.audio)   return renderAudio(b);
  if (b.video)   return `<figure class="post-media"><video controls playsinline preload="metadata" src="${esc(b.video)}"${b.poster ? ` poster="${esc(b.poster)}"` : ""}></video>${caption(b.caption)}</figure>`;
  if (b.youtube) return `<figure class="post-media"><div class="post-embed"><iframe src="https://www.youtube-nocookie.com/embed/${esc(ytId(b.youtube))}" title="${esc(b.title || "YouTube video")}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen; web-share" allowfullscreen></iframe></div>${caption(b.caption)}</figure>`;
  if (b.quote)   return `<blockquote class="post-quote">${inline(b.quote)}</blockquote>`;
  if (b.link)    return `<p><a class="post-link" href="${esc(b.link)}" target="_blank" rel="noopener noreferrer">${esc(b.label || b.link)}</a></p>`;
  return "";
}
const excerptOf = (n) => n.excerpt || plain(n.body.find((b) => typeof b === "string") || "");

NEWS_LIST.sort((a, b) => String(b.date).localeCompare(String(a.date)));

let newsQuery = "";
const norm = (str) => String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function newsSearchText(raw) {
  const n = loc(raw);
  const parts = [n.title, n.tag, n.date, fmtDate(n.date), n.excerpt];
  for (const blk of n.body || []) {
    if (typeof blk === "string") parts.push(plain(blk));
    else { const o = loc(blk); parts.push(o.h, o.quote, o.caption, o.title, o.label); }
  }
  return norm(parts.filter(Boolean).join(" "));
}
function renderNews() {
  const words = norm(newsQuery).trim().split(/\s+/).filter(Boolean);
  const rows = NEWS_LIST.map((raw, i) => ({ raw, i })).filter(({ raw }) => words.every((w) => newsSearchText(raw).includes(w)));
  const track = $("#news-track");
  track.innerHTML = rows.length
    ? rows.map(({ raw, i }) => { const n = loc(raw); return `
    <button class="news-card" type="button" data-news="${i}" aria-label="${esc(n.title)} — ${t("readMore")}">
      <span class="news-card__media">${imgOrBlank(n.image, n.title)}</span>
      <span class="news-card__title">${esc(n.title)}</span>
      <span class="news-card__text">${esc(excerptOf(n))}</span>
    </button>`; }).join("")
    : `<p class="news-empty" role="status">${esc(t("noResults"))} “${esc(newsQuery.trim())}”</p>`;
  track.scrollLeft = 0;
  armPop();
  window.dispatchEvent(new Event("resize"));
}

function renderLists() {
  $("#projects-track").innerHTML = PROJECT_LIST.map((raw, i) => { const p = loc(raw); return `
    <button class="proj-card" type="button" data-project="${i}" aria-label="${esc(p.title)} — ${t("moreInfo")}">
      ${imgOrBlank(p.image, p.title)}
    </button>`; }).join("");

  $("#team-grid").innerHTML = TEAM.map((raw) => { const m = loc(raw); return `
    <li class="member">
      ${m.photo
        ? `<img class="member__avatar" src="${esc(m.photo)}" alt="${esc(m.name)}" width="98" height="98" loading="lazy">`
        : `<div class="member__avatar member__avatar--fallback" role="img" aria-label="${esc(m.name)}">${esc(m.name[0])}</div>`}
      <h3 class="member__name" style="font-weight:400;margin:0">${esc(m.name)}</h3>
      <p class="member__role">${esc(m.role)}</p>
      ${m.x ? `<a class="member__social" href="${esc(m.x)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(m.name)} ${t("onX")}">${BIRD_ICON}</a>` : ""}
    </li>`; }).join("");

  renderNews();
  armPop();
}
renderLists();

const header = $("#site-header");
const easeInOutCubic = (t) => t * t * t * (t * (t * 6 - 15) + 10);
let scrollAnim = null;

function cancelScrollAnim() { if (scrollAnim) { cancelAnimationFrame(scrollAnim); scrollAnim = null; } }
["wheel", "touchstart", "keydown", "mousedown"].forEach((ev) =>
  window.addEventListener(ev, cancelScrollAnim, { passive: true }));

function targetY(el) {
  if (el.id === "home") return 0;
  const base = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - header.offsetHeight));
  if (el.id === "about") return Math.max(0, base - Math.round(header.offsetHeight * 0.5));
  if (el.id !== "news") return base;
  const head = el.querySelector(".title-row, .wrap");
  const cards = el.querySelectorAll(".news-card, .news-empty");
  if (!head || !cards.length) return base;
  const top = head.getBoundingClientRect().top + window.scrollY;
  const bottom = Math.max(...[...cards].map((c) => c.getBoundingClientRect().bottom + window.scrollY));
  let y = (top + bottom) / 2 - window.innerHeight / 2;
  y = Math.min(y, top - header.offsetHeight - 16);
  return Math.max(base, Math.round(y));
}

function smoothScrollTo(y) {
  cancelScrollAnim();
  const start = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const end = Math.min(y, max);
  const dist = end - start;
  if (reduceMotion || Math.abs(dist) < 2) { window.scrollTo(0, end); return; }
  const duration = Math.min(2600, Math.max(1100, Math.abs(dist) * 0.8));
  const t0 = performance.now();
  const step = (now) => {
    const t = Math.max(0, Math.min(1, (now - t0) / duration));
    window.scrollTo(0, start + dist * easeInOutCubic(t));
    scrollAnim = t < 1 ? requestAnimationFrame(step) : null;
  };
  scrollAnim = requestAnimationFrame(step);
}

$$("[data-scroll]").forEach((a) =>
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = id && $(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    smoothScrollTo(targetY(el));
    history.pushState(null, "", id);
  }));

const burger = $("#burger"), nav = $("#nav");
function closeMenu() { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", t("openMenu")); }
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? t("closeMenu") : t("openMenu"));
});
window.addEventListener("resize", () => { if (window.innerWidth > 1040) closeMenu(); });

const sections = ["home", "about", "projects", "team", "news", "terms"].map((id) => $("#" + id));
const links = new Map($$(".nav a[data-scroll]").map((a) => [a.getAttribute("href").slice(1), a]));
function updateActive() {
  const probe = header.offsetHeight + window.innerHeight * 0.3;
  let current = sections[0];
  sections.forEach((s) => { if (s.getBoundingClientRect().top <= probe) current = s; });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1];
  links.forEach((a, id) => a.classList.toggle("is-active", id === current.id));
}

const team = $("#team"), teamBg = $("#team-bg");
let scrollShift = 0;
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;
let mouseRaf = null;

function paintTeamBg() {
  teamBg.style.transform = `translate3d(${curX.toFixed(1)}px, ${(scrollShift + curY).toFixed(1)}px, 0)`;
}

function updateParallax() {
  if (reduceMotion) return;
  const r = team.getBoundingClientRect();
  if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
  const shift = (window.innerHeight / 2 - (r.top + r.height / 2)) * 0.28;
  const limit = r.height * 0.22 - 28;
  scrollShift = Math.max(-limit, Math.min(limit, shift));
  paintTeamBg();
}

function easeTeamBg() {
  curX += (mouseX - curX) * 0.08;
  curY += (mouseY - curY) * 0.08;
  paintTeamBg();
  mouseRaf = (Math.abs(mouseX - curX) > 0.1 || Math.abs(mouseY - curY) > 0.1) ? requestAnimationFrame(easeTeamBg) : null;
}
if (!reduceMotion) {
  team.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = team.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    const ampX = Math.min(48, r.width * 0.035), ampY = 28;
    mouseX = -nx * 2 * ampX;
    mouseY = -ny * 2 * ampY;
    if (!mouseRaf) mouseRaf = requestAnimationFrame(easeTeamBg);
  });
  team.addEventListener("pointerleave", () => {
    mouseX = 0; mouseY = 0;
    if (!mouseRaf) mouseRaf = requestAnimationFrame(easeTeamBg);
  });
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateActive(); updateParallax(); ticking = false; });
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

const io = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
    }), { threshold: 0.4 })
  : null;
$$(".reveal, .crescendo").forEach((el) => (io ? io.observe(el) : el.classList.add("in-view")));

$$(".hscroll").forEach((track) => {
  let down = false, moved = 0, startX = 0, startLeft = 0, suppress = false;

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    down = true; moved = 0; startX = e.clientX; startLeft = track.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    if (moved > 5) { track.classList.add("is-dragging"); track.scrollLeft = startLeft - dx; }
  });
  window.addEventListener("pointerup", () => {
    if (!down) return;
    down = false;
    if (moved > 5) suppress = true;
    track.classList.remove("is-dragging");
  });
  track.addEventListener("click", (e) => {
    if (suppress) { e.preventDefault(); e.stopPropagation(); suppress = false; }
  }, true);
  track.addEventListener("dragstart", (e) => e.preventDefault());
});

const modal = $("#modal"), modalBody = $("#modal-body");

function openModal(kind, html) {
  modal.className = "modal modal--" + kind;
  modalBody.innerHTML = html;
  modal.querySelector(".modal__panel").scrollTop = 0;
  document.documentElement.classList.add("is-modal-open");
  modal.showModal();
}
$("#modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal && !contactDirty()) modal.close(); });
modal.addEventListener("close", () => {
  openNewsIdx = null;
  document.documentElement.classList.remove("is-modal-open");
  modalBody.innerHTML = "";
});

let openNewsIdx = null;
const langToggleHTML = () => `<div class="lang-toggle lang-toggle--modal" role="group" aria-label="${esc(t("langAria"))}">${
  SUPPORTED_LANGS.map((l) => `<button type="button" data-lang="${l}" aria-pressed="${l === lang}">${l.toUpperCase()}</button>`).join("")
}</div>`;

function newsModalHTML(i) {
  const n = loc(NEWS_LIST[i]);
  return `
      ${n.image
        ? `<div class="modal__hero modal__hero--img"><img class="hero-bg" src="${esc(n.image)}" alt="" aria-hidden="true" draggable="false"><img class="hero-main" src="${esc(n.image)}" alt="${esc(n.title)}" draggable="false"></div>`
        : `<div class="modal__hero">${imgOrBlank(n.image, n.title)}</div>`}
      <div class="modal__meta"><span class="chip">${esc(n.tag)}</span><span class="chip chip--ghost">${esc(fmtDate(n.date))}</span>${langToggleHTML()}</div>
      <h3 id="modal-title">${esc(n.title)}</h3>
      ${n.body.map(renderBlock).join("")}`;
}

function refreshOpenNews() {
  if (openNewsIdx === null || !modal.open) return;
  const panel = modal.querySelector(".modal__panel");
  const top = panel.scrollTop;
  modalBody.innerHTML = newsModalHTML(openNewsIdx);
  panel.scrollTop = top;
  const active = modalBody.querySelector(`.lang-toggle [data-lang="${lang}"]`);
  if (active) active.focus({ preventScroll: true });
}

document.addEventListener("click", (e) => {
  const proj = e.target.closest("[data-project]");
  if (proj) {
    const p = loc(PROJECT_LIST[+proj.dataset.project]);
    openModal("project", `
      <div class="proj-head">
        <div class="proj-head__cover">${imgOrBlank(p.image, p.title)}</div>
        <div class="proj-head__info">
          <h3 id="modal-title">${esc(p.title)}</h3>
          <div class="modal__meta"><span class="chip">${esc(p.type)}</span><span class="chip chip--ghost">${esc(p.status)}</span></div>
        </div>
      </div>
      <div class="proj-content">
        ${p.text.map(renderBlock).join("")}
      </div>`);
    return;
  }
  const news = e.target.closest("[data-news]");
  if (news) {
    openNewsIdx = +news.dataset.news;
    openModal("news", newsModalHTML(openNewsIdx));
  }
});

const licenseText = () => $(lang === "es" ? "#license-text-es" : "#license-text").textContent.trim();

function downloadLicense() {
  const blob = new Blob([licenseText() + "\n"], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = t("licenseFile");
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

$("#license-open").addEventListener("click", () => {
  openModal("license", `
    <h3 id="modal-title">${t("licenseModalTitle")}</h3>
    <div class="license-text" tabindex="0" role="region" aria-label="${t("licenseRegion")}">${esc(licenseText())}</div>
    <button class="btn-download" id="license-download" type="button">${DL_ICON} ${t("downloadTxt")}</button>`);
  $("#license-download").addEventListener("click", downloadLicense);
});

const CONTACT_EMAIL = "inquiry@over-loud.com";
const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;
const SEND_ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const contactDirty = () => modal.classList.contains("modal--contact") &&
  $$("#contact-form [name]", modal).some((el) => el.name !== "_honey" && el.value.trim());

const contactTop = () => `<div class="contact-top"><span class="chip">${esc(CONTACT_EMAIL)}</span>${langToggleHTML()}</div>`;

const contactFormHTML = () => `
  ${contactTop()}
  <h3 id="modal-title" data-i18n="contactTitle">${esc(t("contactTitle"))}</h3>
  <p class="contact-intro" data-i18n="contactIntro">${esc(t("contactIntro"))}</p>
  <form class="contact-form" id="contact-form" autocomplete="on">
    <div class="field">
      <label for="contact-name" data-i18n="contactName">${esc(t("contactName"))}</label>
      <input id="contact-name" name="name" type="text" required maxlength="100" autocomplete="name"
             placeholder="${esc(t("contactNamePh"))}" data-i18n-placeholder="contactNamePh">
    </div>
    <div class="field">
      <label for="contact-email" data-i18n="contactEmail">${esc(t("contactEmail"))}</label>
      <input id="contact-email" name="email" type="email" required maxlength="200" autocomplete="email" inputmode="email"
             placeholder="${esc(t("contactEmailPh"))}" data-i18n-placeholder="contactEmailPh">
    </div>
    <div class="field">
      <label for="contact-message" data-i18n="contactMessage">${esc(t("contactMessage"))}</label>
      <textarea id="contact-message" name="message" required rows="6" maxlength="5000"
                placeholder="${esc(t("contactMessagePh"))}" data-i18n-placeholder="contactMessagePh"></textarea>
    </div>
    <p class="contact-note" data-i18n="contactNote">${esc(t("contactNote"))}</p>
    <div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="_honey" tabindex="-1" autocomplete="off"></label></div>
    <p class="contact-status" id="contact-status" role="status" aria-live="polite"></p>
    <button class="btn-download" id="contact-send" type="submit"><span data-i18n="contactSend">${esc(t("contactSend"))}</span> ${SEND_ICON}</button>
  </form>`;

const contactMailtoHref = (d) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("OVER-LOUD website inquiry")}` +
  `&body=${encodeURIComponent(`${d.message || ""}\n\n— ${d.name || ""} (${d.email || ""})`)}`;

$$("[data-contact]").forEach((a) => a.addEventListener("click", (e) => {
  e.preventDefault();
  closeMenu();
  openModal("contact", contactFormHTML());
}));

modalBody.addEventListener("submit", async (e) => {
  const form = e.target.closest("#contact-form");
  if (!form) return;
  e.preventDefault();

  const d = Object.fromEntries(new FormData(form));
  if (d._honey) return;

  const btn = $("#contact-send"), label = btn.querySelector("span"), status = $("#contact-status");
  const setLabel = (key) => { label.dataset.i18n = key; label.textContent = t(key); };
  status.innerHTML = "";
  btn.disabled = true;
  setLabel("contactSending");

  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        name: d.name, email: d.email, message: d.message,
        _subject: "OVER-LOUD website inquiry", _template: "table", _captcha: "false"
      })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || String(json.success) === "false") throw new Error(json.message || res.status);

    if (!modal.open || !$("#contact-form")) return;
    modalBody.innerHTML = `
      ${contactTop()}
      <h3 id="modal-title" data-i18n="contactSuccessTitle">${esc(t("contactSuccessTitle"))}</h3>
      <p data-i18n="contactSuccess">${esc(t("contactSuccess"))}</p>
      <button class="btn-download" id="contact-done" type="button"><span data-i18n="close">${esc(t("close"))}</span></button>`;
    $("#contact-done").addEventListener("click", () => modal.close());
  } catch (err) {
    if (!modal.open || !$("#contact-form")) return;
    status.classList.add("is-error");
    status.innerHTML = `<span data-i18n="contactError">${esc(t("contactError"))}</span> ` +
      `<a href="${esc(contactMailtoHref(d))}" data-i18n="contactMailto">${esc(t("contactMailto"))}</a>`;
    btn.disabled = false;
    setLabel("contactSend");
  }
});

$$("a[data-placeholder]").forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));

$$(".hscroll").forEach((track) => {
  const prev = $(`[data-arrow="prev"][data-for="${track.id}"]`);
  const next = $(`[data-arrow="next"][data-for="${track.id}"]`);
  if (!prev || !next) return;

  const step = () => {
    const card = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
  };
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  };
  const go = (dir) => track.scrollBy({ left: dir * step(), behavior: reduceMotion ? "auto" : "smooth" });

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
  track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  window.addEventListener("resize", update);
  update();
});


function applyStatic() {
  document.documentElement.lang = lang;
  document.title = t("title");
  const meta = $('meta[name="description"]'); if (meta) meta.content = t("metaDesc");
  $$("[data-i18n]").forEach((el) => { const v = t(el.dataset.i18n); if (v.includes("<span")) el.innerHTML = v; else el.textContent = v; });
  $$("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  $$("[data-i18n-placeholder]").forEach((el) => el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder)));
  $$("[data-i18n-alt]").forEach((el) => el.setAttribute("alt", t(el.dataset.i18nAlt)));
  burger.setAttribute("aria-label", nav.classList.contains("is-open") ? t("closeMenu") : t("openMenu"));
  $$(".lang-toggle [data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
}

function setLang(next) {
  if (!SUPPORTED_LANGS.includes(next) || next === lang) return;
  lang = next;
  try { localStorage.setItem("lang", lang); } catch {}
  renderLists();
  applyStatic();
  refreshOpenNews();
  window.dispatchEvent(new Event("resize"));
}

document.addEventListener("click", (e) => {
  const b = e.target.closest(".lang-toggle [data-lang]");
  if (b) setLang(b.dataset.lang);
});
applyStatic();


const spOf = (el) => el.closest(".sp");
const setFill = (input) => input.style.setProperty("--v", (100 * (input.value - input.min) / (input.max - input.min)) + "%");

document.addEventListener("click", (e) => {
  const play = e.target.closest(".sp__play");
  if (play) {
    const au = spOf(play).querySelector("audio");
    if (au.paused) au.play().catch(() => {}); else au.pause();
    return;
  }
  const mute = e.target.closest(".sp__mute");
  if (mute) { const au = spOf(mute).querySelector("audio"); au.muted = !au.muted; }
});

document.addEventListener("input", (e) => {
  const r = e.target.closest?.(".sp__range");
  if (!r) return;
  const sp = spOf(r), au = sp.querySelector("audio");
  setFill(r);
  if (r.classList.contains("sp__range--vol")) { au.volume = +r.value; au.muted = +r.value === 0; }
  else if (isFinite(au.duration)) au.currentTime = (r.value / 1000) * au.duration;
});

document.addEventListener("change", (e) => {
  const sel = e.target.closest?.(".sp__select");
  if (!sel) return;
  const au = spOf(sel).querySelector("audio");
  const wasPlaying = !au.paused;
  au.src = sel.selectedOptions[0].dataset.src;
  if (wasPlaying) au.play().catch(() => {});
  else au.load();
  const seek = spOf(sel).querySelector(".sp__seek");
  seek.value = 0; setFill(seek);
});

function spAudioEvent(e) {
  const au = e.target;
  if (!(au instanceof HTMLAudioElement)) return;
  const sp = spOf(au);
  if (!sp) return;
  const seek = sp.querySelector(".sp__seek"), play = sp.querySelector(".sp__play"), vol = sp.querySelector(".sp__range--vol");
  switch (e.type) {
    case "play":
      $$(".sp audio").forEach((o) => { if (o !== au) o.pause(); });
    case "pause":
      sp.classList.toggle("is-playing", !au.paused);
      play.setAttribute("aria-label", t(au.paused ? "play" : "pause"));
      break;
    case "timeupdate":
      if (isFinite(au.duration) && au.duration > 0) { seek.value = (au.currentTime / au.duration) * 1000; setFill(seek); }
      break;
    case "volumechange":
      sp.classList.toggle("is-muted", au.muted || au.volume === 0);
      sp.querySelector(".sp__mute").setAttribute("aria-label", t(au.muted ? "unmute" : "mute"));
      vol.value = au.muted ? 0 : au.volume; setFill(vol);
      break;
    case "ended": {
      const sel = sp.querySelector(".sp__select");
      if (sel && sel.selectedIndex < sel.options.length - 1) {
        sel.selectedIndex += 1;
        au.src = sel.selectedOptions[0].dataset.src;
        au.play().catch(() => {});
      } else { seek.value = 0; setFill(seek); }
      break;
    }
  }
}
["play", "pause", "timeupdate", "volumechange", "ended"].forEach((n) => document.addEventListener(n, spAudioEvent, true));

const newsInput = $("#news-search"), newsClear = $("#news-search-clear");
newsInput.addEventListener("input", () => {
  newsQuery = newsInput.value;
  newsClear.hidden = !newsQuery;
  renderNews();
});
newsInput.addEventListener("keydown", (e) => { if (e.key === "Escape" && newsInput.value) { e.preventDefault(); newsClear.click(); } });
newsClear.addEventListener("click", () => {
  newsInput.value = ""; newsQuery = ""; newsClear.hidden = true;
  renderNews(); newsInput.focus();
});


(function () {
  const root = document.documentElement;
  const intro = document.getElementById("intro");
  if (!intro) { root.classList.remove("is-intro"); return; }
  const vid = document.getElementById("intro-video");
  const skip = document.getElementById("intro-skip");
  let done = false;

  function finish() {
    if (done) return;
    done = true;
    intro.classList.add("is-leaving");
    root.classList.remove("is-intro");
    setTimeout(() => intro.remove(), 900);
    document.removeEventListener("keydown", onKey);
  }
  function onKey(e) { if (e.key === "Escape") finish(); }

  skip.addEventListener("click", finish);
  document.addEventListener("keydown", onKey);
  vid.addEventListener("ended", finish);
  vid.addEventListener("error", finish);

  const p = vid.play();
  if (p && p.catch) p.catch(finish);
  setTimeout(finish, 9000);
})();
