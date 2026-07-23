/* ═══════════════════════════════════════════
   Ariana & James Wedding — Router & Nav
   ═══════════════════════════════════════════

   Hash-based SPA router.
   URLs: /#/schedule, /#/travel, /#/registry,
         /#/story, /#/todo, /#/faqs
   Default (/ or /#/) → home

   Each "page" is a <section data-route="name">
   inside index.html, loaded via fetch from pages/.
   ═══════════════════════════════════════════ */

const ROUTES = {
  ''        : { file: 'pages/home.html',     title: 'Home',         dark: false },
  'home'    : { file: 'pages/home.html',     title: 'Home',         dark: false },
  'schedule': { file: 'pages/schedule.html', title: 'Schedule',     dark: true  },
  'travel'  : { file: 'pages/travel.html',   title: 'Travel',       dark: true  },
  // 'registry': { file: 'pages/registry.html', title: 'Registry',     dark: true  },
  'story'   : { file: 'pages/story.html',    title: 'Our Story',    dark: true  },
  'todo'    : { file: 'pages/todo.html',     title: 'Things to Do', dark: true  },
  'faqs'    : { file: 'pages/faqs.html',     title: 'FAQs',         dark: true  },
};

const pageCache = {};
const mainEl    = () => document.getElementById('main-content');

// ─── NAVIGATE ───────────────────────────────
async function navigate(route) {
  if (!window.__siteUnlocked) return;
  route = (route || '').replace(/^\//, '');
  if (!(route in ROUTES)) route = '';

  const config = ROUTES[route];

  // Load HTML (from cache or fetch)
  let html = pageCache[route];
  if (!html) {
    try {
      const res = await fetch(config.file);
      if (!res.ok) throw new Error(res.status);
      html = await res.text();
      pageCache[route] = html;
    } catch (e) {
      html = `<div class="content-wrap"><p style="color:var(--mid)">Page not found.</p></div>`;
    }
  }

  // Inject & animate
  const el = mainEl();
  el.innerHTML = html;
  el.classList.remove('page-fade');
  void el.offsetWidth; // reflow
  el.classList.add('page-fade');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Document title
  document.title = config.title === 'Home'
    ? 'Ariana & James — June 5, 2027'
    : `${config.title} · Ariana & James`;

  // Nav appearance
  updateNav(route, config.dark);

  // Run any page-specific init
  if (typeof window.__pageInit === 'function') {
    window.__pageInit();
    window.__pageInit = null;
  }

  // Run page module inits
  if (route === '' || route === 'home') initHome();
  if (route === 'faqs') initFaqs();
  if (route === 'story') initStory();
}

// ─── NAV STATE ──────────────────────────────
function updateNav(route, isDark) {
  const nav    = document.getElementById('mainNav');
  const logo   = document.querySelector('.nav-logo');
  const links  = document.querySelectorAll('.nav-links a');
  const burger = document.querySelector('.hamburger');

  // Active link
  links.forEach(a => {
    const r = a.dataset.route;
    a.classList.toggle('active', r === route || (route === '' && r === 'home'));
  });

  if (isDark) {
    // Inner pages: always show solid nav
    nav.classList.add('scrolled');
    logo.classList.add('dark');
    burger && burger.classList.add('dark');
    links.forEach(a => a.classList.add('dark-link'));
    // Remove scroll listener
    window.removeEventListener('scroll', onHomeScroll);
  } else {
    // Home: transparent until scroll
    nav.classList.remove('scrolled');
    logo.classList.remove('dark');
    burger && burger.classList.remove('dark');
    links.forEach(a => a.classList.remove('dark-link'));
    window.addEventListener('scroll', onHomeScroll, { passive: true });
    onHomeScroll();
  }
}

function onHomeScroll() {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

// ─── HASH ROUTER ────────────────────────────
function getRoute() {
  const hash = window.location.hash; // e.g. "#/schedule"
  return hash.replace(/^#\/?/, '');
}

window.addEventListener('hashchange', () => navigate(getRoute()));

// ─── NAV CLICK HELPERS ──────────────────────
window.goTo = function(route) {
  window.location.hash = route ? `/${route}` : '/';
  document.getElementById('mobileMenu').classList.remove('open');
};

window.toggleMenu = function() {
  document.getElementById('mobileMenu').classList.toggle('open');
};

// ─── HOME PAGE INIT ─────────────────────────
function initHome() {
  // Countdown
  function updateCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const wedding = new Date('2027-06-05T18:00:00-04:00');
    const diff = wedding - new Date();
    if (diff <= 0) {
      el.innerHTML = '<div style="color:var(--gold-light);font-family:\'Pinyon Script\',cursive;font-size:2.4rem">Today is the day!</div>';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const fmt = (n, p) => String(n).padStart(p, '0');
    document.getElementById('cd-days').textContent  = fmt(d, 3);
    document.getElementById('cd-hours').textContent = fmt(h, 2);
    document.getElementById('cd-mins').textContent  = fmt(m, 2);
    document.getElementById('cd-secs').textContent  = fmt(s, 2);
  }
  updateCountdown();
  // Store interval id so we can clear on navigation
  clearInterval(window._countdownInterval);
  window._countdownInterval = setInterval(updateCountdown, 1000);
}

// ─── FAQs PAGE INIT ─────────────────────────
function initFaqs() {
  // Event delegation — works after DOM is injected
  const wrap = mainEl();
  wrap.addEventListener('click', function handler(e) {
    const q = e.target.closest('.faq-q');
    if (!q) return;
    const answer = q.nextElementSibling;
    const symbol = q.querySelector('span');
    const isOpen = answer.classList.contains('open');
    wrap.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
    wrap.querySelectorAll('.faq-q span').forEach(s => s.textContent = '+');
    if (!isOpen) { answer.classList.add('open'); symbol.textContent = '−'; }
  });
}

// ─── STORY PAGE INIT ────────────────────────
function initStory() {
  const scroll = document.querySelector('.story-gallery-scroll');
  if (!scroll) return;
  const track = scroll.querySelector('.gallery-track');
  if (!track || !track.children.length) return;

  const GAP = 12;
  const PHOTO_W = 260;
  const count = track.children.length;
  const setWidth = (PHOTO_W + GAP) * count;

  // Clone set before and after for seamless looping
  const originals = Array.from(track.children);
  originals.forEach(el => track.appendChild(el.cloneNode(true)));
  originals.slice().reverse().forEach(el => track.insertBefore(el.cloneNode(true), track.firstChild));

  // Start scrolled to the original (middle) set
  scroll.scrollLeft = setWidth;

  // Teleport silently when entering the clone zones
  scroll.addEventListener('scroll', function () {
    if (scroll.scrollLeft < setWidth * 0.5) {
      scroll.scrollLeft += setWidth;
    } else if (scroll.scrollLeft > setWidth * 1.5) {
      scroll.scrollLeft -= setWidth;
    }
  }, { passive: true });
}

// ─── BOOT ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => navigate(getRoute()));
