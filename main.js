document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector("#menuToggle");
  const nav = document.querySelector("#mainNav");
  const reveals = document.querySelectorAll(".reveal");
  const heroImage = document.querySelector(".hero-bg img");
  const premiumPanels = document.querySelectorAll(".panel-glass, .stats-card, .contact-form-wrap");

  const setHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 18) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.classList.toggle("active", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) {
        nav.classList.remove("open");
        menuToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  if ("IntersectionObserver" in window && reveals.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("reveal-visible"));
  }

  let ticking = false;

  const runPremiumEffects = () => {
    const y = window.scrollY || window.pageYOffset;

    if (heroImage && window.innerWidth > 860) {
      const offset = Math.min(y * 0.06, 28);
      heroImage.style.transform = `scale(1.04) translateY(${offset}px)`;
    }

    premiumPanels.forEach((panel, index) => {
      if (window.innerWidth <= 860) {
        panel.style.transform = "";
        return;
      }

      const rect = panel.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const delta = (center - viewportCenter) * 0.012;
      const limited = Math.max(Math.min(delta, 8), -8);
      panel.style.transform = `translateY(${limited * -0.35}px)`;
    });

    ticking = false;
  };

  const onScrollEffects = () => {
    if (!ticking) {
      window.requestAnimationFrame(runPremiumEffects);
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScrollEffects, { passive: true });
  window.addEventListener("resize", onScrollEffects);
  runPremiumEffects();

  const currentYearTargets = document.querySelectorAll("[data-current-year]");
  currentYearTargets.forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
