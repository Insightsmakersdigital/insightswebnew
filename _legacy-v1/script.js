(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- header scroll state ------------------------------------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mobile nav ------------------------------------------------ */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    mobileNav.classList.toggle("open", !open);
  });
  mobileNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("open");
    })
  );

  /* ---- scroll reveal ------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-line");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el, i) => {
      if (el.classList.contains("reveal-line")) {
        el.style.transitionDelay = `${i % 3 * 70}ms`;
      }
      io.observe(el);
    });
  }

  /* ---- count-up numbers ------------------------------------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimal = el.dataset.decimal;
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = decimal !== undefined
        ? `${Math.floor(value)}.${decimal}`
        : Math.round(value).toLocaleString();
      if (t < 1) requestAnimationFrame(frame);
      else {
        el.textContent = decimal !== undefined ? `${target}.${decimal}` : target.toLocaleString();
      }
    }
    requestAnimationFrame(frame);
  }

  const countEls = document.querySelectorAll("[data-count]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    countEls.forEach((el) => {
      const target = el.dataset.count;
      const decimal = el.dataset.decimal;
      el.textContent = decimal !== undefined ? `${target}.${decimal}` : Number(target).toLocaleString();
    });
  } else {
    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    countEls.forEach((el) => countIo.observe(el));
  }

  /* ---- pricing billing toggle ------------------------------------- */
  const billingToggle = document.getElementById("billingToggle");
  const amounts = document.querySelectorAll(".amount");
  billingToggle.addEventListener("click", () => {
    const annual = billingToggle.getAttribute("aria-checked") !== "true";
    billingToggle.setAttribute("aria-checked", String(annual));
    amounts.forEach((el) => {
      const value = annual ? el.dataset.annual : el.dataset.monthly;
      el.textContent = Number(value).toLocaleString();
    });
    document.querySelectorAll(".period").forEach((el) => {
      el.textContent = annual ? "/mo, billed yearly" : "/mo";
    });
  });

  /* ---- FAQ accordion ------------------------------------------- */
  document.querySelectorAll(".faq-question").forEach((btn) => {
    const answer = btn.nextElementSibling;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq-question").forEach((other) => {
        if (other !== btn) {
          other.setAttribute("aria-expanded", "false");
          other.nextElementSibling.style.maxHeight = null;
        }
      });
      btn.setAttribute("aria-expanded", String(!open));
      answer.style.maxHeight = open ? null : `${answer.scrollHeight}px`;
    });
  });

  /* ---- magnetic CTA buttons ------------------------------------------- */
  const glow = document.getElementById("ctaGlow");
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      const strength = 14;
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
        glow.style.opacity = "1";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
        glow.style.opacity = "0";
      });
    });
  }

  /* ---- contact form (front-end only) ------------------------------------------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    status.textContent = "Thanks — we'll be in touch within one business day.";
    form.reset();
  });

  /* ---- back to top ------------------------------------------- */
  document.getElementById("toTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---- year ------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
