document.addEventListener('DOMContentLoaded', function () {
  // Footer year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Active nav link. The nav carries five section items; the pages beneath a
  // section sit at the top level rather than under it, so each one names the
  // nav item it belongs to. Any page rename, merge or deletion must update
  // this map (plan §2.1 rule 3).
  const SECTION = {
    // Who We Work With
    '/entering-the-kimberley':         '/who-we-work-with',
    '/kimberley-business':             '/who-we-work-with',
    '/principals-and-asset-owners':    '/who-we-work-with',
    // What We Do
    '/superintendents-representative': '/what-we-do',
    '/fractional-commercial-manager':  '/what-we-do',
    '/tendering-and-estimating':       '/what-we-do',
    '/local-supply-chain':             '/what-we-do',
    // How to Engage
    '/calculator':                     '/how-to-engage'
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
