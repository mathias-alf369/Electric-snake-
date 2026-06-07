/* Electric Snake COIN_EARN_SAVE_FIX_V1 - coin-bridge.js
   Makes all coin systems use the same balance.
   Fixes cases where gameplay earns coins but menu/shop reads another key.
*/
(function(){
  'use strict';

  const KEYS = [
    'electric-snake-clean-coins-v1',
    'electric-snake-simple-coins-v2',
    'electric-snake-coins',
    'electric-snake-v3-coins',
    'electric-snake-total-coins',
    'electric-snake-coin-balance'
  ];

  function storage(){
    return window.__ES_STORAGE__ || window.localStorage;
  }

  function readNumber(key){
    try{
      const n = Number(storage().getItem(key));
      return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
    }catch(e){
      return 0;
    }
  }

  function bestCoins(){
    let best = 0;
    KEYS.forEach(key => { best = Math.max(best, readNumber(key)); });
    return best;
  }

  function writeAllCoins(value){
    const coins = Math.max(0, Math.floor(Number(value) || 0));
    try{
      KEYS.forEach(key => storage().setItem(key, String(coins)));
    }catch(e){}
    const headerCoins = document.getElementById('coins');
    if(headerCoins) headerCoins.textContent = String(coins);
    const menuCoins = document.getElementById('menuCoins');
    if(menuCoins) menuCoins.textContent = String(coins);
    return coins;
  }

  function syncCoins(){
    return writeAllCoins(bestCoins());
  }

  function wrapStorageSetItem(){
    const s = storage();
    if(!s || s.__coinBridgeWrapped) return;

    const oldSetItem = s.setItem.bind(s);
    s.setItem = function(key, value){
      const result = oldSetItem(key, value);
      if(KEYS.includes(String(key))){
        const coins = Math.max(bestCoins(), Math.max(0, Math.floor(Number(value) || 0)));
        KEYS.forEach(k => {
          if(k !== String(key)) oldSetItem(k, String(coins));
        });
        const headerCoins = document.getElementById('coins');
        if(headerCoins) headerCoins.textContent = String(coins);
        const menuCoins = document.getElementById('menuCoins');
        if(menuCoins) menuCoins.textContent = String(coins);
      }
      return result;
    };

    s.__coinBridgeWrapped = true;
  }

  function wrapFn(name){
    const old = window[name];
    if(typeof old !== 'function' || old.__coinBridgeWrapped) return;
    const wrapped = function(){
      const result = old.apply(this, arguments);
      setTimeout(syncCoins, 0);
      setTimeout(syncCoins, 100);
      return result;
    };
    wrapped.__coinBridgeWrapped = true;
    window[name] = wrapped;
  }

  function init(){
    wrapStorageSetItem();
    syncCoins();
    wrapFn('renderShop');
    wrapFn('updateUI');
    wrapFn('finalOpenMenu');
    wrapFn('saveCoins');
    wrapFn('saveCoinsV10');
    setTimeout(syncCoins, 250);
    setTimeout(syncCoins, 1000);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.electricSnakeSyncCoins = syncCoins;
})();
