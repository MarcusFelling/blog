document.addEventListener('DOMContentLoaded', function() {
  // Create the scroll-to-top button
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scroll-to-top';
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.setAttribute('title', 'Scroll to top');
  
  // Add the icon to the button
  const icon = document.createElement('i');
  icon.className = 'fas fa-arrow-up';
  scrollBtn.appendChild(icon);
  
  // Add the button to the page
  document.body.appendChild(scrollBtn);
  
  // Handle button visibility based on scroll position
  window.addEventListener('scroll', function() {
    // Show button when scrolled down 300px or more
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top with smooth animation when clicked
  scrollBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
