/**
 * RSWA — Realtors Social Welfare Association
 * Main JavaScript — All site functionality
 */

(function () {
  'use strict';

  /* ============================================================
     1. DOM READY WRAPPER
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMobileMenu();
    initActiveNav();
    initDropdowns();
    initScrollReveal();
    initCounters();
    initImageSkeletons();
    initSmoothScroll();
    initBackToTop();
    initSearchFilter();
    initEventFilter();
    initFAQAccordion();
    initStaggerChildren();
    initJoinModal();
  });

  /* ============================================================
     2. HEADER SCROLL BEHAVIOR
     ============================================================ */
  function initHeader() {
    var header = document.getElementById('header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ============================================================
     3. MOBILE MENU
     ============================================================ */
  function initMobileMenu() {
    var header      = document.getElementById('header');
    var toggle      = document.getElementById('mobileToggle');
    var mobileNav   = document.querySelector('.mobile-nav');

    if (!header || !toggle) return;

    function openMenu() {
      header.classList.add('mobile-open');
      if (mobileNav) mobileNav.style.transform = 'translateX(0)';
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      header.classList.remove('mobile-open');
      if (mobileNav) mobileNav.style.transform = 'translateX(-100%)';
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      if (header.classList.contains('mobile-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        header.classList.contains('mobile-open') &&
        !header.contains(e.target) &&
        (!mobileNav || !mobileNav.contains(e.target))
      ) {
        closeMenu();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('mobile-open')) {
        closeMenu();
      }
    });

    // Mobile dropdown accordion
    var mobileDropdownToggles = document.querySelectorAll('.mobile-nav-link[data-dropdown]');
    mobileDropdownToggles.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(el.dataset.dropdown);
        if (!target) return;
        var isOpen = target.classList.contains('open');
        // Close all
        document.querySelectorAll('.mobile-dropdown-menu.open').forEach(function (m) {
          m.classList.remove('open');
        });
        if (!isOpen) {
          target.classList.add('open');
          el.querySelector('i') && (el.querySelector('i').style.transform = 'rotate(180deg)');
        } else {
          el.querySelector('i') && (el.querySelector('i').style.transform = '');
        }
      });
    });
  }

  /* ============================================================
     4. ACTIVE NAVIGATION
     ============================================================ */
  function initActiveNav() {
    var pathname = window.location.pathname;
    var filename = pathname.split('/').pop() || 'index.html';

    // Handle root path
    if (filename === '' || filename === '/') {
      filename = 'index.html';
    }

    // Desktop nav links
    var navLinks = document.querySelectorAll('.nav-link[href]');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkFile = href.split('/').pop();
      if (linkFile === filename) {
        link.classList.add('active');
        // Also mark parent dropdown if nested
        var parent = link.closest('.nav-dropdown');
        if (parent) {
          var parentLink = parent.querySelector(':scope > .nav-link');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    });

    // Dropdown items
    var dropdownItems = document.querySelectorAll('.dropdown-item[href]');
    dropdownItems.forEach(function (item) {
      var href = item.getAttribute('href');
      if (!href) return;
      var linkFile = href.split('/').pop();
      if (linkFile === filename) {
        item.classList.add('active');
        var parent = item.closest('.nav-dropdown');
        if (parent) {
          var parentLink = parent.querySelector(':scope > .nav-link');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    });

    // Mobile nav links
    var mobileLinks = document.querySelectorAll('.mobile-nav-link[href], .mobile-dropdown-item[href]');
    mobileLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkFile = href.split('/').pop();
      if (linkFile === filename) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================================
     5. DROPDOWN MENUS — TOUCH/CLICK SUPPORT
     ============================================================ */
  function initDropdowns() {
    var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice) return;

    var dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(function (dropdown) {
      var trigger = dropdown.querySelector(':scope > .nav-link');
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        var menu = dropdown.querySelector('.dropdown-menu');
        if (!menu) return;

        var isOpen = dropdown.classList.contains('touch-open');

        // Close all open dropdowns
        document.querySelectorAll('.nav-dropdown.touch-open').forEach(function (d) {
          d.classList.remove('touch-open');
          var m = d.querySelector('.dropdown-menu');
          if (m) {
            m.style.opacity = '';
            m.style.visibility = '';
            m.style.pointerEvents = '';
            m.style.transform = '';
          }
        });

        if (!isOpen) {
          e.preventDefault();
          dropdown.classList.add('touch-open');
          menu.style.opacity = '1';
          menu.style.visibility = 'visible';
          menu.style.pointerEvents = 'all';
          menu.style.transform = 'translateY(0)';
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      var inDropdown = e.target.closest('.nav-dropdown');
      if (!inDropdown) {
        document.querySelectorAll('.nav-dropdown.touch-open').forEach(function (d) {
          d.classList.remove('touch-open');
          var m = d.querySelector('.dropdown-menu');
          if (m) {
            m.style.opacity = '';
            m.style.visibility = '';
            m.style.pointerEvents = '';
            m.style.transform = '';
          }
        });
      }
    });
  }

  /* ============================================================
     6. SCROLL REVEAL (IntersectionObserver)
     ============================================================ */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
        el.classList.add('active');
      });
      return;
    }

    var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     7. STAGGER CHILDREN
     ============================================================ */
  function initStaggerChildren() {
    var staggerParents = document.querySelectorAll('.stagger-children');
    staggerParents.forEach(function (parent) {
      var children = Array.from(parent.children);
      children.forEach(function (child, i) {
        child.style.setProperty('--delay', String(i + 1));
      });
    });
  }

  /* ============================================================
     8. COUNTER ANIMATION
     ============================================================ */
  function initCounters() {
    if (!('IntersectionObserver' in window)) return;

    var counters = document.querySelectorAll('[data-target]');
    if (counters.length === 0) return;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function animateCounter(el) {
      var target   = parseFloat(el.getAttribute('data-target')) || 0;
      var suffix   = el.getAttribute('data-suffix') || '';
      var prefix   = el.getAttribute('data-prefix') || '';
      var duration = 1800; // ms
      var start    = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var elapsed  = timestamp - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased    = easeOutQuart(progress);
        var current  = Math.round(eased * target);

        // Format with commas for large numbers
        var formatted = current.toLocaleString('en-IN');
        el.textContent = prefix + formatted + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + target.toLocaleString('en-IN') + suffix;
        }
      }

      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  /* ============================================================
     9. IMAGE SKELETON LOADER
     ============================================================ */
  function initImageSkeletons() {
    var images = document.querySelectorAll('img[src]');

    images.forEach(function (img) {
      var parent = img.parentElement;
      if (!parent) return;

      // Add skeleton class to parent if it has img-skeleton class or is a wrap element
      if (parent.classList.contains('img-skeleton')) {
        handleImageLoad(img, parent);
      } else if (
        parent.classList.contains('member-card-img-wrap') ||
        parent.classList.contains('event-img-wrap') ||
        parent.classList.contains('location-card') ||
        parent.classList.contains('author-img-wrap') ||
        parent.classList.contains('profile-hero-img') ||
        parent.classList.contains('about-image-wrap') ||
        parent.classList.contains('hero-bg') ||
        parent.classList.contains('location-hero')
      ) {
        // These have their own wrappers — just handle the loaded class
        handleImageLoad(img, null);
      }
    });

    function handleImageLoad(img, skeletonParent) {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('loaded');
        if (skeletonParent) skeletonParent.classList.add('skeleton-done');
      } else {
        img.addEventListener('load', function () {
          img.classList.add('loaded');
          if (skeletonParent) skeletonParent.classList.add('skeleton-done');
        });
        img.addEventListener('error', function () {
          img.classList.add('loaded'); // Remove shimmer even on error
          if (skeletonParent) skeletonParent.classList.add('skeleton-done');
        });
      }
    }
  }

  /* ============================================================
     10. SMOOTH SCROLL
     ============================================================ */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (href === '#' || href === '#!') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        var headerHeight = 72;
        var targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ============================================================
     11. BACK TO TOP BUTTON
     ============================================================ */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     12. SEARCH & FILTER — MEMBERS PAGE
     ============================================================ */
  function initSearchFilter() {
    var searchInput = document.querySelector('.search-input');
    var filterBtns  = document.querySelectorAll('.filter-btn');
    var memberCards = document.querySelectorAll('.member-card[data-location]');
    var noResults   = document.querySelector('.no-results');

    if (!searchInput && filterBtns.length === 0) return;

    var currentFilter = 'all';
    var currentQuery  = '';

    function filterCards() {
      var query  = currentQuery.toLowerCase().trim();
      var filter = currentFilter.toLowerCase();
      var visibleCount = 0;

      memberCards.forEach(function (card) {
        var name     = (card.querySelector('.member-name') || {}).textContent || '';
        var role     = (card.querySelector('.member-role') || {}).textContent || '';
        var location = (card.dataset.location || '').toLowerCase();
        var role2    = (card.dataset.role || '').toLowerCase();

        var matchesQuery =
          !query ||
          name.toLowerCase().includes(query) ||
          role.toLowerCase().includes(query) ||
          location.includes(query) ||
          role2.includes(query);

        var matchesFilter =
          filter === 'all' || location === filter;

        if (matchesQuery && matchesFilter) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      // Update visible count
      var countEl = document.querySelector('.members-count');
      if (countEl) {
        countEl.textContent = 'Showing ' + visibleCount + ' member' + (visibleCount !== 1 ? 's' : '');
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentQuery = searchInput.value;
        filterCards();
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.dataset.filter || 'all';
        filterCards();
      });
    });
  }

  /* ============================================================
     13. EVENT FILTER TABS
     ============================================================ */
  function initEventFilter() {
    var tabBtns    = document.querySelectorAll('.tab-btn');
    var eventCards = document.querySelectorAll('.event-card[data-category], .event-card[data-status]');

    if (tabBtns.length === 0) return;

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = (btn.dataset.filter || 'all').toLowerCase();

        if (eventCards.length === 0) return;

        eventCards.forEach(function (card) {
          if (filter === 'all') {
            card.style.display = '';
            return;
          }

          var status   = (card.dataset.status || '').toLowerCase();
          var category = (card.dataset.category || '').toLowerCase();

          if (status === filter || category === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ============================================================
     14. FAQ ACCORDION
     ============================================================ */
  function initFAQAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      var answer   = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close all
        faqItems.forEach(function (fi) {
          fi.classList.remove('open');
          var ans = fi.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = '0';
        });

        // Open clicked if it was closed
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ============================================================
     15. JOIN RSWA MODAL FUNCTIONALITY
     ============================================================ */
  function initJoinModal() {
    var modal = document.getElementById('joinModal');
    var closeBtn = document.getElementById('joinModalClose');
    
    if (!modal) return;

    // All "Join RSWA" buttons
    var joinButtons = document.querySelectorAll('a[href="contact.html"].btn, a[href="contact.html"].btn-accent');

    // Open modal instead of navigating
    joinButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openJoinModal();
      });
    });

    // Close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeJoinModal();
      });
    }

    // Close when clicking on overlay
    var overlay = modal.querySelector('.join-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          closeJoinModal();
        }
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeJoinModal();
      }
    });

    // Form submission
    var form = modal.querySelector('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        // Handle form submission (you can add backend integration here)
        alert('Thank you for your interest! We will contact you soon.');
        closeJoinModal();
        form.reset();
      });
    }
  }

  function openJoinModal() {
    var modal = document.getElementById('joinModal');
    if (!modal) return;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeJoinModal() {
    var modal = document.getElementById('joinModal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ============================================================
     16. HERO TRANSPARENT HEADER HANDLING
     ============================================================ */
  // If page has a hero with transparent header
  var heroSection = document.querySelector('.hero');
  var header = document.getElementById('header');

  if (heroSection && header) {
    header.classList.add('header-transparent');

    // When hero is no longer visible, ensure header is solid
    var heroObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            // Hero scrolled away — header background handled by scroll class
          }
        });
      },
      { threshold: 0 }
    );
    heroObserver.observe(heroSection);
  }

})();
