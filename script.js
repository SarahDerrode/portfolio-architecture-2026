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
      const id = '#' + entry.target.id;
      const link = document.querySelector('.nav-links a[href="' + id + '"]');
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.style.color = '');
        link.style.color = 'var(--ink)';
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// Ouvrir les grandes images dans une lightbox simple
(function() {
  const pageLinks = document.querySelectorAll('.page-link');
  if (pageLinks.length === 0) return;

  // Créer la lightbox une seule fois
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Fermer">&times;</button>
    <button class="lightbox-prev" aria-label="Précédent">&lsaquo;</button>
    <button class="lightbox-next" aria-label="Suivant">&rsaquo;</button>
    <img alt="" />
  `;
  document.body.appendChild(lightbox);

  const img = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  const urls = Array.from(pageLinks).map(a => a.getAttribute('href'));
  let currentIndex = 0;

  function open(index) {
    currentIndex = index;
    img.src = urls[index];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // reset src to let browser release memory
    setTimeout(() => { img.src = ''; }, 200);
  }
  function next() { open((currentIndex + 1) % urls.length); }
  function prev() { open((currentIndex - 1 + urls.length) % urls.length); }

  pageLinks.forEach((a, i) => {
    a.addEventListener('click', (e) => {
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
  });

  // Styles injectés pour la lightbox
  const style = document.createElement('style');
  style.textContent = `
    .lightbox {
      position: fixed; inset: 0;
      background: rgba(10, 10, 10, 0.94);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 2rem;
    }
    .lightbox.open { display: flex; }
    .lightbox img {
      max-width: min(1200px, 95%);
      max-height: 92vh;
      object-fit: contain;
      background: #fff;
      box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    }
    .lightbox button {
      position: absolute;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.35);
      color: #fff;
      width: 48px; height: 48px;
      font-size: 1.6rem;
      cursor: pointer;
      font-family: "Cormorant Garamond", serif;
      transition: background 0.2s, border-color 0.2s;
      display: flex; align-items: center; justify-content: center;
      line-height: 1;
    }
    .lightbox button:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.6);
    }
    .lightbox-close { top: 1.5rem; right: 1.5rem; font-size: 1.8rem; }
    .lightbox-prev { left: 1.5rem; top: 50%; transform: translateY(-50%); }
    .lightbox-next { right: 1.5rem; top: 50%; transform: translateY(-50%); }
    @media (max-width: 640px) {
      .lightbox-prev, .lightbox-next { width: 40px; height: 40px; font-size: 1.3rem; }
      .lightbox-prev { left: 0.6rem; }
      .lightbox-next { right: 0.6rem; }
      .lightbox-close { top: 0.8rem; right: 0.8rem; }
    }
  `;
  document.head.appendChild(style);
})();
