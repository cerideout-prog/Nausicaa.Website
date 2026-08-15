document.addEventListener('DOMContentLoaded', function () {
  // Footer year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Active nav link (by pathname)
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path || (href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });

  // Smooth scroll for same-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
