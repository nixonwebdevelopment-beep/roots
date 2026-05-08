// Progress bar
window.addEventListener('scroll', () => {
  const scrolled = document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progress-bar').style.height = (scrolled / total * 100) + '%';
});

// Hamburger menu toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  mainNav.classList.toggle('open');
});

// Close menu when a nav link is clicked
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mainNav.classList.remove('open');
  });
});

// Scroll-reveal for cards
const items = document.querySelectorAll('.item');
items.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px)';
  item.style.transition = `opacity 0.7s ${i * 0.15}s ease, transform 0.7s ${i * 0.15}s ease, box-shadow 0.3s ease`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

items.forEach(item => revealObserver.observe(item));

// Scroll-reveal for steps
const steps = document.querySelectorAll('.step');
steps.forEach((step, i) => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(20px)';
  step.style.transition = `opacity 0.6s ${i * 0.12}s ease, transform 0.6s ${i * 0.12}s ease`;
});

const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      stepObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

steps.forEach(step => stepObserver.observe(step));