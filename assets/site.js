// Small progressive enhancements shared by every page.
(function () {
  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Case-study drawers (Trade Shows & Conferences)
  document.querySelectorAll('[data-dialog]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var d = document.getElementById(btn.getAttribute('data-dialog'));
      if (!d || typeof d.showModal !== 'function') return;
      d.showModal();
      document.documentElement.style.overflow = 'hidden';
      var close = d.querySelector('[data-close]');
      if (close) close.focus();
    });
  });
  document.querySelectorAll('dialog').forEach(function (d) {
    d.addEventListener('close', function () { document.documentElement.style.overflow = ''; });
    // Click on the dimmed backdrop closes the drawer
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
  });
  document.querySelectorAll('[data-close]').forEach(function (btn) {
    btn.addEventListener('click', function () { var d = btn.closest('dialog'); if (d) d.close(); });
  });

  // Mobile menu toggle (pages that have one)
  var toggle = document.querySelector('[data-navtoggle]');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var nav = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!nav) return;
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      var label = toggle.querySelector('span');
      if (label) label.textContent = open ? 'Close' : 'Menu';
    });
  }
})();
