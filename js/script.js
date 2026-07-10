/* =============================================================
   LA FORUM RG — Script
============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('hidden'), 300);
  });
  if (document.readyState === 'complete') {
    setTimeout(() => preloader && preloader.classList.add('hidden'), 300);
  }

  /* ---------- Sticky header ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const closeNav = () => {
    navToggle.classList.remove('open');
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(section => spyObserver.observe(section));

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item, i) => {
    item.style.transitionDelay = `${(i % 3) * 0.12}s`;
    revealObserver.observe(item);
  });

  /* ---------- Abierto / cerrado ahora ----------
     Horario: Lun-Vie 10:00-14:00 y 16:00-20:00 · Sáb 10:00-15:00 · Dom cerrado */
  const statusEl = document.getElementById('heroStatus');
  if (statusEl) {
    const statusText = statusEl.querySelector('.status-text');
    const updateStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 Dom ... 6 Sáb
      const mins = now.getHours() * 60 + now.getMinutes();
      let open = false;

      if (day >= 1 && day <= 5) {
        open = (mins >= 600 && mins < 840) || (mins >= 960 && mins < 1200);
      } else if (day === 6) {
        open = mins >= 600 && mins < 900;
      }

      statusEl.classList.toggle('open', open);
      statusEl.classList.toggle('closed', !open);
      if (statusText) statusText.textContent = open ? 'Abierto ahora' : 'Cerrado ahora';
    };
    updateStatus();
    setInterval(updateStatus, 60000);
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
