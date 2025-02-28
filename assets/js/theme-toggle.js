document.addEventListener('DOMContentLoaded', function() {
  // Check for saved theme preference only
  const savedTheme = localStorage.getItem('theme');
  
  // Apply dark theme only if explicitly saved as dark
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
    document.body.classList.add('dark-theme');
  }
  
  // Create toggle button if it doesn't exist
  if (!document.getElementById('theme-toggle')) {
    const toggleContainer = document.createElement('div');
    toggleContainer.id = 'theme-toggle-container';
    toggleContainer.className = 'theme-toggle-container';
    
    // Create the toggle with both options
    const lightOption = document.createElement('span');
    lightOption.textContent = 'Light Mode';
    lightOption.className = 'theme-option light-option';
    if (!isDarkTheme()) lightOption.classList.add('active');
    
    const separator = document.createElement('span');
    separator.textContent = ' / ';
    separator.className = 'theme-separator';
    
    const darkOption = document.createElement('span');
    darkOption.textContent = 'Dark Mode';
    darkOption.className = 'theme-option dark-option';
    if (isDarkTheme()) darkOption.classList.add('active');
    
    // Build the toggle container
    toggleContainer.appendChild(lightOption);
    toggleContainer.appendChild(separator);
    toggleContainer.appendChild(darkOption);
    
    // Add click handlers
    lightOption.addEventListener('click', () => setTheme('light'));
    darkOption.addEventListener('click', () => setTheme('dark'));
    
    // Find navigation element and append the button
    const navElement = document.querySelector('nav, .navbar, .nav, .site-nav, header ul');
    if (navElement) {
      // Create a list item if the navigation has a list structure
      if (navElement.tagName === 'UL') {
        const listItem = document.createElement('li');
        listItem.className = 'theme-toggle-item';
        listItem.appendChild(toggleContainer);
        navElement.appendChild(listItem);
      } else {
        navElement.appendChild(toggleContainer);
      }
    } else {
      // Fallback to body if no navigation is found
      console.warn('Navigation element not found. Appending theme toggle to body.');
      toggleContainer.style.position = 'fixed';
      toggleContainer.style.right = '20px';
      toggleContainer.style.top = '20px';
      document.body.appendChild(toggleContainer);
    }
  }
  
  function setTheme(theme) {
    const lightOption = document.querySelector('.light-option');
    const darkOption = document.querySelector('.dark-option');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      
      // Update active state
      darkOption.classList.add('active');
      lightOption.classList.remove('active');
      
      // Ensure high contrast
      darkOption.style.fontWeight = 'bold';
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      
      // Update active state
      lightOption.classList.add('active');
      darkOption.classList.remove('active');
      
      // Reset font weight
      darkOption.style.fontWeight = 'normal';
    }
  }
  
  function isDarkTheme() {
    return document.documentElement.classList.contains('dark-theme');
  }
});
