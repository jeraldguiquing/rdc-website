/*
 * news-events-fixes.js
 * Fixes count display, modal focus handling, and arrow-key behavior.
 */
(function () {
  'use strict';

  function updateCounts() {
    var articles = document.querySelectorAll('#articlesGrid > .article-accordion-card').length;
    var events = document.querySelectorAll('#eventsGrid > .news-card').length;
    var all = articles + events;

    function setText(id, value) {
      var el = document.getElementById(id);
      if (el) el.textContent = value;
    }

    setText('countAllTab', all);
    setText('countArticlesTab', articles);
    setText('countEventsTab', events);
    setText('eventCountTotal', events);

    var evBadge = document.querySelector('#eventsHeaderBanner > span');
    if (evBadge) evBadge.textContent = events + ' Events Documented';

    var artBadge = document.querySelector('#articlesHeaderBanner > span');
    if (artBadge) artBadge.textContent = articles + ' Published Article' + (articles === 1 ? '' : 's');
  }

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var lastTrigger = null;

  document.addEventListener('click', function (e) {
    var target = e.target;
    var trigger = target && target.closest ? target.closest('button, a, [role="button"], .news-card') : null;
    if (trigger) lastTrigger = trigger;
  }, true);

  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.closest) {
      var trigger = e.target.closest('button, a, [role="button"]');
      if (trigger) lastTrigger = trigger;
    }
  }, true);

  function getOverlays() {
    return [
      document.getElementById('eventModalOverlay'),
      document.getElementById('articleModalOverlay')
    ].filter(Boolean);
  }

  function visibleFocusables(container) {
    return Array.prototype.filter.call(container.querySelectorAll(FOCUSABLE), function (el) {
      return el.offsetParent !== null;
    });
  }

  function onOpen(overlay) {
    overlay.setAttribute('aria-hidden', 'false');
    var dialog = overlay.querySelector('.event-modal');
    if (dialog) {
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('tabindex', '-1');
    }

    setTimeout(function () {
      var closeBtn = overlay.querySelector('.event-modal-close');
      (closeBtn || dialog || overlay).focus();
    }, 150);
  }

  function onClose(overlay) {
    overlay.setAttribute('aria-hidden', 'true');
    if (lastTrigger && document.body.contains(lastTrigger)) {
      try {
        lastTrigger.focus({ preventScroll: true });
      } catch (err) {
        lastTrigger.focus();
      }
    }
  }

  getOverlays().forEach(function (overlay) {
    overlay.setAttribute('aria-hidden', overlay.classList.contains('open') ? 'false' : 'true');
    var wasOpen = overlay.classList.contains('open');
    new MutationObserver(function () {
      var isOpen = overlay.classList.contains('open');
      if (isOpen && !wasOpen) onOpen(overlay);
      if (!isOpen && wasOpen) onClose(overlay);
      wasOpen = isOpen;
    }).observe(overlay, { attributes: true, attributeFilter: ['class'] });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var open = getOverlays().filter(function (overlay) {
      return overlay.classList.contains('open');
    })[0];
    if (!open) return;

    var items = visibleFocusables(open);
    if (!items.length) {
      e.preventDefault();
      return;
    }

    var first = items[0];
    var last = items[items.length - 1];
    var active = document.activeElement;
    if (!open.contains(active)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var target = e.target;
    var tag = target && target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (target && target.isContentEditable)) {
      e.stopPropagation();
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCounts);
  } else {
    updateCounts();
  }
})();
