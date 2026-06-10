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

// ── ANIMATIONS (called after loader finishes) ──
function startAnimations() {

  // Scroll-reveal for .item elements
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

  // Scroll-reveal for .step elements
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

  // Timeline reveal
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length) {
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 150);
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    timelineItems.forEach(item => tlObserver.observe(item));
  }

  // Reveal observer for .reveal elements
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
          const delay = siblings.indexOf(entry.target) * 100;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObs.observe(el));
  }
}

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');

  if (!loader) {
    startAnimations();
    return;
  }

  if (sessionStorage.getItem('visited')) {
    // Returning visitor — quick flash
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(startAnimations, 100);
    }, 200);
  } else {
    // First visit — full loader
    sessionStorage.setItem('visited', 'true');
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(startAnimations, 100);
    }, 1300);
  }
});

// ── TIME CAPSULE ──
(function () {
  const launchEl = document.getElementById('tc-launch-date');
  if (!launchEl) return;

  const LAUNCH_DATE = new Date(launchEl.dataset.date);
  const STORAGE_KEY = 'roots_first_deal';

  const sealedEl = document.getElementById('tc-sealed-date');
  const daysEl   = document.getElementById('tc-days');
  const envelope = document.getElementById('tc-envelope');
  const btn      = document.getElementById('tc-open-btn');

  if (sealedEl) {
    sealedEl.textContent = LAUNCH_DATE.toLocaleDateString('en-NZ', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  function updateDays() {
    if (!daysEl) return;
    const diff = Math.floor((new Date() - LAUNCH_DATE) / (1000 * 60 * 60 * 24));
    daysEl.textContent = diff;
  }
  updateDays();

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) openCapsule(JSON.parse(saved), false);

  if (btn) {
    btn.addEventListener('click', () => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const openedDate = new Date();
      const data = {
        date: openedDate.toISOString(),
        days: Math.floor((openedDate - LAUNCH_DATE) / (1000 * 60 * 60 * 24))
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      openCapsule(data, true);
    });
  }

  function openCapsule(data, animate) {
    const openedDate = new Date(data.date);
    const formatted = openedDate.toLocaleDateString('en-NZ', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const lockedEl = document.querySelector('.tc-locked-val');
    if (lockedEl) {
      lockedEl.textContent = formatted;
      lockedEl.classList.remove('tc-locked-val');
      lockedEl.classList.add('tc-opened-val');
    }

    if (daysEl) {
      daysEl.textContent = data.days;
      daysEl.classList.add('unlocked');
    }

    const delay = animate ? 400 : 0;
    setTimeout(() => {
      if (envelope) envelope.classList.add('open');
      if (btn) {
        btn.textContent = '🔓 First Deal — Done.';
        btn.classList.add('opened');
      }
    }, delay);
  }
})();
