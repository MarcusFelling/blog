// Google Analytics 4 implementation
(function() {
  const MEASUREMENT_ID = 'G-S1X0GV5X2K';

  // Load the Google Analytics script
  function loadGoogleAnalytics() {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID);
  }
  
  // Only load in production environment
  if (window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    loadGoogleAnalytics();
  }
})();
