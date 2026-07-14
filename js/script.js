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
  const statusEls = [document.getElementById('heroStatus'), document.getElementById('mapStatus')].filter(Boolean);
  if (statusEls.length) {
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

      statusEls.forEach(el => {
        el.classList.toggle('open', open);
        el.classList.toggle('closed', !open);
        const statusText = el.querySelector('.status-text');
        if (statusText) statusText.textContent = open ? 'Abierto ahora' : 'Cerrado ahora';
      });
    };
    updateStatus();
    setInterval(updateStatus, 60000);
  }

  /* ---------- Reviews carousel ---------- */
  const reviewsTrack = document.getElementById('reviewsTrack');
  if (reviewsTrack) {
    const cards = Array.from(reviewsTrack.children);
    const dotsWrap = document.getElementById('reviewsDots');
    const prevBtn = document.getElementById('reviewsPrev');
    const nextBtn = document.getElementById('reviewsNext');
    let index = 0;
    let timer = null;

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir a la reseña ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      reviewsTrack.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + cards.length) % cards.length;
      render();
      restartAutoplay();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function restartAutoplay() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    const carousel = document.querySelector('.reviews-carousel');
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', restartAutoplay);

    render();
    restartAutoplay();
  }

  /* ---------- Venue carousel ---------- */
  const venueTrack = document.getElementById('venueTrack');
  if (venueTrack) {
    const slides = Array.from(venueTrack.children);
    const dotsWrap = document.getElementById('venueDots');
    const prevBtn = document.getElementById('venuePrev');
    const nextBtn = document.getElementById('venueNext');
    let index = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      venueTrack.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      restartAutoplay();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function restartAutoplay() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, 5000);
    }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    const carousel = document.querySelector('.venue-carousel');
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', restartAutoplay);

    render();
    restartAutoplay();
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
