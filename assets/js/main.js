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

  // L'inscription à la newsletter (formulaires .newsletter-form) est gérée
  // par un script dédié en bas des pages qui en ont une (envoi réel vers
  // Supabase, table "newsletter_subscribers").

  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------- Assistant FAQ (chatbot simple, sans backend ni IA) ----------
  (function () {
    var KB = [
      { k: ["bonjour", "salut", "bonsoir", "hello", "coucou"], a: "Bonjour ! Je suis l'assistant AMD CyberHigh Tech. Posez-moi une question sur nos services, nos tarifs ou nos délais." },
      { k: ["merci"], a: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions." },
      { k: ["prix", "tarif", "tarifs", "cout", "combien coute", "combien ca coute", "budget"], a: "Un site vitrine démarre autour de 900 000 FCFA (≈ 1 372 €), une application web ou e-commerce complexe peut aller de 3 000 000 à plus de 18 000 000 FCFA. Demandez un devis gratuit pour un chiffrage précis, sur la page \"Demander un devis\"." },
      { k: ["devis"], a: "Le premier devis est gratuit et sans engagement : décrivez votre projet sur la page \"Demander un devis\", vous recevez une proposition par email sous 48h ouvrées." },
      { k: ["paiement echelonne", "plusieurs fois", "versement", "acompte"], a: "Oui, la plupart des projets sont facturés en plusieurs versements liés aux étapes clés (démarrage, validation, livraison finale)." },
      { k: ["delai", "combien de temps", "duree"], a: "Un site vitrine prend généralement 2 à 4 semaines, une application web ou mobile de 6 à 12 semaines selon la complexité. Le délai précis est indiqué dans votre devis." },
      { k: ["comment ca se passe", "deroulement", "collaboration", "methode"], a: "Vous êtes accompagné par un chef de projet dédié, avec des points d'étape réguliers et des délais clairement communiqués à chaque phase." },
      { k: ["android", "ios", "iphone", "application mobile", "app mobile", "appli mobile"], a: "Oui, nous développons des applications natives Android et iPhone, ainsi que des applications hybrides couvrant les deux plateformes." },
      { k: ["evoluer", "ajouter des fonctionnalites", "nouvelles pages", "mise a jour du site"], a: "Absolument, tous nos projets sont conçus pour évoluer facilement après leur lancement : nouvelles fonctionnalités, pages ou intégrations." },
      { k: ["proprietaire", "code source", "propriete intellectuelle"], a: "Une fois le projet livré et payé, vous êtes pleinement propriétaire du code source, du contenu et de tous les livrables." },
      { k: ["maintenance", "support", "apres livraison"], a: "Oui, nous proposons des forfaits de maintenance mensuelle incluant mises à jour, sauvegardes, surveillance de sécurité et support technique prioritaire." },
      { k: ["pirate", "hack", "incident", "cyberattaque", "securite critique"], a: "En cas d'incident de sécurité critique, notre équipe intervient rapidement pour isoler la menace, limiter les dégâts et vous accompagner dans la remédiation." },
      { k: ["petite entreprise", "startup", "grande entreprise", "toutes tailles"], a: "Oui, des startups aux entreprises établies, nos solutions s'adaptent à votre taille, votre secteur et votre budget." },
      { k: ["cybersecurite", "securite", "audit"], a: "Nous proposons de l'audit de sécurité, la protection des données et la mise en place de bonnes pratiques, intégrés dès la conception de vos projets." },
      { k: ["services", "que faites vous", "que proposez vous"], a: "Développement web, développement mobile, cybersécurité, cloud & infrastructure, et design graphique. Voir le détail sur la page \"Services\"." },
      { k: ["contact", "telephone", "joindre", "email"], a: "Vous pouvez nous contacter au +229 01 62 62 08 87 (WhatsApp inclus) ou par email à affogbolodilanemerite@gmail.com, du lundi au vendredi 8h-19h." },
      { k: ["ou etes vous", "localisation", "adresse", "benin", "cotonou", "base a"], a: "AMD CyberHigh Tech est basée à Cotonou, au Bénin, et accompagne des clients au Bénin comme à l'international." },
      { k: ["rendez vous", "rdv", "reunion", "appel"], a: "Vous pouvez réserver directement un créneau dans l'agenda depuis la page Contact, avec le bouton \"Prendre rendez-vous\"." }
    ];
    var FALLBACK = "Je n'ai pas de réponse toute prête pour cette question. Le plus simple : contactez directement Mérite via WhatsApp ou le formulaire de contact, il vous répondra sous 24h.";

    function normalize(str) {
      return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ");
    }

    function findAnswer(question) {
      var q = normalize(question);
      var best = null, bestScore = 0;
      KB.forEach(function (entry) {
        var score = 0;
        entry.k.forEach(function (kw) {
          if (q.indexOf(normalize(kw)) !== -1) score += kw.length;
        });
        if (score > bestScore) { bestScore = score; best = entry; }
      });
      return best ? best.a : FALLBACK;
    }

    var wrap = document.createElement("div");
    wrap.className = "amd-chat";
    wrap.innerHTML =
      '<button type="button" class="amd-chat-toggle" aria-label="Assistant AMD CyberHigh Tech">' +
        '<svg class="icon-chat" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<svg class="icon-close" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '</button>' +
      '<div class="amd-chat-panel">' +
        '<div class="amd-chat-header">' +
          '<div><strong>Assistant AMD CyberHigh Tech</strong><span>Répond aux questions fréquentes</span></div>' +
          '<button type="button" class="amd-chat-close" aria-label="Fermer">&times;</button>' +
        '</div>' +
        '<div class="amd-chat-messages"></div>' +
        '<form class="amd-chat-form">' +
          '<input type="text" placeholder="Posez votre question..." aria-label="Votre question" />' +
          '<button type="submit">Envoyer</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(wrap);

    var toggleBtn = wrap.querySelector(".amd-chat-toggle");
    var closeBtn = wrap.querySelector(".amd-chat-close");
    var messages = wrap.querySelector(".amd-chat-messages");
    var chatForm = wrap.querySelector(".amd-chat-form");
    var input = chatForm.querySelector("input");
    var greeted = false;

    function addMessage(text, who) {
      var el = document.createElement("div");
      el.className = "amd-chat-msg " + who;
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function openChat() {
      wrap.classList.add("open");
      if (!greeted) {
        addMessage("Bonjour ! Je suis l'assistant AMD CyberHigh Tech. Posez-moi une question sur nos services, nos tarifs ou nos délais.", "bot");
        greeted = true;
      }
      input.focus();
    }

    toggleBtn.addEventListener("click", function () {
      if (wrap.classList.contains("open")) wrap.classList.remove("open");
      else openChat();
    });
    closeBtn.addEventListener("click", function () { wrap.classList.remove("open"); });

    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) return;
      addMessage(q, "user");
      input.value = "";
      setTimeout(function () {
        addMessage(findAnswer(q), "bot");
      }, 400);
    });
  })();
});
