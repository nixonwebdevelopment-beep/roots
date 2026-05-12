// ── PROGRESS BAR ──
window.addEventListener('scroll', () => {
  const scrolled = document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.height = (scrolled / total * 100) + '%';
});

// ── HAMBURGER MENU ──
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mainNav.classList.remove('open');
    });
  });
}

 // scroll reveal with auto stagger
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      e.target.style.transitionDelay = delay + 'ms';
      e.target.classList.add('visible');
    } else {
      e.target.style.transitionDelay = '0ms';
      e.target.classList.remove('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => {
  const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
  const index = siblings.indexOf(el);
  if (!el.dataset.delay) {
    el.dataset.delay = index * 150;
  }
  observer.observe(el);
});
