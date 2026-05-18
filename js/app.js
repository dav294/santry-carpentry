/* ============================================================
   SANTRY CARPENTRY — APP.JS
   GSAP + ScrollTrigger + Lenis
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── GSAP Plugin ──
  gsap.registerPlugin(ScrollTrigger);

  // ── Lenis smooth scroll ──
  const lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // ── Nav scroll state ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 55);
  }, { passive: true });

  // ── Hamburger / Mobile menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));

  // ── Hero entrance (no ScrollTrigger — plays on load) ──
  const heroTl = gsap.timeline({ delay: 0.25 });
  heroTl
    .to('.hero-eyebrow',  { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' })
    .to('.hero-line',     { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out' }, '-=0.35')
    .to('.hero-sub',      { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out' }, '-=0.35')
    .to('.hero-ctas',     { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.25');

  // ── Helper: basic fade-up ──
  function fadeUp(target, trigger, opts = {}) {
    gsap.from(target, {
      scrollTrigger: { trigger, start: 'top 78%', ...opts.st },
      opacity: 0,
      y: opts.y ?? 44,
      duration: opts.dur ?? 0.75,
      stagger: opts.stagger,
      ease: 'power3.out',
      ...opts.extra,
    });
  }

  // ── Problem section ──
  gsap.from('.problem-left', {
    scrollTrigger: { trigger: '#problem', start: 'top 78%' },
    opacity: 0, x: -52, duration: 0.85, ease: 'power3.out',
  });
  fadeUp('.pain-point', '#problem', { y: 36, stagger: 0.14 });

  // ── Solution section ──
  gsap.from('.solution-wrap > :not(.pillars)', {
    scrollTrigger: { trigger: '#solution', start: 'top 78%' },
    opacity: 0, y: 36, duration: 0.75, stagger: 0.1, ease: 'power3.out',
  });
  fadeUp('.pillar', '.pillars', { y: 52, stagger: 0.15 });

  // ── Services ──
  fadeUp('.section-header', '#services', { y: 28 });
  gsap.from('.service-card', {
    scrollTrigger: { trigger: '.services-grid', start: 'top 82%' },
    opacity: 0, y: 60, duration: 0.65, stagger: { amount: 0.55, from: 'start' }, ease: 'power3.out',
  });

  // ── Stats count-up ──
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    ScrollTrigger.create({
      trigger: '#stats',
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          innerText: target,
          duration: 2.0,
          ease: 'power1.out',
          snap: { innerText: 1 },
        });
      },
    });
  });
  gsap.from('.stat-item', {
    scrollTrigger: { trigger: '#stats', start: 'top 80%' },
    opacity: 0, scale: 0.82, duration: 0.62, stagger: 0.1, ease: 'back.out(1.6)',
  });

  // ── About ──
  gsap.from('.about-img-col', {
    scrollTrigger: { trigger: '#about', start: 'top 78%' },
    opacity: 0, x: -60, duration: 0.95, ease: 'power3.out',
  });
  gsap.from('.about-text-col > *', {
    scrollTrigger: { trigger: '#about', start: 'top 72%' },
    opacity: 0, y: 32, duration: 0.7, stagger: 0.09, ease: 'power3.out',
  });

  // ── Process ──
  gsap.from('.process-step, .process-line', {
    scrollTrigger: { trigger: '#process', start: 'top 78%' },
    opacity: 0, x: -32, duration: 0.6, stagger: 0.11, ease: 'power3.out',
  });

  // ── Testimonials ──
  gsap.from('.t-card', {
    scrollTrigger: { trigger: '#testimonials', start: 'top 82%' },
    opacity: 0, y: 48, rotation: 1.5, duration: 0.7, stagger: 0.16, ease: 'power3.out',
  });

  // ── Contact ──
  gsap.from('.contact-left > *', {
    scrollTrigger: { trigger: '#contact', start: 'top 78%' },
    opacity: 0, x: -44, duration: 0.8, stagger: 0.09, ease: 'power3.out',
  });
  gsap.from('.contact-right', {
    scrollTrigger: { trigger: '#contact', start: 'top 78%' },
    opacity: 0, x: 44, duration: 0.8, ease: 'power3.out',
  });

  // ── Footer brand ──
  fadeUp('.footer-brand, .footer-col', '#footer', { stagger: 0.1, y: 28 });

  // ── Smooth anchor clicks (hand-off to Lenis) ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70, duration: 1.4 });
      }
    });
  });

  // ── Form submit (placeholder handler) ──
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-primary');
      const original = btn.textContent;
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#3A7D44';
      form.querySelectorAll('input, textarea, select').forEach(el => (el.disabled = true));
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        form.querySelectorAll('input, textarea, select').forEach(el => (el.disabled = false));
        form.reset();
      }, 3500);
    });
  }

});
