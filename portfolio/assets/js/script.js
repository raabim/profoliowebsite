/* =========================================================
   Raabim Karki — Portfolio
   Clean vanilla JS: nav, reveal-on-scroll, typing effect, form UI
   ========================================================= */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky nav background on scroll ---------- */
  var nav = document.getElementById("mainNav");
  var backToTop = document.getElementById("backToTop");

  function onScroll() {
    var scrolled = window.scrollY > 40;
    nav.classList.toggle("scrolled", scrolled);
    backToTop.classList.toggle("show", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Smooth scroll + auto-close mobile menu ---------- */
  var navMenuEl = document.getElementById("navMenu");
  var bsCollapse = navMenuEl && window.bootstrap ? new bootstrap.Collapse(navMenuEl, { toggle: false }) : null;

  document.querySelectorAll(".nav-scroll").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId.charAt(0) !== "#") return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      if (navMenuEl && navMenuEl.classList.contains("show") && bsCollapse) {
        bsCollapse.hide();
      }
    });
  });

  /* ---------- Active section highlight (scroll spy) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id], header[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link.nav-scroll"));

  function setActiveLink() {
    var scrollPos = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + current.id;
      link.classList.toggle("active", isActive);
    });
  }
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute("data-reveal-delay");
            entry.target.style.transitionDelay = delay ? delay + "ms" : "0ms";
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Typing animation for hero role ---------- */
  var typedEl = document.getElementById("typedRole");
  var roles = ["PHP & Laravel", "Backend Development", "RESTful APIs", "MySQL & Eloquent"];

  if (typedEl && !prefersReducedMotion) {
    var roleIndex = 0;
    var charIndex = roles[0].length;
    var deleting = false;

    function typeTick() {
      var current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(typeTick, 1600);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }
      }
      typedEl.textContent = roles[roleIndex].substring(0, charIndex) || roles[(roleIndex + roles.length - 1) % roles.length];
      setTimeout(typeTick, deleting ? 40 : 70);
    }
    setTimeout(typeTick, 2200);
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var formData = new FormData(form);
      var recipient = "rabimkarkee101@gmail.com";
      var subject = formData.get("subject");
      var body = [
        "Name: " + formData.get("name"),
        "Email: " + formData.get("email"),
        "",
        formData.get("message")
      ].join("\n");

      window.location.href = "mailto:" + recipient
        + "?subject=" + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(body);
      status.textContent = "Your email app is opening with the message ready to send.";
    });
  }
})();
