/* Promorphic app: theme, navigation, and the Assets list. No dependencies. */
(function () {
  'use strict';
  var root = document.documentElement;
  var page = document.body.getAttribute('data-page');
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };

  // ---- Theme: on is the dark version. The choice is remembered. ----
  var themeColor = $('meta[name="theme-color"]');
  function syncTheme() {
    var dark = root.getAttribute('data-theme') !== 'light';
    $$('.theme-switch').forEach(function (b) { b.setAttribute('aria-checked', dark ? 'true' : 'false'); });
    if (themeColor) themeColor.setAttribute('content', dark ? '#0b0c0e' : '#f7f5f0');
  }
  syncTheme();
  $$('.theme-switch').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.classList.add('theme-change'); // colours change together, without a cross-fade
      root.setAttribute('data-theme', next);
      setTimeout(function () { root.classList.remove('theme-change'); }, 60);
      try { localStorage.setItem('pm-theme', next); } catch (e) {}
      syncTheme();
    });
  });

  // ---- Sidebar menu on narrow screens ----
  var side = $('.side'), menuBtn = $('.side-menu-btn');
  if (side && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = side.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ---- Status line for actions that are not wired up yet ----
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  // ---- Segmented controls: the pressed button and the one clicked trade places ----
  $$('.seg').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-pressed') === 'true') return;
      var group = btn.parentNode, cur = $('.seg[aria-pressed="true"]', group);
      if (cur) {
        var s = cur.getAttribute('style');
        cur.setAttribute('style', btn.getAttribute('style'));
        btn.setAttribute('style', s);
        cur.setAttribute('aria-pressed', 'false');
      }
      btn.setAttribute('aria-pressed', 'true');
      group.dispatchEvent(new CustomEvent('segchange', { detail: btn.textContent.trim() }));
    });
  });

  // ---- Buttons ----
  var askBox = $('#ask');
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null;
    if (!b) return;
    if (b.hasAttribute('data-go')) { location.href = b.getAttribute('data-go'); return; }
    if (askBox && b.closest('section[aria-label="Ask your agent"]') && b.textContent.trim() !== 'Send') {
      askBox.value = b.textContent.trim();
      askBox.focus();
      return;
    }
    if (b.hasAttribute('data-soon')) toast('Not available in the sandbox yet.');
  });

  // ---- Search: filters the Assets list in place, and leads there from every other page ----
  var search = $('.search');
  if (search && page !== 'assets') {
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && search.value.trim()) location.href = '/?q=' + encodeURIComponent(search.value.trim());
    });
  }

  // ---- Orders: filter by status ----
  if (page === 'orders') {
    var statusGroup = $('[role="group"][aria-label="Status"]');
    var rows = $$('main tbody tr');
    var bucket = function (tr) {
      var t = tr.children[8].textContent.trim();
      return t === 'Settled' || t === 'Declined' ? t : 'Open';
    };
    statusGroup.addEventListener('segchange', function (e) {
      var want = e.detail.split(' ')[0];
      rows.forEach(function (tr) { tr.hidden = want !== 'All' && bucket(tr) !== want; });
    });
  }

  // ---- Activity: filter by who acted ----
  if (page === 'activity') {
    var actorGroup = $('[role="group"][aria-label="Actor"]');
    var items = $$('section[aria-label="Activity"] > div:first-child > div');
    var isRow = function (el) { return el.firstElementChild && el.firstElementChild.tagName === 'SPAN'; };
    actorGroup.addEventListener('segchange', function (e) {
      var want = e.detail, heading = null, shown = 0;
      var close = function () { if (heading) heading.hidden = shown === 0; };
      items.forEach(function (el) {
        if (!isRow(el)) { close(); heading = el; shown = 0; return; }
        var ok = want === 'Everyone' || el.children[1].textContent.trim() === want;
        el.hidden = !ok;
        if (ok) shown++;
      });
      close();
    });
  }

  // ---- Sign up: an individual has no organization to name ----
  if (page === 'signup') {
    var org = $('#su-org');
    $('[role="group"][aria-label="Account type"]').addEventListener('segchange', function (e) {
      if (org) org.parentNode.hidden = e.detail === 'Individual';
    });
  }

  // ---- Assets: the list is drawn from /data/assets.json ----
  if (page !== 'assets') return;

  var PAGE_SIZE = 5, MORE = 10;
  var tbody = $('#asset-rows'), tpl = $('#asset-row'), countEl = $('#asset-count');
  var moreWrap = $('#asset-more'), clearLink = $('#clear-filters');
  var YIELD = [
    { id: 'lt2', label: 'Under 2%', test: function (y) { return y != null && y < 2; } },
    { id: '2to4', label: '2% to 4%', test: function (y) { return y != null && y >= 2 && y < 4; } },
    { id: 'gte4', label: '4% and over', test: function (y) { return y != null && y >= 4; } }
  ];
  var FILTERS = {
    'issuer': { name: 'Issuer', get: function (a) { return [a.issuer]; } },
    'chain': { name: 'Chain', get: function (a) { return a.chains || []; }, label: function (v) { return chainName(v); }, meta: function (v) { return chainCode(v); } },
    'asset class': { name: 'Asset class', get: function (a) { return [a.class]; } },
    '30d yield': { name: '30d yield', single: true },
    'settles in': { name: 'Settles in', get: function (a) { return a.settles || []; } },
    'access': { name: 'Access', get: function (a) { return [a.access]; } }
  };
  var data = { chains: {}, assets: [] };
  var state = { q: '', shown: PAGE_SIZE, sel: {} };
  Object.keys(FILTERS).forEach(function (k) { state.sel[k] = []; });

  function chainCode(id) { return (data.chains[id] && data.chains[id].code) || String(id).toUpperCase(); }
  function chainName(id) { return (data.chains[id] && data.chains[id].name) || id; }
  function fmtYield(y) { return y == null ? '—' : y.toFixed(2) + '%'; }

  function matches(a) {
    for (var k in FILTERS) {
      var sel = state.sel[k];
      if (!sel.length) continue;
      if (FILTERS[k].single) {
        var rule = YIELD.filter(function (r) { return r.id === sel[0]; })[0];
        if (rule && !rule.test(a.yield30d)) return false;
      } else if (!FILTERS[k].get(a).some(function (v) { return sel.indexOf(v) !== -1; })) {
        return false;
      }
    }
    if (state.q) {
      var hay = [a.ticker, a.name, a.issuer, a.class].concat((a.chains || []).map(chainName), (a.chains || []).map(chainCode)).join(' ').toLowerCase();
      if (state.q.toLowerCase().split(/\s+/).some(function (w) { return hay.indexOf(w) === -1; })) return false;
    }
    return true;
  }

  function render() {
    var list = data.assets.filter(matches).sort(function (a, b) { return a.name.localeCompare(b.name, 'en'); });
    tbody.textContent = '';
    list.slice(0, state.shown).forEach(function (a) {
      var tr = tpl.content.firstElementChild.cloneNode(true);
      var set = function (f, v) { $('[data-f="' + f + '"]', tr).textContent = v; };
      set('ticker', a.ticker);
      set('name', a.name);
      set('class', a.class);
      set('yield', fmtYield(a.yield30d));
      set('chains', (a.chains || []).map(chainCode).join(' · '));
      tbody.appendChild(tr);
    });
    if (!list.length) {
      var tr = document.createElement('tr'), td = document.createElement('td');
      td.colSpan = 5;
      td.setAttribute('style', 'padding: 0 16px; height: 96px; text-align: center; font-size: 15px; color: var(--ink-muted)');
      td.textContent = data.assets.length ? 'No assets match these filters.' : 'No assets listed yet.';
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    moreWrap.hidden = list.length <= state.shown;

    var issuers = {};
    list.forEach(function (a) { issuers[a.issuer] = 1; });
    var names = Object.keys(issuers);
    countEl.textContent = '';
    var strong = document.createElement('strong');
    strong.style.fontWeight = '500';
    strong.textContent = list.length === 1 ? '1 asset' : list.length + ' assets';
    countEl.appendChild(strong);
    if (names.length) {
      var from = document.createElement('span');
      from.style.color = 'var(--ink-muted)';
      from.textContent = ' from ' + (names.length === 1 ? names[0] : names.length + ' issuers');
      countEl.appendChild(from);
    }

    var any = !!state.q;
    $$('.btn-filter').forEach(function (btn) {
      var k = btn.getAttribute('data-filter'), f = FILTERS[k], sel = state.sel[k], text = f.name;
      if (sel.length) {
        any = true;
        var first = f.single ? YIELD.filter(function (r) { return r.id === sel[0]; })[0].label : (f.label ? f.label(sel[0]) : sel[0]);
        text += ': ' + (sel.length === 1 ? first : sel.length + ' selected');
        btn.setAttribute('data-active', '');
      } else {
        btn.removeAttribute('data-active');
      }
      btn.firstChild.nodeValue = text;
    });
    clearLink.hidden = !any;
  }

  // Filter menus
  var openMenu = null;
  function closeMenu(focus) {
    if (!openMenu) return;
    openMenu.menu.remove();
    openMenu.btn.setAttribute('aria-expanded', 'false');
    if (focus) openMenu.btn.focus();
    openMenu = null;
  }
  function options(k) {
    var f = FILTERS[k];
    if (f.single) return YIELD.map(function (r) { return { value: r.id, label: r.label }; });
    var seen = {};
    data.assets.forEach(function (a) { f.get(a).forEach(function (v) { if (v) seen[v] = 1; }); });
    return Object.keys(seen).map(function (v) { return { value: v, label: f.label ? f.label(v) : v, meta: f.meta ? f.meta(v) : '' }; })
      .sort(function (a, b) { return a.label.localeCompare(b.label); });
  }
  function showMenu(btn) {
    var k = btn.getAttribute('data-filter'), f = FILTERS[k];
    var menu = document.createElement('div');
    menu.className = 'menu';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', f.name);
    if (!f.single) menu.setAttribute('aria-multiselectable', 'true');
    var opts = options(k);
    if (!opts.length) {
      var none = document.createElement('div');
      none.setAttribute('style', 'padding: 12px 10px; font-size: 14px; color: var(--ink-muted)');
      none.textContent = 'Nothing to filter by yet.';
      menu.appendChild(none);
    }
    opts.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'option');
      if (f.single) b.className = 'radio';
      b.setAttribute('aria-selected', state.sel[k].indexOf(o.value) !== -1 ? 'true' : 'false');
      b.innerHTML = '<span class="box" aria-hidden="true"><svg viewBox="0 0 10 10" fill="none" stroke-width="1.5"><path d="M2 5.2l2 2 4-4.4"/></svg></span>';
      b.appendChild(document.createTextNode(o.label));
      if (o.meta) { var m = document.createElement('span'); m.className = 'meta'; m.textContent = o.meta; b.appendChild(m); }
      b.addEventListener('click', function () {
        var sel = state.sel[k], i = sel.indexOf(o.value);
        if (f.single) state.sel[k] = i === -1 ? [o.value] : [];
        else if (i === -1) sel.push(o.value); else sel.splice(i, 1);
        state.shown = PAGE_SIZE;
        $$('[role="option"]', menu).forEach(function (el, n) { el.setAttribute('aria-selected', state.sel[k].indexOf(opts[n].value) !== -1 ? 'true' : 'false'); });
        render();
      });
      menu.appendChild(b);
    });
    btn.parentNode.appendChild(menu);
    btn.setAttribute('aria-expanded', 'true');
    var over = menu.getBoundingClientRect().right - (window.innerWidth - 16);
    if (over > 0) menu.style.left = -over + 'px';
    openMenu = { btn: btn, menu: menu };
    var first = $('[role="option"]', menu);
    if (first) first.focus();
  }
  $$('.btn-filter').forEach(function (btn) {
    var wrap = document.createElement('span');
    wrap.className = 'filter';
    btn.parentNode.insertBefore(wrap, btn);
    wrap.appendChild(btn);
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var mine = openMenu && openMenu.btn === btn;
      closeMenu();
      if (!mine) showMenu(btn);
    });
  });
  document.addEventListener('click', function (e) {
    if (openMenu && !openMenu.btn.parentNode.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (!openMenu) return;
    if (e.key === 'Escape') { closeMenu(true); return; }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    var opts = $$('[role="option"]', openMenu.menu), i = opts.indexOf(document.activeElement);
    if (!opts.length) return;
    e.preventDefault();
    opts[(i + (e.key === 'ArrowDown' ? 1 : opts.length - 1)) % opts.length].focus();
  });

  clearLink.addEventListener('click', function (e) {
    e.preventDefault();
    Object.keys(state.sel).forEach(function (k) { state.sel[k] = []; });
    state.q = '';
    state.shown = PAGE_SIZE;
    if (search) search.value = '';
    closeMenu();
    render();
  });
  $('[data-more]').addEventListener('click', function () { state.shown += MORE; render(); });
  if (search) {
    var q = new URLSearchParams(location.search).get('q');
    if (q) { search.value = q; state.q = q.trim(); }
    search.addEventListener('input', function () { state.q = search.value.trim(); state.shown = PAGE_SIZE; render(); });
  }

  fetch('/data/assets.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) { data = { chains: d.chains || {}, assets: d.assets || [] }; render(); })
    .catch(function () {
      countEl.textContent = '';
      var s = document.createElement('strong');
      s.style.fontWeight = '500';
      s.textContent = 'The asset list could not be loaded.';
      countEl.appendChild(s);
    });
})();
