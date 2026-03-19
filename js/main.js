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
     2. NAVBAR SCROLL BEHAVIOR
     ============================================================ */
  function initHeader() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ============================================================
     3. MOBILE MENU — Premium Navbar
     ============================================================ */
  function initMobileMenu() {
    var toggle = document.getElementById('mobileToggle');
    var mobileMenu = document.getElementById('mobile-menu');

    if (!toggle || !mobileMenu) return;

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      // Close all submenus
      document.querySelectorAll('.mobile-menu-submenu.active').forEach(function (submenu) {
        submenu.classList.remove('active');
      });
    }

    function toggleSubmenu(e) {
      e.preventDefault();
      var target = e.currentTarget.dataset.target;
      if (!target) return;

      var submenu = document.getElementById(target);
      if (!submenu) return;

      var isOpen = submenu.classList.contains('active');

      // Close all submenus
      document.querySelectorAll('.mobile-menu-submenu.active').forEach(function (m) {
        m.classList.remove('active');
      });

      // Open current if it wasn't open
      if (!isOpen) {
        submenu.classList.add('active');
        // Rotate icon
        var icon = e.currentTarget.querySelector('.dropdown-icon i');
        if (icon) {
          icon.style.transform = 'rotate(180deg)';
        }
      }
    }

    // Handle toggle open/close
    toggle.addEventListener('change', function () {
      if (this.checked) {
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      } else {
        closeMenu();
      }
    });

    // Close menu when clicking on a link
    var menuLinks = mobileMenu.querySelectorAll('.mobile-menu-link:not(.mobile-menu-dropdown-toggle)');
    menuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.checked = false;
        closeMenu();
      });
    });

    // Close menu when clicking on a sublink
    var sublinks = mobileMenu.querySelectorAll('.mobile-menu-sublink');
    sublinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.checked = false;
        closeMenu();
      });
    });

    // Handle dropdown toggles
    var dropdownToggles = document.querySelectorAll('.mobile-menu-dropdown-toggle');
    dropdownToggles.forEach(function (toggle) {
      toggle.addEventListener('click', toggleSubmenu);
    });

    // Close on ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.checked) {
        toggle.checked = false;
        closeMenu();
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        toggle.checked &&
        !toggle.contains(e.target) &&
        !mobileMenu.contains(e.target)
      ) {
        toggle.checked = false;
        closeMenu();
      }
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
    var navLinks = document.querySelectorAll('.navbar-link[href]');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkFile = href.split('/').pop();
      if (linkFile === filename) {
        link.classList.add('active');
        // Also mark parent dropdown if nested
        var parent = link.closest('.navbar-dropdown');
        if (parent) {
          var parentLink = parent.querySelector(':scope > .navbar-link');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    });

    // Dropdown items
    var dropdownItems = document.querySelectorAll('.navbar-dropdown-item[href]');
    dropdownItems.forEach(function (item) {
      var href = item.getAttribute('href');
      if (!href) return;
      var linkFile = href.split('/').pop();
      if (linkFile === filename) {
        item.classList.add('active');
        var parent = item.closest('.navbar-dropdown');
        if (parent) {
          var parentLink = parent.querySelector(':scope > .navbar-link');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    });

    // Mobile menu links
    var mobileLinks = document.querySelectorAll('.mobile-menu-link[href], .mobile-menu-sublink[href]');
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
     5. DROPDOWN MENUS — TOUCH/CLICK SUPPORT (Premium Navbar)
     ============================================================ */
  function initDropdowns() {
    var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice) return;

    var dropdowns = document.querySelectorAll('.navbar-dropdown');
    dropdowns.forEach(function (dropdown) {
      var trigger = dropdown.querySelector(':scope > .navbar-link');
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        var menu = dropdown.querySelector('.navbar-dropdown-menu');
        if (!menu) return;

        var isOpen = dropdown.classList.contains('touch-open');

        // Close all open dropdowns
        document.querySelectorAll('.navbar-dropdown.touch-open').forEach(function (d) {
          d.classList.remove('touch-open');
        });

        if (!isOpen) {
          e.preventDefault();
          dropdown.classList.add('touch-open');
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.navbar-dropdown')) {
        document.querySelectorAll('.navbar-dropdown.touch-open').forEach(function (d) {
          d.classList.remove('touch-open');
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
        var headerHeight = 76;
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



})();
