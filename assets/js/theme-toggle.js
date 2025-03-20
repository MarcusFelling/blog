document.addEventListener('DOMContentLoaded', function() {
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply dark theme if saved as dark or if system prefers dark and no saved preference
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark-theme');
    document.body.classList.add('dark-theme');
  }
  
  // Create toggle button if it doesn't exist
  if (!document.getElementById('theme-toggle')) {
    const toggleContainer = document.createElement('div');
    toggleContainer.id = 'theme-toggle-container';
    toggleContainer.className = 'theme-toggle-container';
    
    // Create a single button containing both options
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle-btn';
    toggleBtn.className = 'theme-toggle-btn ' + (isDarkTheme() ? 'dark-active' : 'light-active');
    
    // Create spans for each option inside the button
    const lightLabel = document.createElement('span');
    lightLabel.textContent = 'Light Mode';
    lightLabel.className = 'mode-option light-label';
    
    const separator = document.createElement('span');
    separator.textContent = ' / ';
    separator.className = 'mode-separator';
    
    const darkLabel = document.createElement('span');
    darkLabel.textContent = 'Dark Mode';
    darkLabel.className = 'mode-option dark-label';
    
    // Add all elements to the button
    toggleBtn.appendChild(lightLabel);
    toggleBtn.appendChild(separator);
    toggleBtn.appendChild(darkLabel);
    
    // Add click handler for the button
    toggleBtn.addEventListener('click', function() {
      const newTheme = isDarkTheme() ? 'light' : 'dark';
      setTheme(newTheme);
    });
    
    // Add the button to the container
    toggleContainer.appendChild(toggleBtn);
    
    // Find navigation element and append the toggle
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
    const toggleBtn = document.getElementById('theme-toggle-btn');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      
      // Update button state
      if (toggleBtn) {
        toggleBtn.classList.remove('light-active');
        toggleBtn.classList.add('dark-active');
      }
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      
      // Update button state
      if (toggleBtn) {
        toggleBtn.classList.remove('dark-active');
        toggleBtn.classList.add('light-active');
      }
    }
  }
  
  function isDarkTheme() {
    return document.documentElement.classList.contains('dark-theme');
  }
});
