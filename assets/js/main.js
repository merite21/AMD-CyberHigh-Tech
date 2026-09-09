var FCFA_PER_EUR = 655.957;
var FCFA_PER_USD = 610;

function formatMoney(n, locale) {
  return Math.round(n).toLocaleString(locale || "fr-FR");
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-fcfa]").forEach(function (el) {
    var amount = parseFloat(el.getAttribute("data-fcfa"));
    if (isNaN(amount)) return;
    var eur = amount / FCFA_PER_EUR;
    var usd = amount / FCFA_PER_USD;
    el.textContent = "≈ " + formatMoney(eur) + " € · " + formatMoney(usd) + " $";
  });

  var root = document.documentElement;
  var themeToggle = document.querySelector(".theme-toggle");
  var storedTheme = null;
  try { storedTheme = localStorage.getItem("amd-theme"); } catch (e) {}
  if (storedTheme === "light" || storedTheme === "dark") {
    root.setAttribute("data-theme", storedTheme);
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("amd-theme", next); } catch (e) {}
    });
  }

  document.querySelectorAll(".nav-item-dropdown").forEach(function (item) {
    var trigger = item.querySelector(".dropdown-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function (e) {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        var isOpen = item.classList.contains("open");
        document.querySelectorAll(".nav-item-dropdown.open").forEach(function (o) {
          if (o !== item) o.classList.remove("open");
        });
        item.classList.toggle("open", !isOpen);
      }
    });
  });

  var navbar = document.querySelector(".navbar");
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    var backTop = document.querySelector(".back-to-top");
    if (backTop) {
      if (window.scrollY > 600) backTop.classList.add("show");
      else backTop.classList.remove("show");
    }
  }
  window.addEventListener("scroll", onScroll);
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
      document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  var currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--i", i % 6);
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseFloat(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          var decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
          var duration = 1800;
          var start = null;

          function step(ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = target * eased;
            el.textContent = value.toFixed(decimals) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toFixed(decimals) + suffix;
          }
          requestAnimationFrame(step);
          countObserver.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  document.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".accordion-item");
      var panel = item.querySelector(".accordion-panel");
      var isOpen = item.classList.contains("open");

      document.querySelectorAll(".accordion-item.open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".accordion-panel").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        panel.style.maxHeight = null;
      } else {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  var filterTabs = document.querySelectorAll(".filter-tab");
  var caseCards = document.querySelectorAll("[data-category]");
  if (filterTabs.length && caseCards.length) {
    filterTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        filterTabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        var filter = tab.getAttribute("data-filter");
        caseCards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-category") === filter;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  // Les formulaires contact, devis et candidature sont gérés par des
  // scripts dédiés en bas de chaque page (envoi réel vers Supabase,
  // paiement Kkiapay pour le devis).

  var newsletterForms = document.querySelectorAll(".newsletter-form");
  newsletterForms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button");
      var original = btn.textContent;
      btn.textContent = "Merci !";
      setTimeout(function () { btn.textContent = original; form.reset(); }, 2200);
    });
  });

  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
