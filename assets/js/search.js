document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const bodyEl = document.body;
  // Simplified: no body class toggling, just show/hide dropdown.

  if (!searchInput) return;

  let posts = [];
  window.__searchDataReady = false;
  let dataLoaded = false;
  let latestSearchTerm = '';

  const clearResults = () => {
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
    bodyEl.classList.remove('search-active');
  };

  const filterPosts = (term) => posts.filter(post => {
    return post.title.toLowerCase().includes(term) ||
      (post.subtitle && post.subtitle.toLowerCase().includes(term)) ||
      post.content.toLowerCase().includes(term);
  });

  const updateResults = (term) => {
    if (term.length < 2) {
      clearResults();
      return;
    }

    if (!dataLoaded) {
      // Keep the UI hidden until data is available to avoid flashing empty states.
      searchResults.style.display = 'none';
      bodyEl.classList.remove('search-active');
      return;
    }

    // Display results
    displayResults(filterPosts(term));
  };

  searchInput.addEventListener('input', function() {
    latestSearchTerm = this.value.toLowerCase().trim();
    updateResults(latestSearchTerm);
  });

  // Load all posts data
  fetch('/search-data.json')
    .then(response => response.json())
    .then(data => {
      posts = data;
      window.__searchDataReady = true;
      dataLoaded = true;
      // Re-run the latest query now that data is available.
      updateResults(latestSearchTerm);
    })
    .catch(error => {
      window.__searchDataReady = 'error';
      console.error('Error loading search data:', error);
    });

  function displayResults(results) {
    // Ensure positioning for mobile overlay
    const setResultsPosition = () => {
      if (!searchResults) return;
      const rect = searchInput.getBoundingClientRect();
      // Only apply dynamic top if in mobile viewport
      if (window.innerWidth <= 768) {
        // Account for scroll position since we'll switch to fixed positioning via CSS
        const top = rect.bottom + window.scrollY + 8; // 8px gap
        searchResults.style.setProperty('--search-results-top', top + 'px');
      } else {
        searchResults.style.removeProperty('--search-results-top');
      }
    };
    setResultsPosition();
  window.addEventListener('resize', setResultsPosition);
    if (results.length === 0) {
      searchResults.innerHTML = '<p class="no-results">No posts found</p>';
      searchResults.style.display = 'block';
      bodyEl.classList.add('search-active');
      return;
    }

    let html = '';
    results.slice(0, 8).forEach(post => {
      html += `<div class="search-result-item">
                <a href="${post.url}" class="search-result-link">
                  <h3>${post.title}</h3>
                  ${post.subtitle ? `<p class="search-result-subtitle">${post.subtitle}</p>` : ''}
                  <p class="search-result-date">${post.date}</p>
                </a>
              </div>`;
    });

    searchResults.innerHTML = html;
    searchResults.style.display = 'block';
    bodyEl.classList.add('search-active');
  }

  // Hide results when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target !== searchInput && !searchResults.contains(e.target)) {
      searchResults.style.display = 'none';
      bodyEl.classList.remove('search-active');
    }
  });

  // Hide posts again when navigating via result (after short delay so link works)
  searchResults.addEventListener('click', function(e){
    const link = e.target.closest('a');
    if (link) {
      bodyEl.classList.remove('search-active');
    }
  });
});
