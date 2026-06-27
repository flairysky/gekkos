/* ============================================================
   HSG GEKKOS HOCKEY — Main JavaScript
   ============================================================ */

/* ---- Nav scroll + mobile toggle ---- */
(function () {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    const closeBtn = links.querySelector('.nav-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* Active link */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.dataset.page === page) el.classList.add('active');
  });
})();

/* ---- Scroll reveal ---- */
(function () {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
})();

/* ---- Animated counters ---- */
(function () {
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function runCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        runCounter(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => obs.observe(el));
})();

/* ---- Money Rain ---- */
const MoneyRain = window.MoneyRain = (function () {
  const SYMBOLS = ['💵', '💰', '💸', '$', '💵', '$', '💴', '💶', '🤑', '$', '💵'];
  const COLORS  = ['#f0c330', '#29b352', '#f5f5f5', '#d4a017', '#f0c330', '#1d7a3a'];

  function spawn(overlay) {
    const el  = document.createElement('div');
    el.className  = 'money-bill';
    el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    const size     = 1.2 + Math.random() * 1.6;
    const left     = Math.random() * 96 + 2;
    const duration = 2.5 + Math.random() * 4;
    const delay    = Math.random() * 1.5;

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      color: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
    `;

    overlay.appendChild(el);
    setTimeout(() => el.remove(), (duration + delay + 0.5) * 1000);
  }

  return {
    start(count = 60, fast = false) {
      const overlay = document.getElementById('money-rain-overlay');
      if (!overlay) return;
      const interval = fast ? 25 : 70;
      let n = 0;
      const t = setInterval(() => {
        spawn(overlay);
        if (++n >= count) clearInterval(t);
      }, interval);
    }
  };
})();

/* ---- Auto-rain on homepage ---- */
if (document.body.classList.contains('page-home')) {
  window.addEventListener('load', () => {
    setTimeout(() => MoneyRain.start(70), 600);
  });
}

/* ---- Roster tabs ---- */
(function () {
  const tabs  = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.player-card');
  if (!tabs.length) return;

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.pos === filter;
        card.style.display = match ? '' : 'none';
        card.style.opacity = match ? '1' : '0';
      });
    });
  });
})();

/* ---- Calendar filter ---- */
(function () {
  const btns = document.querySelectorAll('.cal-filter-btn');
  const rows = document.querySelectorAll('.cal-row');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      rows.forEach(row => {
        if (filter === 'all') { row.style.display = ''; return; }
        row.style.display = row.dataset.type === filter ? '' : 'none';
      });
    });
  });
})();

/* ---- Join form ---- */
(function () {
  const form    = document.getElementById('join-form');
  const success = document.getElementById('success-msg');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    MoneyRain.start(120, true);

    form.style.transition = 'opacity 0.4s';
    form.style.opacity = '0';
    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        requestAnimationFrame(() => {
          success.style.opacity = '1';
        });
      }
    }, 400);

    setTimeout(() => MoneyRain.start(80, true), 1800);
  });
})();

/* ---- Stagger reveal for grids ---- */
(function () {
  const grids = document.querySelectorAll('.players-grid, .trophies-grid, .news-grid');
  grids.forEach(grid => {
    const children = Array.from(grid.children);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.06}s`;
      child.classList.add('reveal');
    });
  });

  /* re-observe after delay assignment */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.players-grid .reveal, .trophies-grid .reveal, .news-grid .reveal').forEach(el => obs.observe(el));
})();
