document.addEventListener('DOMContentLoaded', function () {
  // Footer year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Active nav link. Service pages sit at the top level rather than under
  // their section, so each one names the nav item it belongs to.
  const SECTION = {
    '/superintendents-representative': '/delivering-in-the-kimberley',
    '/local-content':                  '/delivering-in-the-kimberley',
    '/supply-chain':                   '/delivering-in-the-kimberley',
    '/contract-administration':        '/delivering-in-the-kimberley',
    '/fractional-commercial-manager':  '/kimberley-business',
    '/business-support':               '/kimberley-business',
    '/business-capability':            '/kimberley-business'
  };

  const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const target = SECTION[path] || path;

  document.querySelectorAll('.nav-links a').forEach(function (a) {
    const href = a.getAttribute('href').replace(/\.html$/, '').replace(/\/$/, '') || '/';
    if (href === target) a.classList.add('active');
  });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Smooth scroll for same-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
