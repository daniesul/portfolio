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
    set(false);
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

  // Preview only: compare expand cues (?variant=1|2|3). Shown on Vercel previews or when ?variant is set.
  if (sections.length) {
    var cues = { '1': 'plus', '2': 'chevron', '3': 'text' };
    var q = new URLSearchParams(location.search).get('variant');
    var applyCue = function (n) { sections.forEach(function (s) { s.setAttribute('data-cue', cues[n]); }); };
    if (cues[q]) applyCue(q);
    if (q !== null || /\.vercel\.app$|^localhost$|^127\./.test(location.hostname)) {
      var bar = document.createElement('div');
      bar.className = 'cue-switch';
      bar.setAttribute('role', 'group');
      bar.setAttribute('aria-label', 'Preview: expand cue');
      bar.innerHTML = '<span>Cue</span>';
      var current = cues[q] ? q : Object.keys(cues).filter(function (k) { return cues[k] === sections[0].getAttribute('data-cue'); })[0];
      Object.keys(cues).forEach(function (n) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = n;
        b.setAttribute('aria-pressed', n === current ? 'true' : 'false');
        b.addEventListener('click', function () {
          applyCue(n);
          bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          var u = new URL(location.href); u.searchParams.set('variant', n); history.replaceState(null, '', u);
        });
        bar.appendChild(b);
      });
      document.body.appendChild(bar);
    }
  }

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
