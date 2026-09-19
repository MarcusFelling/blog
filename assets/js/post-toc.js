/**
 * Post Table of Contents + Reading Progress Bar
 *
 * Auto-generates a floating TOC from post headings (h2/h3) with:
 * - Reading progress bar at the top of the page
 * - Active section highlighting via Intersection Observer
 * - Smooth-scroll on click
 * - Collapsible on mobile (toggle button)
 * - Hides automatically on posts with fewer than 3 headings
 */
(function () {
  'use strict';

  const POST_SELECTOR = '.blog-post';
  const HEADING_SELECTOR = 'h2, h3';
  const MIN_HEADINGS = 3;
  const SCROLL_OFFSET = 80; // navbar height + breathing room

  // --- Wait for DOM ---
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const post = document.querySelector(POST_SELECTOR);
    if (!post) return;

    const headings = Array.from(post.querySelectorAll(HEADING_SELECTOR));

    // Ensure every heading has an id for anchor linking
    headings.forEach(function (heading, index) {
      if (!heading.id) {
        heading.id = 'heading-' + index + '-' + slugify(heading.textContent);
      }
    });

    createSectionLinks(headings);
    if (headings.length < MIN_HEADINGS) return;

    createProgressBar();
    createTOC(headings);
    observeHeadings(headings);
    trackProgress(post);
  }

  function createSectionLinks(headings) {
    if (!headings.length) return;

    var status = document.createElement('span');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    document.body.appendChild(status);

    headings.forEach(function (heading) {
      var label = heading.textContent.trim();
      var link = document.createElement('a');
      link.className = 'section-link';
      link.href = '#' + encodeURIComponent(heading.id);
      link.setAttribute('aria-label', 'Copy link to section: ' + label);
      link.setAttribute('data-tooltip', 'Copy link');

      var icon = document.createElement('i');
      icon.className = 'fas fa-link';
      icon.setAttribute('aria-hidden', 'true');
      link.appendChild(icon);
      heading.classList.add('post-heading-linked');
      heading.appendChild(link);

      var resetTimer;
      function showFeedback(copied) {
        window.clearTimeout(resetTimer);
        link.classList.toggle('is-copied', copied);
        icon.className = copied ? 'fas fa-check' : 'fas fa-link';
        link.setAttribute('data-tooltip', copied ? 'Copied!' : 'Link in address bar');
        status.textContent = copied
          ? 'Link copied to section: ' + label
          : 'Could not copy. The section link is in your address bar.';
        resetTimer = window.setTimeout(function () {
          link.classList.remove('is-copied');
          icon.className = 'fas fa-link';
          link.setAttribute('data-tooltip', 'Copy link');
          status.textContent = '';
        }, 2000);
      }

      link.addEventListener('click', function (event) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!navigator.clipboard || !window.isSecureContext) {
          showFeedback(false);
          return;
        }

        event.preventDefault();
        status.textContent = '';
        navigator.clipboard.writeText(link.href).then(function () {
          showFeedback(true);
        }).catch(function () {
          window.location.hash = link.hash;
          showFeedback(false);
        });
      });
    });
  }

  // --- Reading Progress Bar ---
  function createProgressBar() {
    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Reading progress');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', '0');

    var fill = document.createElement('div');
    fill.className = 'reading-progress-fill';
    bar.appendChild(fill);
    document.body.appendChild(bar);
  }

  function trackProgress(post) {
    var fill = document.querySelector('.reading-progress-fill');
    var bar = document.querySelector('.reading-progress');
    if (!fill || !bar) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var rect = post.getBoundingClientRect();
          var postTop = rect.top + window.scrollY;
          var postHeight = rect.height;
          var scrolled = window.scrollY - postTop + window.innerHeight * 0.3;
          var pct = Math.max(0, Math.min(100, (scrolled / postHeight) * 100));
          fill.style.width = pct + '%';
          bar.setAttribute('aria-valuenow', Math.round(pct));
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // --- Table of Contents ---
  function createTOC(headings) {
    // Container
    var aside = document.createElement('aside');
    aside.className = 'post-toc';
    aside.setAttribute('aria-label', 'Table of contents');

    // Header row
    var header = document.createElement('div');
    header.className = 'post-toc-header';

    var title = document.createElement('span');
    title.className = 'post-toc-title';
    title.textContent = 'On this page';
    header.appendChild(title);

    // Collapse button (mobile)
    var collapseBtn = document.createElement('button');
    collapseBtn.className = 'post-toc-collapse';
    collapseBtn.setAttribute('aria-label', 'Collapse table of contents');
    collapseBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    header.appendChild(collapseBtn);

    aside.appendChild(header);

    // Nav list
    var nav = document.createElement('nav');
    nav.className = 'post-toc-nav';
    var ol = document.createElement('ol');
    ol.className = 'post-toc-list';

    headings.forEach(function (h) {
      var li = document.createElement('li');
      li.className = 'post-toc-item';
      if (h.tagName === 'H3') {
        li.classList.add('post-toc-item--nested');
      }

      var a = document.createElement('a');
      a.className = 'post-toc-link';
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.setAttribute('data-target', h.id);

      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(h.id);
        if (target) {
          var y = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
          window.scrollTo({ top: y, behavior: 'smooth' });
          history.replaceState(null, '', '#' + h.id);
        }
        // Auto-close on mobile after clicking
        if (window.innerWidth < 1200) {
          aside.classList.remove('post-toc--expanded');
          var bd = document.querySelector('.post-toc-backdrop');
          if (bd) bd.classList.remove('post-toc-backdrop--visible');
        }
      });

      li.appendChild(a);
      ol.appendChild(li);
    });

    nav.appendChild(ol);
    aside.appendChild(nav);
    document.body.appendChild(aside);

    // Backdrop scrim (mobile)
    var backdrop = document.createElement('div');
    backdrop.className = 'post-toc-backdrop';
    backdrop.addEventListener('click', function () {
      aside.classList.remove('post-toc--expanded');
      backdrop.classList.remove('post-toc-backdrop--visible');
    });
    document.body.appendChild(backdrop);

    // Mobile toggle button (fixed pill)
    var toggle = document.createElement('button');
    toggle.className = 'post-toc-toggle';
    toggle.setAttribute('aria-label', 'Toggle table of contents');
    toggle.innerHTML = '<i class="fas fa-list-ul"></i>';
    toggle.addEventListener('click', function () {
      var opening = !aside.classList.contains('post-toc--expanded');
      aside.classList.toggle('post-toc--expanded');
      backdrop.classList.toggle('post-toc-backdrop--visible', opening);
    });
    document.body.appendChild(toggle);

    // Collapse button toggles list visibility on small screens
    collapseBtn.addEventListener('click', function () {
      aside.classList.toggle('post-toc--collapsed');
    });

    // Show TOC after scrolling past the post header
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          aside.classList.remove('post-toc--visible');
          toggle.classList.remove('post-toc-toggle--visible');
        } else {
          aside.classList.add('post-toc--visible');
          toggle.classList.add('post-toc-toggle--visible');
        }
      });
    }, { threshold: 0 });

    var postHeader = document.querySelector('.header-section');
    if (postHeader) {
      observer.observe(postHeader);
    } else {
      // Fallback: show immediately
      aside.classList.add('post-toc--visible');
      toggle.classList.add('post-toc-toggle--visible');
    }
  }

  // --- Active Section Tracking ---
  function observeHeadings(headings) {
    var links = document.querySelectorAll('.post-toc-link');
    if (!links.length) return;

    var ticking = false;

    function updateActive() {
      // Find the last heading whose top is at or above the scroll threshold
      var threshold = window.scrollY + SCROLL_OFFSET + 1;
      var activeHeading = null;
      for (var i = 0; i < headings.length; i++) {
        var headingTop = headings[i].getBoundingClientRect().top + window.scrollY;
        if (headingTop <= threshold) {
          activeHeading = headings[i];
        }
      }
      links.forEach(function (l) { l.classList.remove('active'); });
      if (activeHeading) {
        var activeLink = document.querySelector('.post-toc-link[data-target="' + activeHeading.id + '"]');
        if (activeLink) {
          activeLink.classList.add('active');
          scrollTocIntoView(activeLink);
        }
      }
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateActive();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Run once on init so the active state is correct for any initial scroll position
    updateActive();
  }

  function scrollTocIntoView(link) {
    var nav = document.querySelector('.post-toc-nav');
    if (!nav) return;
    var navRect = nav.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
      link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  // --- Helpers ---
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 60);
  }
})();
