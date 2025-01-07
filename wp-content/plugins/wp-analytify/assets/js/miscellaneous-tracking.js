jQuery(document).ready(function ($) {
  // Track 404 page errors.
  if (
    "on" === miscellaneous_tracking_options.track_404_page.should_track &&
    miscellaneous_tracking_options.track_404_page.is_404
  ) {
    if ("gtag" === miscellaneous_tracking_options.tracking_mode) {
      if ("ga4" === miscellaneous_tracking_options.ga_mode) {
        if (typeof gtag !== "undefined") {
          gtag("event", "404_error", {
            wpa_category: "404 Error",
            wpa_label:
              miscellaneous_tracking_options.track_404_page.current_url,
          });
        }
      } else {
        if (typeof gtag !== "undefined") {
          gtag("event", "Page Not Found", {
            event_category: "404 Error",
            event_label:
              miscellaneous_tracking_options.track_404_page.current_url,
          });
        }
      }
    } else {
      if (typeof ga !== "undefined") {
        ga(
          "send",
          "event",
          "404 Error",
          "Page Not Found",
          miscellaneous_tracking_options.track_404_page.current_url
        );
      }
    }
  }

  // track javascript errors.
  if ("on" === miscellaneous_tracking_options.track_js_error) {
        function trackJavaScriptError(e) {
          const errMsg = e.message;
          const errSrc = e.filename + ": " + e.lineno;
          gtag("event", "js_error", {
            wpa_category: "JavaScript Error",
            wpa_action: errMsg,
            wpa_label: errSrc,
            non_interaction: true,
          });
        }
        if (typeof gtag !== "undefined") {
          window.addEventListener("error", trackJavaScriptError, false);
        }
  }

  // Track ajax errors.
  if ("on" === miscellaneous_tracking_options.track_ajax_error) {
        if (typeof gtag !== "undefined") {
          jQuery(document).ajaxError(function (e, request, settings) {
            gtag("event", "ajax_error", {
              wpa_category: "Ajax Error",
              wpa_action: request.statusText,
              wpa_label: settings.url,
              non_interaction: true,
            });
          });
        }
  }
});
