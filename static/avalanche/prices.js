/* Avalanche C-Chain on the Assets page: net asset value per token for the funds that publish one.
   Plugs into the list through window.PM, which app.js sets up on the Assets page.

   Read straight from the browser, with no key: the public C-Chain RPC for the on-chain feeds
   (RedStone, Chainlink and issuer oracles named in data/assets.json), and Centrifuge's API for its
   funds. Both allow any origin. If neither answers, the list shows the value in the snapshot. */
(function () {
  'use strict';
  var PM = window.PM;
  if (!PM) return;
  var RPC = 'https://api.avax.network/ext/bc/C/rpc';
  var CENTRIFUGE = 'https://api.centrifuge.io/';
  var LATEST_ROUND_DATA = '0xfeaf968c';
  var live = {}; // contract address, lower case -> { nav, at }

  // An asset's Avalanche identity: the row itself when Avalanche is its only chain, else its "avalanche" block.
  function onChain(a) { return a.source === 'avalanche:list-assets' ? a : a.avalanche || null; }
  function key(c) { return String(c.contract).toLowerCase(); }

  PM.addPriceSource(function (a) {
    var c = onChain(a);
    if (!c || !c.contract) return null;
    var now = live[key(c)], nav = now ? now.nav : c.nav, at = now ? now.at : c.navUpdated;
    if (!nav) return null;
    var dp = nav >= 100 ? 2 : 4;
    var when = at ? ', ' + new Date(at).toLocaleDateString() : '';
    return {
      text: '$' + Number(nav).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }),
      title: c.navKind === 'reference'
        ? 'Reference price, not a quote. ' + c.navSource + when
        : 'Net asset value per token on Avalanche, from ' + c.navSource + when + '. Not a quote.'
    };
  });

  function post(url, body) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }

  // One batched call for every feed. A feed answers latestRoundData(): the value is the second word, the time the fourth.
  function loadFeeds(assets) {
    var fed = assets.filter(function (c) { return c.navFeed && c.navFeed.address; });
    if (!fed.length) return Promise.resolve();
    return post(RPC, fed.map(function (c, i) {
      return { jsonrpc: '2.0', id: i, method: 'eth_call', params: [{ to: c.navFeed.address, data: LATEST_ROUND_DATA }, 'latest'] };
    })).then(function (out) {
      (Array.isArray(out) ? out : []).forEach(function (r) {
        var c = fed[r.id], hex = r.result ? r.result.slice(2) : '';
        if (!c || hex.length < 320) return;
        var value = parseInt(hex.slice(64, 128), 16) / Math.pow(10, c.navFeed.decimals);
        if (value > 0) live[key(c)] = { nav: value, at: parseInt(hex.slice(192, 256), 16) * 1000 };
      });
    });
  }

  // Centrifuge publishes each fund's price per token through its API. Avalanche is network 5 there.
  function loadCentrifuge(assets) {
    var ours = {};
    assets.forEach(function (c) { if (/centrifuge/i.test(c.navSource || '')) ours[key(c)] = 1; });
    if (!Object.keys(ours).length) return Promise.resolve();
    return post(CENTRIFUGE, { query: '{ tokenInstances(where:{centrifugeId:"5"}, limit:100){ items { address tokenPrice } } }' }).then(function (d) {
      var items = (((d || {}).data || {}).tokenInstances || {}).items || [];
      items.forEach(function (t) {
        var k = String(t.address).toLowerCase(), value = Number(t.tokenPrice) / 1e18;
        if (ours[k] && value > 0) live[k] = { nav: value, at: Date.now() };
      });
    });
  }

  function load() {
    if (document.hidden) return;
    var assets = PM.assets().map(onChain).filter(function (c) { return c && c.contract; });
    var done = function () { PM.repaint(); };
    loadFeeds(assets).then(done, done);
    loadCentrifuge(assets).then(done, done);
  }

  PM.ready.then(function () {
    load();
    setInterval(load, 5 * 60000); // the feeds move once a day; gold moves through the day
    document.addEventListener('visibilitychange', load);
  });
})();
