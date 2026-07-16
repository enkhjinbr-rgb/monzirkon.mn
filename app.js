/* MONZIRKON — shared behavior: i18n toggle, sticky header, scroll reveal.
   Page-specific strings are provided by each page as window.PAGE_I18N;
   strings shared by every page (header, footer, contact) live here. */

(function () {
  "use strict";

  var LANG_KEY = "monzirkon-lang";

  var COMMON_I18N = {
    "a11y.skip": { mn: "Агуулга руу очих", en: "Skip to content" },
    "nav.about": { mn: "Танилцуулга", en: "About" },
    "nav.portfolio": { mn: "Багц", en: "Portfolio" },
    "nav.contact": { mn: "Холбоо барих", en: "Contact" },
    "brand.descriptor": { mn: "Хөрөнгө оруулалтын компани", en: "Investment company" },
    "common.open": { mn: "Нээх →", en: "Open →" },
    "common.back": { mn: "← Багц руу буцах", en: "← Back to portfolio" },
    "contact.label": { mn: "Холбоо барих", en: "Contact" },
    "contact.address.label": { mn: "Хаяг", en: "Address" },
    "contact.address": {
      mn: "Улаанбаатар хот 17040, Хан-Уул дүүрэг,<br>2-р хороо, Чингисийн өргөн чөлөө,<br>Сор Билдинг",
      en: "Sor Building, Chinggis Avenue,<br>2nd Khoroo, Khan-Uul District,<br>Ulaanbaatar 17040, Mongolia"
    },
    "contact.phone.label": { mn: "Утас", en: "Phone" },
    "contact.email.label": { mn: "И-мэйл", en: "Email" },
    "footer.address": {
      mn: "Улаанбаатар 17040, Хан-Уул дүүрэг, 2-р хороо,<br>Чингисийн өргөн чөлөө, Сор Билдинг",
      en: "Sor Building, Chinggis Avenue, 2nd Khoroo,<br>Khan-Uul District, Ulaanbaatar 17040, Mongolia"
    },
    "footer.rights": {
      mn: "© 2026 Монзиркон ХХК. Бүх эрх хамгаалагдсан.",
      en: "© 2026 Monzirkon LLC. All rights reserved."
    }
  };

  var dict = Object.assign({}, COMMON_I18N, window.PAGE_I18N || {});

  function applyLang(lang) {
    document.documentElement.lang = lang;

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      var entry = dict[key];
      if (entry && entry[lang] != null) {
        nodes[i].innerHTML = entry[lang];
      }
    }

    if (dict["meta.title"]) {
      document.title = dict["meta.title"][lang];
    }
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict["meta.desc"]) {
      metaDesc.setAttribute("content", dict["meta.desc"][lang]);
    }

    var buttons = document.querySelectorAll(".lang-toggle [data-lang]");
    for (var j = 0; j < buttons.length; j++) {
      var active = buttons[j].getAttribute("data-lang") === lang;
      buttons[j].classList.toggle("is-active", active);
      buttons[j].setAttribute("aria-pressed", String(active));
    }
  }

  function storedLang() {
    try {
      var v = localStorage.getItem(LANG_KEY);
      return v === "en" || v === "mn" ? v : "mn";
    } catch (e) {
      return "mn";
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) { /* private mode — toggle still works for this page */ }
    applyLang(lang);
  }

  applyLang(storedLang());

  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".lang-toggle [data-lang]") : null;
    if (btn) {
      setLang(btn.getAttribute("data-lang"));
    }
  });

  /* sticky header: transparent over hero, solid after scroll */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* fade-up reveal, honoring prefers-reduced-motion */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealNodes = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    for (var k = 0; k < revealNodes.length; k++) {
      revealNodes[k].classList.add("is-visible");
    }
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    for (var m = 0; m < revealNodes.length; m++) {
      io.observe(revealNodes[m]);
    }
  }
})();
