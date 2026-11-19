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

  // Outreach alerts. Only for visitors who arrived on one of Daniel's personal
  // outreach links: utm_campaign starting "job-search", or utm_medium=outreach. Remembers the
  // campaign in this browser for 90 days so return visits count, and sends a
  // short message per page view and tracked click to Daniel's Google Apps
  // Script, which logs it in his Sheet and emails him. Sends only: campaign,
  // role tag, source, page path, event name, short label, a random visit id,
  // visit number and device type. No cookies, no names, nothing for other visitors.
  var outreach = (function () {
    var ENDPOINT = 'https://script.google.com/macros/s/AKfycbwLhK6nIz1CdeQ29we-Oz0sSbVp3EQD4uchY_9UlGWwgmvZTFYt_HBQNsx5gUOpdDU3aw/exec';
    var PROD_HOST = 'danielsullivanportfolio.com';
    var KEY = 'ds_outreach', VISIT_GAP = 30 * 60 * 1000, KEEP = 90 * 24 * 60 * 60 * 1000;
    var noop = function () {};
    var rec, now = Date.now();
    try {
      var q = new URLSearchParams(location.search);
      var tag = function (v) { v = (v || '').trim().toLowerCase(); return /^[a-z0-9][a-z0-9._-]{0,79}$/.test(v) ? v : ''; };
      rec = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (rec && now - rec.last > KEEP) rec = null;
      // Two link styles count as outreach. "account" is who the link was for,
      // "channel" how it was shared; the alert Sheet and emails use both.
      //  - job search links: utm_campaign=job-search-… , utm_source=<company>,
      //    utm_medium=<email|resume|…>  → account = source, channel = medium
      //  - utm_medium=outreach links: account = campaign, channel = content
      var med = tag(q.get('utm_medium')), cmp = tag(q.get('utm_campaign')), src = tag(q.get('utm_source'));
      var hit = null;
      if (/^job-search/.test(cmp) && src) hit = { account: src, channel: med, from: cmp };
      else if (med === 'outreach' && cmp) hit = { account: cmp, channel: tag(q.get('utm_content')), from: src };
      if (hit && (!rec || rec.campaign !== hit.account || rec.content !== hit.channel)) {
        rec = { campaign: hit.account, content: hit.channel, source: hit.from, visits: 0, last: 0 };
      }
      if (!rec) return noop;
      if (!rec.visitId || now - rec.last > VISIT_GAP) {
        rec.visits = (rec.visits || 0) + 1;
        rec.visitId = Math.random().toString(36).slice(2, 10) + now.toString(36);
      }
      rec.last = now;
      localStorage.setItem(KEY, JSON.stringify(rec));
    } catch (err) { return noop; } // storage blocked or unreadable: send nothing

    var coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    var device = !coarse ? 'desktop' : (Math.min(screen.width, screen.height) >= 600 ? 'tablet' : 'mobile');

    function send(event, detail) {
      try {
        var stored = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (stored) { stored.last = Date.now(); localStorage.setItem(KEY, JSON.stringify(stored)); }
      } catch (err) {}
      var body = JSON.stringify({
        medium: 'outreach', campaign: rec.campaign, content: rec.content, source: rec.source,
        visit_id: rec.visitId, visit_number: rec.visits, event: event,
        host: PROD_HOST, path: location.pathname,
        detail: detail || '', device: device,
        test: location.hostname !== PROD_HOST // preview deployments send marked test messages
      });
      if (!(navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, body))) {
        fetch(ENDPOINT, { method: 'POST', body: body, mode: 'no-cors', keepalive: true }).catch(noop);
      }
    }
    send('page_view');
    return function (event, params) {
      params = params || {};
      send(event, params.item_name || params.section_name || params.link_text || '');
    };
  })();

  // Google Analytics: count on-page clicks that GA doesn't track by itself.
  // Listens in the capture phase so it still sees clicks other handlers stop.
  // Events: drawer_open, section_expand, menu_open, internal_link_click
  // (link_location = nav | section_switcher | button | content),
  // email_click (link_location = footer | contact_section | button | content).
  // track() also passes each event to the outreach alerts above (no-op for
  // ordinary visitors). Internal link clicks stay GA-only: the next page view
  // already shows the outreach log where they went. Outbound links go to
  // outreach only: GA counts them itself.
  function track(name, params) {
    if (typeof window.gtag === 'function') gtag('event', name, params);
    if (name !== 'internal_link_click') outreach(name, params);
  }
  function label(el) {
    var c = el.cloneNode(true);
    c.querySelectorAll('[aria-hidden="true"], .vh, [style*="position:absolute"]').forEach(function (n) { n.remove(); });
    var parts = [], w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) parts.push(n.nodeValue);
    return parts.join(' ').replace(/\s+/g, ' ').trim().slice(0, 100);
  }
  function cardTitle(el) {
    var card = el.closest('article[aria-labelledby]');
    var t = card && document.getElementById(card.getAttribute('aria-labelledby'));
    return t ? label(t) : undefined;
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a, button');
    if (!el) return;
    if (el.hasAttribute('data-dialog')) {
      track('drawer_open', { item_name: cardTitle(el) || el.getAttribute('data-dialog') });
    } else if (el.hasAttribute('data-disclosure-toggle')) {
      if (el.getAttribute('aria-expanded') !== 'true') { // about to open
        var sec = el.closest('[data-disclosure]');
        track('section_expand', { section_name: sec && sec.id ? sec.id : label(el) });
      }
    } else if (el.hasAttribute('data-navtoggle')) {
      if (el.getAttribute('aria-expanded') !== 'true') track('menu_open');
    } else if (el.tagName === 'A' && el.protocol === 'mailto:') {
      track('email_click', {
        link_text: label(el),
        link_location: el.closest('footer') ? 'footer'
          : el.closest('#contact') ? 'contact_section'
          : el.classList.contains('btn') ? 'button' : 'content',
        item_name: cardTitle(el)
      });
    } else if (el.tagName === 'A' && el.host === location.host) {
      var where = el.closest('.cats') ? 'section_switcher'
        : el.closest('nav, .nav') ? 'nav'
        : el.classList.contains('btn') ? 'button' : 'content';
      track('internal_link_click', {
        link_text: label(el),
        link_url: el.pathname + el.hash,
        link_location: where,
        item_name: cardTitle(el)
      });
    } else if (el.tagName === 'A' && /^https?:$/.test(el.protocol)) {
      outreach('outbound_click', { item_name: el.hostname.replace(/^www\./, '') });
    }
  }, true);
})();
