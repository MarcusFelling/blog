(function () {
  'use strict';

  var backdrop = document.getElementById('cmd-palette-backdrop');
  var palette = document.getElementById('cmd-palette');
  var input = document.getElementById('cmd-palette-input');
  var resultsContainer = document.getElementById('cmd-palette-results');
  var modKey = document.getElementById('cmd-palette-mod');

  if (!palette || !input || !resultsContainer) return;

  // Detect Mac for ⌘ vs Ctrl display
  var isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
  if (modKey) modKey.textContent = isMac ? '⌘' : 'Ctrl';
  // Also update the nav hint button
  var navModKeys = document.querySelectorAll('.cmd-mod-key');
  navModKeys.forEach(function (el) { el.textContent = isMac ? '⌘' : 'Ctrl+'; });

  // Make the nav hint button open the palette
  var triggers = document.querySelectorAll('.cmd-palette-trigger');
  triggers.forEach(function (btn) { btn.addEventListener('click', function () { open(); }); });

  var posts = [];
  var dataLoaded = false;
  var activeIndex = -1;
  var debounceTimer = null;
  var isOpen = false;

  // ---------- data loading ----------
  function loadData() {
    if (dataLoaded) return;
    // Reuse data from search.js if already fetched
    if (window.__searchData && window.__searchData.length) {
      posts = window.__searchData;
      dataLoaded = true;
      return;
    }
    fetch('/search-data.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        posts = data;
        dataLoaded = true;
        window.__searchData = data;
        // Re-render if palette is open and input is still empty
        if (isOpen && input.value.trim() === '') showRecent();
      })
      .catch(function (err) {
        console.error('Command palette: failed to load search data', err);
      });
  }

  // Prefetch on first user interaction so data is ready
  document.addEventListener('keydown', function prefetch() {
    loadData();
    document.removeEventListener('keydown', prefetch);
  }, { once: true });

  // ---------- open / close ----------
  function open() {
    if (isOpen) return;
    loadData();
    isOpen = true;
    backdrop.hidden = false;
    palette.hidden = false;
    // Force reflow before adding the open class for animation
    void palette.offsetHeight;
    backdrop.classList.add('open');
    palette.classList.add('open');
    input.value = '';
    activeIndex = -1;
    showRecent();
    input.focus();
    document.body.classList.add('cmd-palette-open');
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    backdrop.classList.remove('open');
    palette.classList.remove('open');
    document.body.classList.remove('cmd-palette-open');
    // Wait for transition to finish before hiding
    setTimeout(function () {
      if (!isOpen) {
        backdrop.hidden = true;
        palette.hidden = true;
        resultsContainer.innerHTML = '';
      }
    }, 150);
  }

  // ---------- keyboard shortcut ----------
  document.addEventListener('keydown', function (e) {
    var modPressed = isMac ? e.metaKey : e.ctrlKey;
    if (modPressed && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (isOpen) { close(); } else { open(); }
      return;
    }
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      close();
    }
  });

  // Close on backdrop click
  backdrop.addEventListener('click', close);

  // Close on click outside palette inner
  palette.addEventListener('click', function (e) {
    if (e.target === palette) close();
  });

  // ---------- focus trap ----------
  palette.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    // Keep focus inside the palette
    var focusable = palette.querySelectorAll('input, a, button, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ---------- input handling ----------
  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    var term = input.value.trim();
    debounceTimer = setTimeout(function () {
      if (term.length === 0) {
        showRecent();
      } else {
        search(term);
      }
    }, 150);
  });

  // ---------- keyboard nav in results ----------
  input.addEventListener('keydown', function (e) {
    var items = resultsContainer.querySelectorAll('[role="option"]');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      highlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      highlight(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && items[activeIndex]) {
        var link = items[activeIndex].querySelector('a');
        if (link) { close(); window.location.href = link.href; }
      }
    }
  });

  function highlight(items) {
    items.forEach(function (el, i) {
      el.classList.toggle('active', i === activeIndex);
      if (i === activeIndex) {
        el.setAttribute('aria-selected', 'true');
        el.scrollIntoView({ block: 'nearest' });
        input.setAttribute('aria-activedescendant', el.id);
      } else {
        el.setAttribute('aria-selected', 'false');
      }
    });
  }

  // ---------- recent posts ----------
  function showRecent() {
    if (!dataLoaded || posts.length === 0) {
      resultsContainer.innerHTML = '<div class="cmd-palette-section-label">Recent Posts</div><div class="cmd-palette-empty">Loading…</div>';
      return;
    }
    var recent = posts.slice(0, 5);
    var html = '<div class="cmd-palette-section-label">Recent Posts</div>';
    recent.forEach(function (post, i) {
      html += resultItem(post, i, null);
    });
    resultsContainer.innerHTML = html;
    activeIndex = -1;
    bindClicks();
  }

  // ---------- fuzzy-ish search ----------
  function search(term) {
    if (!dataLoaded) return;
    var lower = term.toLowerCase();
    var tokens = lower.split(/\s+/);
    var scored = [];

    posts.forEach(function (post) {
      var title = (post.title || '').toLowerCase();
      var subtitle = (post.subtitle || '').toLowerCase();
      var content = (post.content || '').toLowerCase();
      var tagsStr = (post.tags || []).join(' ').toLowerCase();
      var score = 0;

      tokens.forEach(function (tok) {
        if (title.includes(tok)) score += 10;
        if (subtitle.includes(tok)) score += 5;
        if (tagsStr.includes(tok)) score += 4;
        if (content.includes(tok)) score += 1;
      });

      if (score > 0) scored.push({ post: post, score: score });
    });

    scored.sort(function (a, b) { return b.score - a.score; });

    if (scored.length === 0) {
      resultsContainer.innerHTML = '<div class="cmd-palette-empty"><i class="fas fa-search" aria-hidden="true"></i><p>No posts found for "<strong>' + escapeHtml(term) + '</strong>"</p><p class="cmd-palette-empty-hint">Try different keywords or <a href="/archives">browse the archive</a></p></div>';
      activeIndex = -1;
      return;
    }

    var html = '<div class="cmd-palette-section-label">' + scored.length + ' result' + (scored.length === 1 ? '' : 's') + '</div>';
    scored.slice(0, 12).forEach(function (item, i) {
      html += resultItem(item.post, i, term);
    });
    resultsContainer.innerHTML = html;
    activeIndex = -1;
    bindClicks();
  }

  // ---------- result item builder ----------
  function resultItem(post, index, term) {
    var title = term ? highlightMatch(escapeHtml(post.title), term) : escapeHtml(post.title);
    var dateStr = post.date || '';
    var tags = post.tags || [];
    var tagsHtml = '';
    if (tags.length) {
      tagsHtml = '<span class="cmd-palette-tags">';
      tags.slice(0, 3).forEach(function (t) {
        tagsHtml += '<span class="cmd-palette-tag">' + escapeHtml(t) + '</span>';
      });
      tagsHtml += '</span>';
    }
    return '<div class="cmd-palette-item" role="option" id="cmd-item-' + index + '" aria-selected="false">' +
      '<a href="' + escapeHtml(post.url) + '" tabindex="-1">' +
        '<span class="cmd-palette-item-title">' + title + '</span>' +
        '<span class="cmd-palette-item-meta">' +
          '<span class="cmd-palette-item-date">' + escapeHtml(dateStr) + '</span>' +
          tagsHtml +
        '</span>' +
      '</a>' +
    '</div>';
  }

  // ---------- click handling ----------
  function bindClicks() {
    var items = resultsContainer.querySelectorAll('.cmd-palette-item');
    items.forEach(function (item, i) {
      item.addEventListener('mouseenter', function () {
        activeIndex = i;
        highlight(resultsContainer.querySelectorAll('[role="option"]'));
      });
      item.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var link = item.querySelector('a');
        if (link) {
          close();
          window.location.href = link.href;
        }
      });
    });
  }

  // ---------- highlight matching text ----------
  function highlightMatch(text, term) {
    if (!term) return text;
    var tokens = term.trim().toLowerCase().split(/\s+/);
    tokens.forEach(function (tok) {
      if (!tok) return;
      var escaped = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var re = new RegExp('(' + escaped + ')', 'gi');
      text = text.replace(re, '<mark>$1</mark>');
    });
    return text;
  }

  // ---------- escaping ----------
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ---------- nav hint badge ----------
  // The ⌘K / Ctrl+K hint pill is in command-palette.html as a kbd inside the input.
  // An additional trigger can be wired to any .cmd-palette-trigger element on the page.
  document.addEventListener('click', function (e) {
    if (e.target.closest('.cmd-palette-trigger')) {
      e.preventDefault();
      open();
    }
  });
})();
