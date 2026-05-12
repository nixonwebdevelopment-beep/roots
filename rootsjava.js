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

// ── TIMELINE SCROLL REVEAL (ourstory page) ──
const timelineItems = document.querySelectorAll('.timeline-item');
if (timelineItems.length) {
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 150);
        tlObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  timelineItems.forEach(item => tlObserver.observe(item));
}

// ── REVEAL OBSERVER (NZAscend-compatible) ──
// Watches any element with class="reveal" and adds "visible" when in view.
// Replace this block with the NZAscend version when ready — same class names.
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings slightly if they appear together
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const delay = siblings.indexOf(entry.target) * 100;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));
}

// ── TIME CAPSULE ──
(function() {
  const LAUNCH_DATE = new Date(document.getElementById('tc-launch-date').dataset.date);
  const STORAGE_KEY = 'roots_first_deal';

  const sealedEl   = document.getElementById('tc-sealed-date');
  const daysEl     = document.getElementById('tc-days');
  const envelope   = document.getElementById('tc-envelope');
  const btn        = document.getElementById('tc-open-btn');
  const msg        = document.getElementById('tc-message');

  if (!sealedEl) return; // not on portfolio page

  // Show sealed date
  sealedEl.textContent = LAUNCH_DATE.toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // Count days since launch
  function updateDays() {
    const now = new Date();
    const diff = Math.floor((now - LAUNCH_DATE) / (1000 * 60 * 60 * 24));
    if (daysEl) daysEl.textContent = diff;
  }
  updateDays();

  // Check if already opened
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    openCapsule(JSON.parse(saved), false);
  }

  // Button click
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
    const formatted = openedDate.toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' });

    // Reveal opened date
    const lockedEl = document.querySelector('.tc-locked-val');
    if (lockedEl) {
      lockedEl.textContent = formatted;
      lockedEl.classList.remove('tc-locked-val');
      lockedEl.classList.add('tc-opened-val');
    }

    // Animate days counter
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
