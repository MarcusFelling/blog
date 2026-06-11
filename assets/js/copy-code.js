/**
 * Copy Code Blocks
 *
 * Adds a copy-to-clipboard button and language label to every
 * syntax-highlighted code block. The button sits in the existing
 * terminal-dots header bar (div.highlight::before is replaced by
 * a real DOM element so we can put interactive controls there).
 *
 * Structure targeted:
 *   div.language-{lang}.highlighter-rouge > div.highlight > pre > code
 *
 * Also handles bare <pre> blocks that aren't wrapped in .highlight.
 */
(function () {
  'use strict';

  /* ── Language display names ────────────────────────────── */
  var LANG_NAMES = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    rb: 'Ruby',
    ruby: 'Ruby',
    py: 'Python',
    python: 'Python',
    sh: 'Shell',
    bash: 'Bash',
    shell: 'Shell',
    zsh: 'Shell',
    ps: 'PowerShell',
    powershell: 'PowerShell',
    yml: 'YAML',
    yaml: 'YAML',
    json: 'JSON',
    xml: 'XML',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    sql: 'SQL',
    csharp: 'C#',
    cs: 'C#',
    java: 'Java',
    go: 'Go',
    rust: 'Rust',
    dockerfile: 'Dockerfile',
    docker: 'Dockerfile',
    tf: 'Terraform',
    hcl: 'Terraform',
    bicep: 'Bicep',
    markdown: 'Markdown',
    md: 'Markdown',
    plaintext: 'Text',
    text: 'Text',
    console: 'Console',
    bat: 'Batch',
    ini: 'INI',
    toml: 'TOML',
    diff: 'Diff',
    graphql: 'GraphQL',
    http: 'HTTP',
    makefile: 'Makefile',
    groovy: 'Groovy',
    swift: 'Swift',
    kotlin: 'Kotlin',
    r: 'R',
    lua: 'Lua',
    perl: 'Perl',
    php: 'PHP',
    cpp: 'C++',
    c: 'C'
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Process Rouge-highlighted blocks (div.highlight > pre > code)
    var highlightBlocks = document.querySelectorAll('div.highlighter-rouge');
    for (var i = 0; i < highlightBlocks.length; i++) {
      enhanceHighlightBlock(highlightBlocks[i]);
    }

    // Process bare <pre> blocks not inside .highlight (e.g. indented code)
    var barePres = document.querySelectorAll('pre:not(.highlight):not([data-copy-enhanced])');
    for (var j = 0; j < barePres.length; j++) {
      var pre = barePres[j];
      if (pre.closest('.highlighter-rouge') || pre.closest('.highlight')) continue;
      enhanceBarePre(pre);
    }
  }

  /* ── Enhance Rouge-highlighted block ───────────────────── */
  function enhanceHighlightBlock(wrapper) {
    var highlightDiv = wrapper.querySelector('div.highlight');
    if (!highlightDiv) return;

    var codeEl = highlightDiv.querySelector('pre code');
    if (!codeEl) return;

    // Detect language from wrapper classes (e.g. "language-yaml")
    var lang = detectLanguage(wrapper);
    var langLabel = lang ? (LANG_NAMES[lang.toLowerCase()] || lang) : '';

    // Build the toolbar (replaces the CSS ::before pseudo-element)
    var toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    toolbar.setAttribute('aria-hidden', 'true');

    // Terminal dots (left side)
    var dots = document.createElement('span');
    dots.className = 'code-toolbar-dots';
    dots.textContent = '\u25CF \u25CF \u25CF';
    toolbar.appendChild(dots);

    // Right-side group: language label + copy button
    var actions = document.createElement('span');
    actions.className = 'code-toolbar-actions';

    if (langLabel) {
      var label = document.createElement('span');
      label.className = 'code-lang-label';
      label.textContent = langLabel;
      actions.appendChild(label);
    }

    var btn = createCopyButton(codeEl);
    actions.appendChild(btn);
    toolbar.appendChild(actions);

    // Insert toolbar as first child of .highlight
    highlightDiv.insertBefore(toolbar, highlightDiv.firstChild);

    // Mark as enhanced
    highlightDiv.classList.add('has-toolbar');
  }

  /* ── Enhance a bare <pre> block ────────────────────────── */
  function enhanceBarePre(pre) {
    pre.setAttribute('data-copy-enhanced', 'true');

    var codeEl = pre.querySelector('code') || pre;

    // Wrap in a container for positioning
    var container = document.createElement('div');
    container.className = 'code-block-bare';
    pre.parentNode.insertBefore(container, pre);
    container.appendChild(pre);

    var btn = createCopyButton(codeEl);
    btn.classList.add('copy-btn-bare');
    container.appendChild(btn);
  }

  /* ── Create the copy button ────────────────────────────── */
  function createCopyButton(codeEl) {
    var btn = document.createElement('button');
    btn.className = 'copy-code-btn';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.setAttribute('title', 'Copy');
    btn.type = 'button';

    btn.innerHTML =
      '<svg class="copy-icon" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">' +
        '<path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25z"/>' +
        '<path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z"/>' +
      '</svg>' +
      '<svg class="check-icon" viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style="display:none">' +
        '<path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>' +
      '</svg>';

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      copyToClipboard(codeEl, btn);
    });

    return btn;
  }

  /* ── Copy logic ────────────────────────────────────────── */
  function copyToClipboard(codeEl, btn) {
    var text = codeEl.textContent || '';

    // Strip trailing newline that Rouge sometimes adds
    text = text.replace(/\n$/, '');

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        showSuccess(btn);
      }).catch(function () {
        fallbackCopy(text, btn);
      });
    } else {
      fallbackCopy(text, btn);
    }
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showSuccess(btn);
    } catch (_) {
      // Silently fail — button stays in default state
    }
    document.body.removeChild(ta);
  }

  function showSuccess(btn) {
    var copyIcon = btn.querySelector('.copy-icon');
    var checkIcon = btn.querySelector('.check-icon');

    btn.classList.add('copied');
    btn.setAttribute('aria-label', 'Copied!');
    btn.setAttribute('title', 'Copied!');
    if (copyIcon) copyIcon.style.display = 'none';
    if (checkIcon) checkIcon.style.display = 'inline';

    setTimeout(function () {
      btn.classList.remove('copied');
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.setAttribute('title', 'Copy');
      if (copyIcon) copyIcon.style.display = 'inline';
      if (checkIcon) checkIcon.style.display = 'none';
    }, 2000);
  }

  /* ── Detect language from wrapper classes ───────────────── */
  function detectLanguage(wrapper) {
    var classes = wrapper.className.split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      var match = classes[i].match(/^language-(.+)$/);
      if (match) return match[1];
    }
    return '';
  }

})();
