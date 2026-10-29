(() => {
  const root = document.querySelector("[data-diwali-sale]");
  if (!root || root.dataset.bound === "true") return;
  root.dataset.bound = "true";

  const end = new Date(root.dataset.saleEnd).getTime();
  const phase = root.querySelector("[data-diwali-phase]");
  const closingCopy = root.querySelector("[data-diwali-closing-copy]");
  const sticky = root.querySelector("[data-diwali-sticky]");
  const fields = {
    days: root.querySelector("[data-countdown-days]"),
    hours: root.querySelector("[data-countdown-hours]"),
    minutes: root.querySelector("[data-countdown-minutes]"),
    seconds: root.querySelector("[data-countdown-seconds]"),
  };

  const finalWeek = new Date("2026-11-09T00:00:00+05:30").getTime();
  const finalFortyEight = new Date("2026-11-14T00:00:00+05:30").getTime();
  const finalDay = new Date("2026-11-15T00:00:00+05:30").getTime();

  const pad = (value) => String(value).padStart(2, "0");

  const setPhase = (now) => {
    if (now >= end) {
      phase.textContent = "The Diwali Sale has ended";
      closingCopy.textContent = "The Diwali Sale has ended. Explore the current N2D collection.";
      root.classList.add("is-ended");
      sticky?.remove();
      return;
    }

    if (now >= finalDay) {
      phase.textContent = "Ends tonight";
      closingCopy.textContent = "Final day. The Diwali Sale ends tonight.";
    } else if (now >= finalFortyEight) {
      phase.textContent = "Final 48 hours";
      closingCopy.textContent = "Final 48 hours. The Diwali Sale ends November 15.";
    } else if (now >= finalWeek) {
      phase.textContent = "Final week";
      closingCopy.textContent = "Final week. The Diwali Sale ends November 15.";
    } else {
      phase.textContent = "Sale ends November 15";
      closingCopy.textContent = "Diwali Sale ends November 15.";
    }
  };

  const tick = () => {
    const now = Date.now();
    const remaining = Math.max(0, end - now);
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    fields.days.textContent = pad(days);
    fields.hours.textContent = pad(hours);
    fields.minutes.textContent = pad(minutes);
    fields.seconds.textContent = pad(seconds);
    setPhase(now);

    if (remaining === 0) window.clearInterval(timer);
  };

  const timer = window.setInterval(tick, 1000);
  tick();

  if (sticky) {
    const hero = root.querySelector(".diwali-hero");
    let heroVisible = false;
    const updateFireworks = () => {
      hero.classList.toggle(
        "is-fireworks-active",
        heroVisible && !document.hidden,
      );
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        sticky.classList.toggle("is-visible", !heroVisible);
        updateFireworks();
      },
      { threshold: 0.16 },
    );
    observer.observe(hero);
    document.addEventListener("visibilitychange", updateFireworks);
  }

  const carousel = root.querySelector("[data-diwali-carousel]");
  if (carousel) {
    const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
    const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
    const previous = carousel.querySelector("[data-carousel-previous]");
    const next = carousel.querySelector("[data-carousel-next]");
    const toggle = carousel.querySelector("[data-carousel-toggle]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = 0;
    let autoplayTimer;
    let userPaused = reducedMotion.matches;

    const showSlide = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === active;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
        slide.tabIndex = isActive ? 0 : -1;
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === active;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", String(isActive));
        dot.tabIndex = isActive ? 0 : -1;
      });
    };

    const stopAutoplay = () => {
      window.clearInterval(autoplayTimer);
      autoplayTimer = undefined;
    };

    const updateToggle = () => {
      if (!toggle) return;
      toggle.classList.toggle("is-paused", userPaused);
      toggle.setAttribute(
        "aria-label",
        userPaused ? "Play automatic carousel" : "Pause automatic carousel",
      );
    };

    const startAutoplay = () => {
      stopAutoplay();
      updateToggle();
      if (userPaused || document.hidden || slides.length < 2) return;
      autoplayTimer = window.setInterval(() => showSlide(active + 1), 5500);
    };

    const showManualSlide = (index) => {
      showSlide(index);
      startAutoplay();
    };

    previous?.addEventListener("click", () => showManualSlide(active - 1));
    next?.addEventListener("click", () => showManualSlide(active + 1));
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showManualSlide(index));
    });
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showManualSlide(active - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showManualSlide(active + 1);
      }
    });
    toggle?.addEventListener("click", () => {
      userPaused = !userPaused;
      startAutoplay();
    });
    document.addEventListener("visibilitychange", startAutoplay);
    reducedMotion.addEventListener("change", (event) => {
      userPaused = event.matches;
      startAutoplay();
    });

    showSlide(0);
    startAutoplay();
  }
})();
