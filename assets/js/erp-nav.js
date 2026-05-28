(function () {
  "use strict";

  if (window.__erpNavInitialized) {
    return;
  }
  window.__erpNavInitialized = true;

  var serviceMeta = {
    "generative-ai": { icon: "fa-solid fa-wand-magic-sparkles", desc: "Generative AI systems for real business outcomes" },
    "computer-vision": { icon: "fa-solid fa-eye", desc: "Visual intelligence models for automation and quality" },
    "predictive-analytics": { icon: "fa-solid fa-chart-line", desc: "Forecasting insights for faster strategic decisions" },
    "nlp-solutions": { icon: "fa-solid fa-comments", desc: "Language AI for support, search, and workflows" },
    "enterprise-digital-transformation-dx": { icon: "fa-solid fa-arrows-rotate", desc: "Digital transformation programs with measurable delivery impact" },
    "blockchain-and-secure-identity": { icon: "fa-solid fa-shield-halved", desc: "Secure identity architecture and blockchain-enabled trust" },
    "gis-3d-development": { icon: "fa-solid fa-cube", desc: "3D geospatial modeling and immersive map intelligence" },
    "iot-services": { icon: "fa-solid fa-microchip", desc: "Connected device ecosystems with actionable telemetry insights" },
    "technology-migration": { icon: "fa-solid fa-arrow-right-arrow-left", desc: "Low-risk modernization of platforms, data, and apps" },
    "ai-native-mobile-and-web-development": { icon: "fa-solid fa-mobile-screen", desc: "AI-native app engineering for mobile and web" },
    "custom-ai-and-autonomous-agents": { icon: "fa-solid fa-robot", desc: "Autonomous agents tailored to business operations" },
    "ios-app-development": { icon: "fa-brands fa-apple", desc: "High-performance iOS products built for scale" },
    "android-app-development": { icon: "fa-brands fa-android", desc: "Robust Android applications for modern user journeys" },
    "flutter-apps": { icon: "fa-solid fa-mobile", desc: "Cross-platform Flutter apps with native-grade UX" },
    "react-native-apps": { icon: "fa-brands fa-react", desc: "React Native delivery for rapid market launches" },
    "saas-platforms": { icon: "fa-solid fa-cloud", desc: "SaaS architecture, onboarding, and subscription growth" },
    "crm-systems": { icon: "fa-solid fa-address-book", desc: "Customer lifecycle systems optimized for growth teams" },
    "salesforce": { icon: "fa-solid fa-cloud-bolt", desc: "Agentforce and CRM transformation for enterprise teams" },
    "shopify": { icon: "fa-solid fa-cart-shopping", desc: "Scalable commerce systems for B2C and B2B" },
    "business-central": { icon: "fa-solid fa-chart-pie", desc: "Finance and operations modernization with Business Central" },
    "erp-development": { icon: "fa-solid fa-diagram-project", desc: "ERP delivery programs aligned to operational maturity" },
    "seo": { icon: "fa-solid fa-magnifying-glass", desc: "Organic visibility strategy for sustained growth" },
    "search-and-answer-engine-optimization-seo-aeo": { icon: "fa-solid fa-bullseye", desc: "SEO plus answer-engine optimization for discoverability" },
    "seo-is-no-longer-enough": { icon: "fa-solid fa-lightbulb", desc: "Modern discovery strategy beyond traditional SEO playbooks" },
    "ppc": { icon: "fa-solid fa-rectangle-ad", desc: "Paid performance campaigns with conversion accountability" },
    "social-media-marketing": { icon: "fa-solid fa-share-nodes", desc: "Social growth campaigns with engagement and pipeline focus" },
    "campaign-automation": { icon: "fa-solid fa-gears", desc: "Marketing automation workflows for lifecycle orchestration" },
    "audience-personalization": { icon: "fa-solid fa-user-check", desc: "Personalized customer journeys across channels and devices" },
    "aws-and-cloud": { icon: "fa-solid fa-server", desc: "Cloud engineering and AWS operations at scale" },
    "ci-cd-pipelines": { icon: "fa-solid fa-code-branch", desc: "Release automation pipelines for reliable software delivery" },
    monitoring: { icon: "fa-solid fa-gauge", desc: "System observability and proactive performance monitoring" },
    "automation-testing": { icon: "fa-solid fa-vial-circle-check", desc: "Automated quality engineering for faster releases" },
    "manual-qa": { icon: "fa-solid fa-clipboard-check", desc: "Manual testing for edge-case and usability assurance" },
    "performance-testing": { icon: "fa-solid fa-stopwatch", desc: "Load, stress, and resilience testing for scale" },
    "technology-roadmap": { icon: "fa-solid fa-road", desc: "Strategic roadmap planning for long-term technology goals" },
    "architecture-design": { icon: "fa-solid fa-sitemap", desc: "Scalable system architecture for secure enterprise delivery" },
    "product-design-and-ideation": { icon: "fa-solid fa-compass-drafting", desc: "Product ideation and design for market readiness" },
    "ui-ux": { icon: "fa-solid fa-pen-ruler", desc: "Experience design focused on clarity and conversion" },
    "staff-augmentation": { icon: "fa-solid fa-people-group", desc: "Specialist talent extension for delivery continuity" },
    "mvp-design": { icon: "fa-solid fa-rocket", desc: "MVP design and validation for rapid iteration" }
  };

  function slugFromHref(href) {
    var cleanHref = (href || "").split("?")[0].split("#")[0];
    var parts = cleanHref.split("/");
    var lastPart = parts[parts.length - 1] || "";
    return lastPart.replace(".html", "").toLowerCase();
  }

  function isServiceHref(href) {
    if (!href || href === "#") {
      return false;
    }
    return href.indexOf("service/") > -1 || href.indexOf("/services/") > -1;
  }

  function applyMenuRoles() {
    var desktopMenu = document.querySelector(".main-menu > ul");
    if (desktopMenu) {
      desktopMenu.setAttribute("role", "menubar");
    }

    document.querySelectorAll(".main-menu a, .mobile-nav a").forEach(function (anchor) {
      anchor.setAttribute("role", "menuitem");
    });

    document.querySelectorAll(".main-menu ul ul, .mobile-nav ul.sub-menu").forEach(function (submenu, idx) {
      if (!submenu.id) {
        submenu.id = "erp-menu-" + idx;
      }
      submenu.setAttribute("role", "menu");
    });
  }

  function setupDesktopAria() {
    var servicesItem = document.querySelector(".main-menu > ul > li > .services-mega-menu");
    if (!servicesItem) {
      return;
    }

    var trigger = servicesItem.parentElement ? servicesItem.parentElement.querySelector(":scope > a") : null;
    if (!trigger) {
      return;
    }

    if (!servicesItem.id) {
      servicesItem.id = "services-mega-menu-panel";
    }

    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-controls", servicesItem.id);
    trigger.setAttribute("aria-expanded", "false");

    var openAria = function () {
      trigger.setAttribute("aria-expanded", "true");
    };

    var closeAria = function () {
      trigger.setAttribute("aria-expanded", "false");
    };

    servicesItem.parentElement.addEventListener("mouseenter", openAria);
    servicesItem.parentElement.addEventListener("mouseleave", closeAria);
    servicesItem.parentElement.addEventListener("focusin", openAria);
    servicesItem.parentElement.addEventListener("focusout", function (evt) {
      if (!servicesItem.parentElement.contains(evt.relatedTarget)) {
        closeAria();
      }
    });

    trigger.addEventListener("keydown", function (evt) {
      if (evt.key === "Escape") {
        closeAria();
        trigger.blur();
      }
    });
  }

  function syncMobileAria() {
    document.querySelectorAll(".mobile-nav .submenu-button").forEach(function (button, index) {
      var submenu = button.parentElement ? button.parentElement.querySelector(":scope > ul.sub-menu") : null;
      if (!submenu) {
        return;
      }
      if (!submenu.id) {
        submenu.id = "mobile-submenu-" + index;
      }
      button.setAttribute("role", "button");
      button.setAttribute("tabindex", "0");
      button.setAttribute("aria-controls", submenu.id);
      button.setAttribute("aria-expanded", submenu.classList.contains("open-sub") ? "true" : "false");

      button.addEventListener("click", function () {
        window.requestAnimationFrame(function () {
          button.setAttribute("aria-expanded", submenu.classList.contains("open-sub") ? "true" : "false");
        });
      });

      button.addEventListener("keydown", function (evt) {
        if (evt.key === "Enter" || evt.key === " ") {
          evt.preventDefault();
          button.click();
        }
      });
    });
  }

  function decorateServiceLinks() {
    var serviceLinks = document.querySelectorAll(
      ".services-mega-menu a[href], .mobile-nav .sub-menu a[href], .main-menu .dropdown-padding a[href]"
    );

    serviceLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (!isServiceHref(href) || link.dataset.erpDecorated === "1") {
        return;
      }

      var slug = slugFromHref(href);
      var meta = serviceMeta[slug] || {
        icon: "fa-solid fa-circle-nodes",
        desc: "Expert consulting, implementation, and optimization for growth"
      };

      var label = (link.textContent || "").trim();
      link.classList.add("erp-menu-link");
      link.innerHTML =
        '<span class="erp-menu-icon" aria-hidden="true"><i class="' + meta.icon + '"></i></span>' +
        '<span class="erp-menu-copy">' + label + '<small>' + meta.desc + "</small></span>";

      link.dataset.erpDecorated = "1";
      link.dataset.gaCategory = "Navigation";
      link.dataset.gaAction = "Click";
      link.dataset.gaLabel = label;
      link.setAttribute("aria-label", label + ". " + meta.desc);
    });
  }

  function applyCurrentPageAriaOnly() {
    var currentPath = (window.location.pathname || "").toLowerCase();
    document.querySelectorAll("a[href]").forEach(function (link) {
      var href = (link.getAttribute("href") || "").toLowerCase();
      if (!href || href === "#") {
        return;
      }

      if (currentPath.indexOf(href.replace(".html", "")) > -1 || currentPath.indexOf(slugFromHref(href)) > -1) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initFormValidation() {
    var forms = document.querySelectorAll(".erp-validate-form");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          form.classList.add("erp-form-invalid");
        }
      });
    });
  }

  function init() {
    applyMenuRoles();
    setupDesktopAria();
    decorateServiceLinks();
    syncMobileAria();
    applyCurrentPageAriaOnly();
    initFormValidation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
