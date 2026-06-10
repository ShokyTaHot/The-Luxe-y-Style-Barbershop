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

  /* ---- Barbers System ---- */
  var _activeBarber = null;

  function initBarbers() {
    var grid = document.getElementById("barbers-grid");
    if (!grid) return;
    if (!window.BARBERS || !window.BARBERS.length) return;
    if (grid.children.length > 0) return; /* idempotent */

    /* Render barber cards */
    window.BARBERS.forEach(function (b) {
      var card = document.createElement("article");
      card.className = "barber-card reveal";
      card.innerHTML =
        '<img class="barber-card-img" src="' + b.photo + '" alt="Foto de ' + b.name + '" loading="lazy">' +
        '<div class="barber-card-body">' +
          '<p class="barber-card-flag">' + b.flag + '</p>' +
          '<h3 class="barber-card-name">' + b.name + '</h3>' +
          '<p class="barber-card-biz">' + b.business + '</p>' +
          '<p class="barber-card-specialty">' + b.specialty + '</p>' +
          '<div class="barber-card-tags">' +
            b.tags.map(function (t) { return '<span class="barber-tag">' + t + '</span>'; }).join("") +
          '</div>' +
          '<span class="barber-card-cta">Ver Perfil y Reservar</span>' +
        '</div>';
      card.addEventListener("click", function () { openBarberModal(b); });
      grid.appendChild(card);
    });

    /* "Próximo especialista" placeholder */
    var soon = document.createElement("article");
    soon.className = "barber-card barber-card--soon reveal";
    soon.innerHTML =
      '<div class="bc-soon-icon">✂️</div>' +
      '<p class="bc-soon-label">Próximo Especialista</p>';
    grid.appendChild(soon);

    /* Re-observe new reveal elements */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        setTimeout(function () { en.target.classList.add("is-visible"); }, 80);
        io.unobserve(en.target);
      });
    }, { threshold: 0.04 });
    grid.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  function openBarberModal(b) {
    _activeBarber = b;
    var overlay = document.getElementById("barber-modal");
    if (!overlay) return;

    /* Populate header */
    document.getElementById("modal-img").src = b.photo;
    document.getElementById("modal-img").alt = b.name;
    document.getElementById("modal-flag").textContent = b.flag;
    document.getElementById("modal-name").textContent = b.name;
    document.getElementById("modal-business").textContent = b.business;
    document.getElementById("modal-specialty").textContent = b.specialty;
    document.getElementById("modal-tags").innerHTML =
      b.tags.map(function (t) { return '<span class="barber-tag">' + t + '</span>'; }).join("");

    /* Services pane */
    var paneServices = document.getElementById("pane-services");
    if (paneServices.children.length === 0) {
      b.services.forEach(function (cat) {
        var sec = document.createElement("div");
        sec.className = "modal-service-category";
        var rows = cat.items.map(function (it) {
          return '<tr><td>' + it.name + '</td><td>' + it.price + '</td></tr>';
        }).join("");
        sec.innerHTML =
          '<p class="modal-category-label">' + cat.category + '</p>' +
          '<table class="modal-price-table"><tbody>' + rows + '</tbody></table>';
        paneServices.appendChild(sec);
      });
    }

    /* Gallery pane */
    var paneGallery = document.getElementById("pane-gallery");
    if (paneGallery.children.length === 0) {
      var gallGrid = document.createElement("div");
      gallGrid.className = "modal-gallery-grid";
      b.gallery.forEach(function (src) {
        var img = document.createElement("img");
        img.src = src;
        img.alt = "Trabajo de " + b.name;
        img.loading = "lazy";
        gallGrid.appendChild(img);
      });
      paneGallery.appendChild(gallGrid);
    }

    /* Booking pane — populate service select */
    var sel = document.getElementById("bb-service");
    sel.innerHTML = '<option value="" disabled selected>Selecciona un servicio…</option>';
    b.services.forEach(function (cat) {
      var grp = document.createElement("optgroup");
      grp.label = cat.category;
      cat.items.forEach(function (it) {
        var opt = document.createElement("option");
        opt.value = it.name;
        opt.textContent = it.name + " — " + it.price;
        grp.appendChild(opt);
      });
      sel.appendChild(grp);
    });

    /* Time slots */
    var slotsGrid = document.getElementById("time-slots-grid");
    var bbTime = document.getElementById("bb-time");
    slotsGrid.innerHTML = "";
    bbTime.value = "";
    b.timeSlots.forEach(function (slot) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "time-slot";
      btn.textContent = slot;
      btn.addEventListener("click", function () {
        slotsGrid.querySelectorAll(".time-slot").forEach(function (s) { s.classList.remove("is-selected"); });
        btn.classList.add("is-selected");
        bbTime.value = slot;
      });
      slotsGrid.appendChild(btn);
    });

    /* Set min date */
    var dateInput = document.getElementById("bb-date");
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = yyyy + "-" + mm + "-" + dd;
    dateInput.value = "";

    /* Reset form state */
    var form = document.getElementById("barber-book-form");
    var successEl = document.getElementById("bbf-success");
    if (form) { form.hidden = false; form.reset(); }
    if (successEl) { successEl.hidden = true; }

    /* Switch to first tab */
    switchModalTab("services");

    /* Open overlay */
    overlay.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.getElementById("modal-close").focus();
  }

  function closeBarberModal() {
    var overlay = document.getElementById("barber-modal");
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    _activeBarber = null;
  }

  function switchModalTab(name) {
    document.querySelectorAll(".modal-tab").forEach(function (t) {
      var active = t.dataset.tab === name;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    document.querySelectorAll(".modal-pane").forEach(function (p) {
      p.classList.remove("is-active");
    });
    var target = document.getElementById("pane-" + name);
    if (target) target.classList.add("is-active");
  }

  function initModalControls() {
    /* Close button */
    var closeBtn = document.getElementById("modal-close");
    if (closeBtn) closeBtn.addEventListener("click", closeBarberModal);

    /* Click outside panel */
    var overlay = document.getElementById("barber-modal");
    if (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeBarberModal();
      });
    }

    /* ESC key */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeBarberModal();
    });

    /* Tab switching */
    document.querySelectorAll(".modal-tab").forEach(function (tab) {
      tab.addEventListener("click", function () { switchModalTab(tab.dataset.tab); });
    });

    /* Booking form submit */
    var form = document.getElementById("barber-book-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;

        var bbTime = document.getElementById("bb-time");
        if (!bbTime || !bbTime.value) {
          alert("Por favor selecciona una hora disponible.");
          return;
        }

        var b = _activeBarber;
        if (!b) return;

        var name = (document.getElementById("bb-name") || {}).value || "";
        var phone = (document.getElementById("bb-phone") || {}).value || "";
        var service = (document.getElementById("bb-service") || {}).value || "";
        var date = (document.getElementById("bb-date") || {}).value || "";
        var time = bbTime.value;
        var notes = (document.getElementById("bb-notes") || {}).value || "";

        /* Format date nicely */
        var dateDisplay = date;
        try {
          var parts = date.split("-");
          var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          dateDisplay = d.toLocaleDateString("es-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        } catch (ex) { /* keep raw */ }

        var msg =
          "Hola " + b.name + "! Quiero reservar una cita en The Luxe & Style Barbershop.\n\n" +
          "👤 Nombre: " + name + "\n" +
          "📱 Teléfono: " + phone + "\n" +
          "✂️ Servicio: " + service + "\n" +
          "📅 Fecha: " + dateDisplay + "\n" +
          "⏰ Hora: " + time + "\n" +
          (notes ? "📝 Notas: " + notes + "\n" : "") +
          "\n¡Gracias!";

        var waUrl = "https://wa.me/" + b.phone + "?text=" + encodeURIComponent(msg);

        var waLink = document.getElementById("bbf-wa-link");
        if (waLink) waLink.href = waUrl;

        form.hidden = true;
        var successEl = document.getElementById("bbf-success");
        if (successEl) successEl.hidden = false;
      });
    }

    /* "Back" button inside success state */
    var backBtn = document.getElementById("bbf-back");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        var form2 = document.getElementById("barber-book-form");
        var successEl2 = document.getElementById("bbf-success");
        if (form2) { form2.hidden = false; form2.reset(); }
        if (successEl2) { successEl2.hidden = true; }
        /* Reset time slots */
        document.querySelectorAll(".time-slot").forEach(function (s) { s.classList.remove("is-selected"); });
        var bbTime2 = document.getElementById("bb-time");
        if (bbTime2) bbTime2.value = "";
      });
    }
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
    safe(initBarbers, "barbers");
    safe(initModalControls, "modal");
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
