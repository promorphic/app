/* Promorphic app: live Robinhood Chain data from the Promorphic API.
   - Wallets page: set a wallet address (pasted, or read from a browser wallet). Read-only: nothing is ever signed.
   - Portfolio page: that wallet's live holdings on Robinhood Chain.
   - Assets page: an indicative quote for a Stock Token, from the row's Actions button.
   Kept apart from app.js so the two can change independently. No dependencies. */
(function () {
  'use strict';
  var API = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'http://localhost:8787' : 'https://promorphic-api-1017392197056.europe-west1.run.app';
  var KEY = 'pm-rh-wallet';
  var page = document.body.getAttribute('data-page');
  var $ = function (sel, el) { return (el || document).querySelector(sel); };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function getApi(path) {
    return fetch(API + path).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (body) {
        if (!r.ok) throw new Error((body.error && body.error.message) || 'The request failed (' + r.status + ').');
        return body;
      });
    });
  }
  function isAddress(s) { return /^0x[0-9a-fA-F]{40}$/.test(s || ''); }
  function getWallet() { try { var w = localStorage.getItem(KEY); return isAddress(w) ? w : null; } catch (e) { return null; } }
  function setWallet(w) { try { if (w) localStorage.setItem(KEY, w); else localStorage.removeItem(KEY); } catch (e) {} }
  function short(a) { return a.slice(0, 6) + '…' + a.slice(-4); }
  function usd(v) { return v == null || v === '' ? '—' : '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function qty(v, max) { return Number(v).toLocaleString('en-US', { maximumFractionDigits: max == null ? 6 : max }); }
  function time(iso) { return new Date(iso).toLocaleTimeString(); }

  // ---------- Wallet dialog ----------
  function walletDialog(onChange) {
    var d = el('dialog', 'live-dialog'), f = el('form');
    f.method = 'dialog';
    f.appendChild(el('h2', null, 'Robinhood Chain wallet'));
    f.appendChild(el('p', null, 'Paste a wallet address to see its live holdings on Robinhood Chain. This is read-only: Promorphic reads balances and never asks you to sign anything here.'));
    var label = el('label', null, 'Wallet address'), input = el('input', 'live-input');
    input.type = 'text'; input.placeholder = '0x…'; input.autocomplete = 'off'; input.spellcheck = false;
    input.value = getWallet() || '';
    label.appendChild(input); f.appendChild(label);
    var err = el('p', 'live-error'); err.hidden = true; f.appendChild(err);
    var foot = el('div', 'live-foot');
    if (window.ethereum && window.ethereum.request) {
      var use = el('button', 'live-btn', 'Use browser wallet'); use.type = 'button';
      use.addEventListener('click', function () {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(function (a) { if (a && a[0]) input.value = a[0]; })
          .catch(function () { err.textContent = 'The browser wallet did not share an address.'; err.hidden = false; });
      });
      foot.appendChild(use);
    }
    if (getWallet()) {
      var rm = el('button', 'live-btn', 'Remove'); rm.type = 'button';
      rm.addEventListener('click', function () { setWallet(null); d.close(); onChange(); });
      foot.appendChild(rm);
    }
    var cancel = el('button', 'live-btn', 'Cancel'); cancel.type = 'button';
    cancel.addEventListener('click', function () { d.close(); });
    var save = el('button', 'live-btn solid', 'Save'); save.type = 'submit';
    foot.appendChild(cancel); foot.appendChild(save); f.appendChild(foot);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!isAddress(v)) { err.textContent = 'Enter a full address: 0x followed by 40 characters.'; err.hidden = false; input.focus(); return; }
      setWallet(v); d.close(); onChange();
    });
    d.appendChild(f);
    d.addEventListener('close', function () { d.remove(); });
    document.body.appendChild(d);
    d.showModal();
  }

  // ---------- Wallets page ----------
  if (page === 'wallets') {
    var listSection = $('section[aria-label="Wallets"]');
    var card = el('section', 'live-section');
    card.setAttribute('aria-label', 'Live wallet on Robinhood Chain');
    if (listSection) listSection.parentNode.insertBefore(card, listSection);
    var openWallet = function () { walletDialog(drawWallet); };

    var drawWallet = function () {
      var w = getWallet();
      card.textContent = '';
      var head = el('div', 'live-head');
      head.appendChild(el('h2', null, 'Robinhood Chain wallet'));
      head.appendChild(el('span', 'live-tag', 'Live'));
      head.appendChild(el('span', 'live-meta', 'Read from the chain. The table below is sample data.'));
      card.appendChild(head);
      var box = el('div', 'live-card'), grow = el('div', 'grow'), actions = el('div', 'live-actions');
      box.appendChild(grow); box.appendChild(actions); card.appendChild(box);
      var set = el('button', 'live-btn' + (w ? '' : ' solid'), w ? 'Change' : 'Add wallet'); set.type = 'button';
      set.addEventListener('click', openWallet);
      actions.appendChild(set);
      if (!w) { grow.appendChild(el('div', 'live-meta', 'No wallet set. Add an address to see its live balances here and on the Portfolio page.')); return; }
      grow.appendChild(el('div', 'addr live-mono', w));
      var figs = el('div', 'figs live-meta'); figs.textContent = 'Reading balances…';
      grow.appendChild(figs);
      var view = el('button', 'live-btn', 'View holdings'); view.type = 'button';
      view.addEventListener('click', function () { location.href = '/portfolio/'; });
      actions.appendChild(view);
      getApi('/v1/robinhood/positions/' + w).then(function (p) {
        if (getWallet() !== w) return;
        figs.textContent = '';
        [[usd(p.totals.withUsdgUsd), 'total'], [usd(p.totals.stockTokensUsd), 'in ' + p.stockTokens.length + (p.stockTokens.length === 1 ? ' Stock Token' : ' Stock Tokens')],
          [qty(p.cash.usdg, 2), 'USDG'], [qty(p.cash.eth, 5), 'ETH for gas']].forEach(function (x) {
          var s = el('span'); var b = el('span', 'live-mono', x[0]); b.style.color = 'var(--ink)';
          s.appendChild(b); s.appendChild(document.createTextNode(' ' + x[1])); figs.appendChild(s);
        });
      }).catch(function (e) { figs.textContent = e.message; });
    };
    drawWallet();
    // The page's own Connect wallet button opens the same dialog instead of the "not available" notice.
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button[data-soon]') : null;
      if (b && b.textContent.trim() === 'Connect wallet') { e.stopPropagation(); openWallet(); }
    }, true);
  }

  // ---------- Portfolio page ----------
  if (page === 'portfolio') {
    var holdings = $('section[aria-label="Holdings"]');
    var live = el('section', 'live-section');
    live.setAttribute('aria-label', 'Live holdings on Robinhood Chain');
    if (holdings) holdings.parentNode.insertBefore(live, holdings);
    var head = el('div', 'live-head');
    head.appendChild(el('h2', null, 'Live holdings on Robinhood Chain'));
    head.appendChild(el('span', 'live-tag', 'Live'));
    var meta = el('span', 'live-meta'); head.appendChild(meta);
    var box = el('div', 'live-box');
    live.appendChild(head); live.appendChild(box);
    live.appendChild(el('div', 'live-meta', 'Read from the chain for the wallet set on the Wallets page. Prices are indicative. The figures above and the Holdings table below are sample data.'));

    var cell = function (tr, text, cls) { var td = el('td', cls, text); tr.appendChild(td); return td; };
    var assetCell = function (tr, ticker, name) {
      var td = el('td'), wrap = el('div', 'live-asset');
      wrap.appendChild(el('span', 'live-ticker', ticker)); wrap.appendChild(el('span', 'live-name', name));
      td.appendChild(wrap); tr.appendChild(td);
    };
    var empty = function (text, withLink) {
      box.textContent = '';
      var d = el('div', 'live-empty', text);
      if (withLink) { var a = el('a', null, 'Add one on the Wallets page.'); a.href = '/wallets/'; d.appendChild(document.createTextNode(' ')); d.appendChild(a); }
      box.appendChild(d);
    };
    var draw = function (p) {
      meta.textContent = short(p.address) + ' · updated ' + time(p.asOf);
      meta.title = p.address;
      if (!p.stockTokens.length && !Number(p.cash.usdg)) { empty('This wallet holds no Stock Tokens or USDG on Robinhood Chain.'); return; }
      var t = el('table', 'live-table'), thead = el('thead'), hr = el('tr'), tb = el('tbody');
      [['Asset', ''], ['Tokens', 'num'], ['Shares', 'num'], ['Price', 'num'], ['Value', 'num']].forEach(function (h) {
        var th = el('th', h[1], h[0]); th.scope = 'col'; hr.appendChild(th);
      });
      thead.appendChild(hr); t.appendChild(thead); t.appendChild(tb);
      p.stockTokens.forEach(function (s) {
        var tr = el('tr');
        assetCell(tr, s.symbol, s.name);
        cell(tr, qty(s.tokens), 'num');
        cell(tr, qty(s.shares), 'num').title = 'Tokens × multiplier ' + Number(s.multiplier);
        cell(tr, s.halted ? 'Halted' : usd(s.tokenMid), 'num');
        cell(tr, usd(s.valueUsd), 'num');
        tb.appendChild(tr);
      });
      if (Number(p.cash.usdg)) {
        var c = el('tr');
        assetCell(c, 'USDG', 'Settlement balance');
        cell(c, qty(p.cash.usdg, 2), 'num'); cell(c, '—', 'num'); cell(c, '$1.00', 'num'); cell(c, usd(p.cash.usdg), 'num');
        tb.appendChild(c);
      }
      var tot = el('tr', 'live-total');
      var lab = cell(tot, 'Total on Robinhood Chain'); lab.colSpan = 4;
      cell(tot, usd(p.totals.withUsdgUsd), 'num');
      tb.appendChild(tot);
      box.textContent = ''; box.appendChild(t);
    };
    var load = function () {
      var w = getWallet();
      if (!w) { meta.textContent = ''; empty('No wallet set.', true); return; }
      if (document.hidden) return;
      getApi('/v1/robinhood/positions/' + w).then(draw).catch(function (e) { if (!$('table', box)) empty(e.message); });
    };
    if (getWallet()) empty('Reading balances…');
    load();
    setInterval(load, 30000);
    document.addEventListener('visibilitychange', load);
  }

  // ---------- Assets page: indicative quote for a Stock Token ----------
  if (page === 'assets') {
    var quoteDialog = function (a) {
      var d = el('dialog', 'live-dialog'), f = el('form');
      var side = 'buy';
      f.appendChild(el('h2', null, 'Quote for ' + a.ticker));
      f.appendChild(el('p', null, a.name + '. A Stock Token on Robinhood Chain, traded against USDG.'));
      var row = el('div', 'live-row');
      var seg = el('div', 'live-seg'); seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Side');
      var buyB = el('button', 'live-btn', 'Buy'), sellB = el('button', 'live-btn', 'Sell');
      buyB.type = sellB.type = 'button';
      seg.appendChild(buyB); seg.appendChild(sellB);
      var label = el('label'), labelText = document.createTextNode(''), input = el('input', 'live-input');
      input.type = 'text'; input.inputMode = 'decimal'; input.autocomplete = 'off';
      label.appendChild(labelText); label.appendChild(input);
      var go = el('button', 'live-btn solid', 'Get quote'); go.type = 'submit';
      row.appendChild(seg); row.appendChild(label); row.appendChild(go);
      f.appendChild(row);
      var out = el('div', 'live-quotes'); out.setAttribute('aria-live', 'polite'); f.appendChild(out);
      f.appendChild(el('p', null, 'Quotes are indicative and compare LiFi and 0x. Trading is not available in the sandbox yet.'));
      var foot = el('div', 'live-foot'), close = el('button', 'live-btn', 'Close'); close.type = 'button';
      close.addEventListener('click', function () { d.close(); });
      foot.appendChild(close); f.appendChild(foot);

      var setSide = function (s) {
        side = s;
        buyB.setAttribute('aria-pressed', s === 'buy'); sellB.setAttribute('aria-pressed', s === 'sell');
        labelText.nodeValue = s === 'buy' ? 'Amount to spend, in USDG' : 'Amount to sell, in ' + a.ticker + ' tokens';
        input.value = s === 'buy' ? '100' : '1';
        out.textContent = '';
      };
      buyB.addEventListener('click', function () { setSide('buy'); });
      sellB.addEventListener('click', function () { setSide('sell'); });
      setSide('buy');

      var message = function (text) { out.textContent = ''; out.appendChild(el('p', 'live-error', text)); };
      var show = function (q) {
        out.textContent = '';
        if (!q.tradable) { message(q.reasons && q.reasons.length ? 'Not tradable right now: ' + q.reasons.join(', ') + '.' : 'No venue returned a quote for this size.'); }
        var unit = side === 'buy' ? a.ticker : 'USDG';
        (q.quotes || []).slice().sort(function (x, y) { return (y.venue === q.best) - (x.venue === q.best); }).forEach(function (v) {
          var c = el('div', 'live-quote' + (v.venue === q.best ? ' best' : ''));
          var top = el('div', 'top');
          top.appendChild(el('span', 'venue', (v.venue === 'lifi' ? 'LiFi' : '0x') + (v.venue === q.best ? ' · best' : '')));
          top.appendChild(el('span', 'amount live-mono', v.error ? 'No quote' : qty(v.buyAmount) + ' ' + unit));
          c.appendChild(top);
          if (v.error) { c.appendChild(el('div', 'live-meta', v.error)); out.appendChild(c); return; }
          var dl = el('dl');
          [['You receive at least', qty(v.minBuyAmount) + ' ' + unit],
            ['Price per token', usd(v.pricePerToken)],
            ['Against the indicative price', (Number(v.vsReferencePct) > 0 ? v.vsReferencePct + '% worse' : Math.abs(Number(v.vsReferencePct)).toFixed(2) + '% better')],
            ['Venue fee', v.feeUsd == null ? '—' : usd(v.feeUsd)],
            ['Route', v.route || '—']].forEach(function (r) {
            dl.appendChild(el('dt', null, r[0])); dl.appendChild(el('dd', 'live-mono', r[1]));
          });
          c.appendChild(dl); out.appendChild(c);
        });
        (q.warnings || []).forEach(function (w) { out.appendChild(el('p', 'live-error', 'Warning: ' + w + '.')); });
        if (q.reference) out.appendChild(el('p', null, 'Indicative price: bid ' + usd(q.reference.tokenBid) + ', ask ' + usd(q.reference.tokenAsk) + ' per token, at ' + time(q.reference.at) + '. One token is ' + qty(q.multiplier, 6) + ' shares.'));
      };
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var amt = input.value.trim();
        if (!/^\d+(\.\d+)?$/.test(amt) || Number(amt) <= 0) { message('Enter an amount greater than zero.'); input.focus(); return; }
        go.disabled = true; out.textContent = ''; out.appendChild(el('p', null, 'Getting quotes…'));
        getApi('/v1/robinhood/quote?side=' + side + '&symbol=' + encodeURIComponent(a.ticker) + '&amount=' + encodeURIComponent(amt))
          .then(show).catch(function (err) { message(err.message); })
          .then(function () { go.disabled = false; });
      });
      d.appendChild(f);
      d.addEventListener('close', function () { d.remove(); });
      document.body.appendChild(d);
      d.showModal();
      input.focus(); input.select();
    };
    // A Stock Token row's Actions button opens the quote instead of the "not available" notice.
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('#asset-rows button') : null;
      var tr = b && b.closest('tr[data-ticker]');
      if (!tr || !tr._asset || tr._asset.kind !== 'Stock Token') return;
      e.stopPropagation();
      quoteDialog(tr._asset);
    }, true);
  }
})();
