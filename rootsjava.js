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
