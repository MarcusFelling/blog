(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var trigger = document.querySelector('[data-image-zoom-trigger]');
    var dialog = document.querySelector('[data-image-zoom-dialog]');

    if (!trigger || !dialog || typeof dialog.showModal !== 'function') return;

    var viewport = dialog.querySelector('[data-image-zoom-viewport]');
    var image = dialog.querySelector('[data-image-zoom-full]');
    var zoomOut = dialog.querySelector('[data-image-zoom-out]');
    var zoomIn = dialog.querySelector('[data-image-zoom-in]');
    var reset = dialog.querySelector('[data-image-zoom-reset]');
    var close = dialog.querySelector('[data-image-zoom-close]');
    var levelOutput = dialog.querySelector('[data-image-zoom-level]');
    var zoomLevels = [1, 1.5, 2, 3];
    var zoomIndex = 0;
    var fitWidth = 0;

    trigger.addEventListener('click', function (event) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      dialog.showModal();
      document.body.classList.add('image-zoom-open');

      requestAnimationFrame(function () {
        setFitWidth();
        zoomIndex = window.matchMedia('(max-width: 640px)').matches ? 1 : 0;
        applyZoom(false);
        close.focus();
      });
    });

    zoomOut.addEventListener('click', function () {
      setZoom(zoomIndex - 1);
    });

    zoomIn.addEventListener('click', function () {
      setZoom(zoomIndex + 1);
    });

    reset.addEventListener('click', function () {
      setZoom(0);
    });

    close.addEventListener('click', function () {
      dialog.close();
    });

    dialog.addEventListener('close', function () {
      document.body.classList.remove('image-zoom-open');
      image.style.width = '';
      trigger.focus();
    });

    window.addEventListener('resize', function () {
      if (!dialog.open) return;
      setFitWidth();
      applyZoom(false);
    });

    function setFitWidth() {
      var horizontalPadding = window.matchMedia('(max-width: 640px)').matches ? 32 : 48;
      var verticalPadding = horizontalPadding;
      var availableWidth = Math.max(1, viewport.clientWidth - horizontalPadding);
      var availableHeight = Math.max(1, viewport.clientHeight - verticalPadding);
      var aspectRatio = image.naturalWidth / image.naturalHeight;

      fitWidth = Math.min(image.naturalWidth, availableWidth, availableHeight * aspectRatio);
    }

    function setZoom(nextIndex) {
      var previousWidth = viewport.scrollWidth;
      var previousHeight = viewport.scrollHeight;
      var centerX = (viewport.scrollLeft + viewport.clientWidth / 2) / previousWidth;
      var centerY = (viewport.scrollTop + viewport.clientHeight / 2) / previousHeight;

      zoomIndex = Math.max(0, Math.min(zoomLevels.length - 1, nextIndex));
      applyZoom(true, centerX, centerY);
    }

    function applyZoom(preserveCenter, centerX, centerY) {
      var level = zoomLevels[zoomIndex];
      image.style.width = Math.round(fitWidth * level) + 'px';
      levelOutput.textContent = Math.round(level * 100) + '%';
      zoomOut.disabled = zoomIndex === 0;
      zoomIn.disabled = zoomIndex === zoomLevels.length - 1;

      if (!preserveCenter) {
        viewport.scrollLeft = 0;
        viewport.scrollTop = 0;
        return;
      }

      requestAnimationFrame(function () {
        viewport.scrollLeft = centerX * viewport.scrollWidth - viewport.clientWidth / 2;
        viewport.scrollTop = centerY * viewport.scrollHeight - viewport.clientHeight / 2;
      });
    }
  });
})();