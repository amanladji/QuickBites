/**
 * QuickBite — Scroll Animations
 * ─────────────────────────────────────────────────────────────
 * Architecture  : Intersection Observer + CSS class toggling
 * Philosophy    : JS adds ONE class. CSS does ALL the visual work.
 * Style         : Google / Stripe / Vercel — clean, no bounce, no flash
 * Dependencies  : None
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── 0. RESPECT USER PREFERENCE ───────────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;


  /* ── 1. CONFIGURATION ─────────────────────────────────────── */
  const CFG = {
    duration     : 650,    // ms  — how long each animation plays
    stagger      : 90,     // ms  — delay gap between staggered children
    easing       : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // easeOutQuart
    threshold    : 0.1,    // 10% of element must be visible to trigger
    rootMargin   : '0px 0px -52px 0px', // fire 52px before reaching viewport bottom
    countDuration: 1800,   // ms  — duration of count-up numbers
  };


  /* ── 2. INJECT ANIMATION CSS ──────────────────────────────── */
  /*
   * Base hidden state is already in style.css (.qb class).
   * Here we inject the transition so it only applies when JS runs.
   * This avoids a flash of invisible content if JS is slow or disabled.
   */
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .qb {
        opacity: 0;
        will-change: opacity, transform;
        transition:
          opacity   ${CFG.duration}ms ${CFG.easing},
          transform ${CFG.duration}ms ${CFG.easing};
      }
      .qb.on {
        opacity: 1 !important;
        transform: none !important;
      }
    </style>
  `);


  /* ── 3. UTILITY HELPERS ───────────────────────────────────── */

  /** Tag an element with animation class + optional stagger delay */
  function prep(el, type, delay = 0) {
    if (!el) return;
    el.classList.add('qb', type);
    if (delay > 0) el.style.transitionDelay = delay + 'ms';
  }

  /** Mark element as visible (removes hidden state) */
  function reveal(el) {
    if (!el) return;
    el.classList.add('on');
  }

  /** Shorthand — querySelector */
  function $(sel, ctx = document) { return ctx.querySelector(sel); }

  /** Shorthand — querySelectorAll → Array */
  function $$(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }


  /* ── 4. MAIN INTERSECTION OBSERVER ───────────────────────── */
  /*
   * One shared observer for all single-element fade-ins.
   * Unobserves after firing so each element animates only once.
   */
  const mainObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        mainObserver.unobserve(entry.target);
      });
    },
    { threshold: CFG.threshold, rootMargin: CFG.rootMargin }
  );

  function watch(el) {
    if (el) mainObserver.observe(el);
  }


  /* ── 5. SECTION HEADERS — FADE UP ────────────────────────── */
  $$('.section-title, .section-subtitle').forEach((el, i) => {
    prep(el, 'up', i % 2 === 0 ? 0 : 80);
    watch(el);
  });


  /* ── 6. HERO — SLIDE FROM LEFT ────────────────────────────── */
  const heroContent = $('.hero-content');
  if (heroContent) { prep(heroContent, 'left'); watch(heroContent); }

  const heroVisualObs = $('.hero-visual');
  if (heroVisualObs) { prep(heroVisualObs, 'right'); watch(heroVisualObs); }


  /* ── 7. CATEGORY + AREA CHIPS — FADE UP ─────────────────── */
  $$('.category-chip, .area-chip').forEach((el, i) => {
    prep(el, 'up', i * 30);
    watch(el);
  });


  /* ── 8. OFFER CARDS — STAGGER POP ───────────────────────── */
  $$('.offer-card').forEach((card, i) => {
    prep(card, 'pop', i * 80);
    watch(card);
  });


  /* ── 9. RESTAURANT CARDS — STAGGER UP ───────────────────── */
  $$('.restaurant-card').forEach((card, i) => {
    prep(card, 'up', i * 80);
    watch(card);
  });


  /* ── 10. FOOD CARDS — ALTERNATE LEFT/RIGHT ───────────────── */
  $$('.food-card').forEach((card, i) => {
    prep(card, i % 2 === 0 ? 'left' : 'right', i * 60);
    watch(card);
  });


  /* ── 11. STEP CARDS — STAGGER UP ─────────────────────────── */
  $$('.step-card').forEach((card, i) => {
    prep(card, 'up', i * 100);
    watch(card);
  });


  /* ── 12. STAT CARDS — STAGGER POP ───────────────────────── */
  $$('.stat-card').forEach((card, i) => {
    prep(card, 'pop', i * 80);
    watch(card);
  });


  /* ── 12b. STAT COUNT-UP NUMBERS ──────────────────────────── */
  /*
   * For each [data-count-to] element, animate the number from 0
   * to its target when it enters the viewport.
   */
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        animateCount(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  function animateCount(el) {
    const to     = parseInt(el.dataset.countTo, 10);
    const suffix = el.dataset.countSuffix || '';
    const fmt    = el.dataset.countFormat  || '';
    const start  = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / CFG.countDuration, 1);
      // easeOutQuart
      const eased    = 1 - Math.pow(1 - progress, 4);
      const current  = Math.round(eased * to);

      el.textContent = fmt === 'comma'
        ? current.toLocaleString('en-IN') + suffix
        : current + suffix;

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  $$('[data-count-to]').forEach(el => countObserver.observe(el));


  /* ── 13. NIGHT CARDS — STAGGER UP ───────────────────────── */
  $$('.night-card').forEach((card, i) => {
    prep(card, 'up', i * 90);
    watch(card);
  });


  /* ── 14. TRUST CARDS — STAGGER POP ──────────────────────── */
  $$('.trust-card').forEach((card, i) => {
    prep(card, 'pop', i * 70);
    watch(card);
  });


  /* ── 15. TESTIMONIAL CARDS — STAGGER UP ─────────────────── */
  $$('.testimonial-card').forEach((card, i) => {
    prep(card, 'up', i * 90);
    watch(card);
  });


  /* ── 16. BLOG CARDS — STAGGER UP ────────────────────────── */
  $$('.blog-card').forEach((card, i) => {
    prep(card, 'up', i * 80);
    watch(card);
  });


  /* ── 17. PARTNER CARDS — ALTERNATE ──────────────────────── */
  $$('.partner-card').forEach((card, i) => {
    prep(card, i === 0 ? 'left' : 'right', i * 80);
    watch(card);
  });


  /* ── 18. DATA TABLE — FADE UP ────────────────────────────── */
  $$('.data-table').forEach(el => {
    prep(el, 'up');
    watch(el);
  });


  /* ── 19. REFERRAL STRIP — FADE UP ───────────────────────── */
  const referralStrip = $('.referral-strip');
  if (referralStrip) { prep(referralStrip, 'up', 120); watch(referralStrip); }


  /* ── 20. FAQ ITEMS — STAGGER UP ─────────────────────────── */
  $$('.faq-item').forEach((item, i) => {
    prep(item, 'up', i * 50);
    watch(item);
  });


  /* ── 21. LOYALTY STRIP — SCALE POP ──────────────────────── */
  const loyaltyStrip = $('.loyalty-strip');
  if (loyaltyStrip) { prep(loyaltyStrip, 'pop'); watch(loyaltyStrip); }


  /* ── 22. APP SECTION ─────────────────────────────────────── */
  const appContent = $('.app-content');
  const appVisual  = $('.app-visual');
  if (appContent) { prep(appContent, 'left'); watch(appContent); }
  if (appVisual)  { prep(appVisual,  'right'); watch(appVisual); }


  /* ── 23. NEWSLETTER + CONTACT STRIP ────────────────────── */
  const newsletterInner = $('.newsletter-inner');
  if (newsletterInner) { prep(newsletterInner, 'up'); watch(newsletterInner); }

  $$('.contact-item').forEach((item, i) => {
    prep(item, 'up', i * 80);
    watch(item);
  });


  /* ── 24. SITE HEADER — DROPS IN FROM ABOVE ──────────────── */
  /*
   * On page load, the header and announcement bar slide down
   * from off-screen. This feels premium without being distracting.
   */
  const easing = CFG.easing;

  function slideDown(selector, delay) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.cssText +=
      `transform: translateY(-110%);
       transition: transform 0.55s ${easing};`;
    setTimeout(() => { el.style.transform = 'translateY(0)'; }, delay);
  }

  slideDown('.announcement-bar', 80);
  slideDown('.site-header',      200);


  /* ── 13. HERO CONTENT LOADS IN ────────────────────────────── */
  /* Hero children animate in sequentially on page load */

  const heroContent2 = document.querySelector('.hero-content');
  if (heroContent2) {
    Array.from(heroContent2.children).forEach((child, i) => {
      child.style.cssText +=
        `opacity: 0;
         transform: translateY(22px);
         transition: opacity 0.65s ${easing} ${320 + i * 110}ms,
                     transform 0.65s ${easing} ${320 + i * 110}ms;`;
      /* Next frame — let browser register the start state first */
      requestAnimationFrame(() => requestAnimationFrame(() => {
        child.style.opacity   = '1';
        child.style.transform = 'none';
      }));
    });
  }

  /* Hero visual slides in from right on load */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.style.cssText +=
      `opacity: 0;
       transform: translateX(40px);
       transition: opacity 0.75s ${easing} 500ms,
                   transform 0.75s ${easing} 500ms;`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      heroVisual.style.opacity   = '1';
      heroVisual.style.transform = 'none';
    }));
  }

})();
