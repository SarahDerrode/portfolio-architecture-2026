/* =====================================================
   Portfolio Sarah Derrode — interactions légères
   ===================================================== */

// Surligner dans la nav la section en cours de lecture
(function() {
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(links)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      links.forEach(l => {
        const active = l.getAttribute('href') === id;
        l.classList.toggle('is-active', active);
        if (active) {
          l.setAttribute('aria-current', 'location');
          // Mobile : garder le lien actif visible dans la nav défilante
          const nav = l.closest('.nav-links');
          if (nav.scrollWidth > nav.clientWidth) {
            nav.scrollTo({ left: l.offsetLeft - nav.clientWidth / 3, behavior: 'smooth' });
          }
        } else {
          l.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// Ouvrir les grandes images dans une lightbox (dialogue modal accessible)
(function() {
  const pageLinks = Array.from(document.querySelectorAll('.page-link'));
  if (pageLinks.length === 0) return;

  // Créer la lightbox une seule fois
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Visionneuse des pages du portfolio');
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Fermer">&times;</button>
    <button class="lightbox-prev" type="button" aria-label="Page précédente">&lsaquo;</button>
    <button class="lightbox-next" type="button" aria-label="Page suivante">&rsaquo;</button>
    <img alt="" />
    <p class="lightbox-caption" aria-live="polite"><span class="lightbox-text"></span><span class="lightbox-counter"></span></p>
  `;
  document.body.appendChild(lightbox);

  const img = lightbox.querySelector('img');
  const caption = lightbox.querySelector('.lightbox-text');
  const counter = lightbox.querySelector('.lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const buttons = [closeBtn, prevBtn, nextBtn];

  const items = pageLinks.map(a => ({
    url: a.getAttribute('href'),
    alt: (a.querySelector('img') || {}).alt || ''
  }));
  let currentIndex = 0;
  let opener = null;

  // Rendre le reste de la page inerte pendant l'ouverture (focus et lecteurs d'écran)
  function setPageInert(on) {
    Array.from(document.body.children).forEach(el => {
      if (el !== lightbox && el.tagName !== 'SCRIPT') el.inert = on;
    });
  }

  function preload(index) {
    const i = (index + items.length) % items.length;
    new Image().src = items[i].url;
  }

  function show(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    img.src = item.url;
    img.alt = item.alt;
    caption.textContent = item.alt;
    counter.textContent = (currentIndex + 1) + ' / ' + items.length;
    preload(currentIndex + 1);
    preload(currentIndex - 1);
  }
  function open(index) {
    opener = document.activeElement;
    show(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    setPageInert(true);
    closeBtn.focus();
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setPageInert(false);
    if (opener) opener.focus();
    // reset src to let browser release memory
    setTimeout(() => { img.removeAttribute('src'); }, 200);
  }
  function next() { show(currentIndex + 1); }
  function prev() { show(currentIndex - 1); }

  pageLinks.forEach((a, i) => {
    a.addEventListener('click', (e) => {
      // Ctrl/Cmd-clic : laisser le navigateur ouvrir l'image dans un onglet
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      open(i);
    });
  });
  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'Tab') {
      // Garder le focus dans la lightbox
      const i = buttons.indexOf(document.activeElement);
      const step = e.shiftKey ? -1 : 1;
      e.preventDefault();
      buttons[(i + step + buttons.length) % buttons.length].focus();
    }
  });

  // Balayage horizontal à un doigt sur mobile (le pincement reste libre pour zoomer)
  let touchX = null, touchY = null;
  lightbox.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) { touchX = null; return; }
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    // Ignorer si la page est zoomée : le geste sert alors à se déplacer
    if (window.visualViewport && window.visualViewport.scale > 1.05) return;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });
})();
