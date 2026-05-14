// O-Zone — shared interactive behavior
(() => {
  // Mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Scroll-reveal: fade-in elements as they enter the viewport.
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  // Active nav link highlight based on filename
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    if (a.getAttribute('href') === here) a.classList.add('active');
  });

  // Lightbox: clicking any [data-lightbox] anchor opens its href image fullscreen.
  // Click anywhere (including the image) or press Esc to close — "one click to
  // zoom, one click to zoom out". Overlay DOM is created lazily on first use.
  let lb = null;
  function lbCreate() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<img class="lightbox-img" alt="">';
    document.body.appendChild(lb);
    lb.addEventListener('click', lbClose);
  }
  function lbOpen(src, alt) {
    lbCreate();
    const img = lb.querySelector('.lightbox-img');
    img.src = src;
    img.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function lbClose() {
    if (!lb || !lb.classList.contains('open')) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
    // Free the large image after the fade-out completes so memory isn't held.
    setTimeout(() => { const img = lb.querySelector('.lightbox-img'); if (img) img.src = ''; }, 320);
  }
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-lightbox]');
    if (!link) return;
    e.preventDefault();
    const inner = link.querySelector('img');
    lbOpen(link.href, inner ? inner.alt : '');
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lbClose(); });
})();
