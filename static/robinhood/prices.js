/* Robinhood Chain on the Assets page: the live Stock Token list and its indicative prices.
   Plugs into the list through window.PM, which app.js sets up on the Assets page. */
(function () {
  'use strict';
  var PM = window.PM;
  if (!PM) return;
  var prices = {};
  function isStockToken(a) { return a.kind === 'Stock Token'; }

  PM.addPriceSource(function (a) {
    var q = isStockToken(a) ? prices[a.ticker] : null;
    if (!q || !q.tokenMid) return null;
    if (q.halted) return { text: 'Halted', title: 'Trading is halted.' };
    return {
      text: '$' + Number(q.tokenMid).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      title: 'Indicative. Bid ' + Number(q.tokenBid).toFixed(2) + ', ask ' + Number(q.tokenAsk).toFixed(2) + ' per token, ' + new Date(q.at).toLocaleTimeString()
    };
  });

  function loadPrices() {
    if (document.hidden) return;
    PM.api('/v1/robinhood/prices').then(function (d) {
      prices = {};
      (d.quotes || []).forEach(function (q) { prices[q.symbol] = q; });
      PM.repaint();
    }).catch(function () {});
  }
  // The live registry replaces the snapshot's Stock Tokens; an asset's class is kept from the snapshot.
  function loadAssets() {
    PM.api('/v1/robinhood/assets').then(function (d) {
      var all = PM.assets(), known = {};
      all.forEach(function (a) { if (isStockToken(a)) known[a.ticker] = a; });
      var live = (d.assets || []).filter(function (x) { return x.active; }).map(function (x) {
        var old = known[x.symbol] || {};
        return {
          ticker: x.symbol, name: x.name, issuer: old.issuer || 'Robinhood', 'class': old['class'] || 'Equities', yield30d: null,
          chains: ['robinhood'], settles: old.settles || ['USDG'], access: old.access || 'Retail, non-US',
          kind: 'Stock Token', contract: x.contract, multiplier: x.multiplier
        };
      });
      if (live.length < 50) return;
      PM.setAssets(all.filter(function (a) { return !isStockToken(a); }).concat(live));
    }).catch(function () {});
  }

  PM.ready.then(function () {
    loadAssets(); loadPrices();
    setInterval(loadPrices, 15000);
    setInterval(loadAssets, 5 * 60000);
    document.addEventListener('visibilitychange', loadPrices);
  });
})();
