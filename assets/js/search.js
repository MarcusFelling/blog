document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchInput) return;

  let posts = [];

  // Load all posts data
  fetch('/search-data.json')
    .then(response => response.json())
    .then(data => {
      posts = data;
      
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
          searchResults.innerHTML = '';
          searchResults.style.display = 'none';
          return;
        }

        // Filter posts based on search term
        const filteredPosts = posts.filter(post => {
          return post.title.toLowerCase().includes(searchTerm) || 
                (post.subtitle && post.subtitle.toLowerCase().includes(searchTerm)) ||
                post.content.toLowerCase().includes(searchTerm);
        });

        // Display results
        displayResults(filteredPosts);
      });
    })
    .catch(error => console.error('Error loading search data:', error));

  function displayResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<p class="no-results">No posts found</p>';
      searchResults.style.display = 'block';
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
  }

  // Hide results when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target !== searchInput && !searchResults.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });
});
