// ============================================================
// RSWA — Main JavaScript
// ============================================================

// ── Navbar scroll ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Hero Slider ────────────────────────────────────────────
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.hero-dot');

if (slides.length) {
  let currentSlide = 0;
  let sliderInterval;

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startSlider() {
    sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  function resetSlider() {
    clearInterval(sliderInterval);
    startSlider();
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    goToSlide(i);
    resetSlider();
  }));

  startSlider();
}

// ── Mobile Drawer ──────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const drawer     = document.getElementById('mobileDrawer');
const overlay    = document.getElementById('drawerOverlay');
const drawerClose = document.getElementById('drawerClose');

function openDrawer() {
  drawer.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

// ── Counter Animation ──────────────────────────────────────
function animateCounter(el) {
  const target   = +el.dataset.target;
  const suffix   = el.dataset.suffix || '';
  const duration = 2000;
  const step     = target / (duration / 16);
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

// ── IntersectionObserver — fade-in + counters ──────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (entry.target.classList.contains('fade-in'))       entry.target.classList.add('visible');
    if (entry.target.classList.contains('stat-number'))   animateCounter(entry.target);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
document.querySelectorAll('.stat-number[data-target]').forEach(el => observer.observe(el));

// ── Gallery Filter ─────────────────────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-page-item');

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;

      galleryItems.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.opacity    = '0';
        item.style.transform  = 'scale(0.95)';
        if (show) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'scale(1)';
          });
        } else {
          setTimeout(() => { item.style.display = 'none'; }, 350);
        }
      });
    });
  });
}

// ── Lightbox ───────────────────────────────────────────────
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxCap  = document.getElementById('lightboxCap');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox) {
  document.querySelectorAll('.gallery-page-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxCap.textContent = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

// ── Contact Form ───────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const orig = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.style.background = '#2a9d5c';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}
