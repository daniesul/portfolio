// Small progressive enhancements shared by every page.
(function () {
  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Section switcher: on phones it is a swipeable row, so bring the current section into view
  document.querySelectorAll('.cats a[aria-current="page"]').forEach(function (a) {
    var row = a.closest('.cats');
    if (row && row.scrollWidth > row.clientWidth) row.scrollLeft = a.parentElement.offsetLeft - row.offsetLeft - 16;
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
  // Deep link: /page#dlg-<id> opens that drawer on arrival (e.g. the estimator card on Marketing Strategy & Innovation)
  if (/^#dlg-[\w-]+$/.test(location.hash)) {
    var opener = document.querySelector('[data-dialog="' + location.hash.slice(1) + '"]');
    if (opener) opener.click();
  }

  // Collapsible sections: any element with data-disclosure collapses to its
  // [data-disclosure-head]; the [data-disclosure-toggle] button (or a click
  // anywhere on the head) opens every [data-disclosure-panel] together.
  var sections = document.querySelectorAll('[data-disclosure]');
  sections.forEach(function (sec) {
    var btn = sec.querySelector('[data-disclosure-toggle]');
    var head = sec.querySelector('[data-disclosure-head]');
    var panels = sec.querySelectorAll('[data-disclosure-panel]');
    if (!btn) return;
    function set(open) {
      sec.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panels.forEach(function (p) { if (open) p.removeAttribute('inert'); else p.setAttribute('inert', ''); });
    }
    // Arriving at, or clicking a link to, #<section id> opens it (e.g. the Leadership nav link)
    set(!!sec.id && location.hash === '#' + sec.id);
    if (sec.id) {
      document.querySelectorAll('a[href$="#' + sec.id + '"]').forEach(function (a) {
        a.addEventListener('click', function () { set(true); });
      });
      window.addEventListener('hashchange', function () { if (location.hash === '#' + sec.id) set(true); });
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      set(btn.getAttribute('aria-expanded') !== 'true');
    });
    if (head) head.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      if (window.getSelection && String(window.getSelection())) return; // let people select text
      btn.click();
    });
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
