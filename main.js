/* ============================================================
   THE LUXE & STYLE BARBERSHOP — main.js
   IIFE pattern — no ES modules
   ============================================================ */
(function () {
  "use strict";

  /* ---- Safe wrapper ---- */
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ---- Splash ---- */
  function initSplash() {
    var splash = document.querySelector("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") setTimeout(hide, 700);
    else window.addEventListener("load", function () { setTimeout(hide, 500); });
    setTimeout(hide, 3800);
  }

  /* ---- Nav ---- */
  function initNav() {
    var nav = document.getElementById("nav");
    var burger = document.querySelector(".nav-burger");
    var menu = document.getElementById("nav-menu");
    if (!nav) return;

    window.addEventListener("scroll", function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    }, { passive: true });

    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        burger.querySelectorAll("span")[0].style.transform = open ? "translateY(7px) rotate(45deg)" : "";
        burger.querySelectorAll("span")[1].style.opacity = open ? "0" : "";
        burger.querySelectorAll("span")[2].style.transform = open ? "translateY(-7px) rotate(-45deg)" : "";
      });
    }

    /* Close menu on link click */
    document.querySelectorAll(".nav-link").forEach(function (a) {
      a.addEventListener("click", function () {
        if (menu) menu.classList.remove("is-open");
        if (burger) {
          burger.setAttribute("aria-expanded", "false");
          burger.querySelectorAll("span").forEach(function (s) { s.style.transform = s.style.opacity = ""; });
        }
      });
    });
  }

  /* ---- Smooth scroll anchors ---- */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 72;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: "smooth"
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  function initReveals() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(function () { el.classList.add("is-visible"); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -3% 0px" });

    els.forEach(function (el) { io.observe(el); });

    /* Safety: force reveal at 6s */
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.1) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ---- GSAP ScrollTrigger reveals ---- */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    /* Service cards stagger */
    gsap.utils.toArray(".service-card").forEach(function (card, i) {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        delay: (i % 3) * 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none"
        }
      });
    });

    /* Review cards stagger */
    gsap.utils.toArray(".review-card").forEach(function (card, i) {
      gsap.from(card, {
        opacity: 0,
        y: 24,
        duration: 0.65,
        delay: i * 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none"
        }
      });
    });

    /* Hero parallax */
    var heroBg = document.querySelector(".hero-bg-img");
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }

  /* ---- Set min date for booking form ---- */
  function initBookingForm() {
    var dateInput = document.getElementById("f-date");
    if (dateInput) {
      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var dd = String(today.getDate()).padStart(2, "0");
      dateInput.min = yyyy + "-" + mm + "-" + dd;
    }

    var form = document.getElementById("booking-form");
    var successEl = document.getElementById("form-success");
    if (!form || !successEl) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var btn = document.getElementById("form-submit");
      if (btn) {
        btn.disabled = true;
        btn.querySelector(".btn-text").textContent = "Sending…";
      }

      /* Build WhatsApp message */
      var name = (document.getElementById("f-name") || {}).value || "";
      var phone = (document.getElementById("f-phone") || {}).value || "";
      var service = (document.getElementById("f-service") || {}).value || "";
      var date = (document.getElementById("f-date") || {}).value || "";
      var time = (document.getElementById("f-time") || {}).value || "";
      var notes = (document.getElementById("f-notes") || {}).value || "";

      var serviceNames = {
        haircut: "Classic Haircut - $28",
        fade: "Skin Fade - $35",
        beard: "Beard Trim & Shape - $20",
        shave: "Hot Towel Shave - $40",
        kids: "Kids Cut - $22",
        combo: "Cut & Beard Combo - $45"
      };

      var msg = "Hi! I'd like to book an appointment at The Luxe & Style Barbershop.\n\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Service: " + (serviceNames[service] || service) + "\n" +
        "Date: " + date + "\n" +
        "Time: " + time + "\n" +
        (notes ? "Notes: " + notes : "");

      /* Simulate brief delay then show success */
      setTimeout(function () {
        form.hidden = true;
        successEl.hidden = false;

        /* Update WhatsApp link with pre-filled message */
        var waLink = successEl.querySelector("a[href*='wa.me']");
        if (waLink) {
          waLink.href = "https://wa.me/18608796194?text=" + encodeURIComponent(msg);
        }
      }, 800);
    });
  }

  /* ---- Tilt on service cards ---- */
  function initTilt() {
    if (window.matchMedia("(hover: none)").matches) return;
    document.querySelectorAll(".service-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = "perspective(600px) rotateY(" + (dx * 4) + "deg) rotateX(" + (-dy * 4) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---- Boot ---- */
  function boot() {
    safe(initSplash, "splash");
    safe(initNav, "nav");
    safe(initSmoothScroll, "scroll");
    safe(initReveals, "reveals");
    safe(initBookingForm, "form");
    safe(initTilt, "tilt");

    /* GSAP after libs load */
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { safe(initGSAP, "gsap"); });
    } else {
      safe(initGSAP, "gsap");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
