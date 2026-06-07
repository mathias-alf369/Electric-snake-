/* Electric Snake MODULAR_CLEAN_FINAL_V1 - shop.js

   Shop-styring:
   - Coins bevares fra eksisterende coin-keys.
   - Skin-ejerskab bruger en ny ren key, så gamle ødelagte saves ikke følger med.
   - Ejede skins kan kun tilføjes ved køb.
   - At vælge et andet skin omskriver/fjerner aldrig ejede skins.
*/

(function(){
  'use strict';

  function shopLang(){
    try{ return localStorage.getItem('electric-snake-language-v1') === 'en' ? 'en' : 'da'; }
    catch(e){ return 'da'; }
  }

  function shopText(key){
    const lang = shopLang();
    const t = {
      da: {
        note: 'Ren shop: køb låser op, ejede skins kan vælges, låste skins kan ikke bruges gratis.',
        equipped: 'Valgt ✅',
        owned: 'Ejet — tryk for at vælge',
        buy: 'Køb ',
        locked: 'Låst ',
        lockedNeed: 'Låst — mangler ',
        coins: ' coins 🪙',
        bought: 'Købt ✅',
        invalid: 'Ugyldigt skin'
      },
      en: {
        note: 'Clean shop: buying unlocks, owned skins can be equipped, locked skins cannot be used for free.',
        equipped: 'Equipped ✅',
        owned: 'Owned — tap to equip',
        buy: 'Buy ',
        locked: 'Locked ',
        lockedNeed: 'Locked — need ',
        coins: ' coins 🪙',
        bought: 'Bought ✅',
        invalid: 'Invalid skin'
      }
    };
    return (t[lang] && t[lang][key]) || t.da[key] || key;
  }



  const STORAGE = window.__ES_STORAGE__ || window.localStorage;

  const KEYS = {
    coins: 'electric-snake-clean-coins-v1',
    owned: 'electric-snake-clean-owned-skins-v1',
    equipped: 'electric-snake-clean-equipped-skin-v1',
    installed: 'electric-snake-clean-shop-installed-v1'
  };

  const COIN_MIRRORS = [
    'electric-snake-clean-coins-v1',
    'electric-snake-simple-coins-v2',
    'electric-snake-coins',
    'electric-snake-v3-coins'
  ];

  const OWNED_RECOVERY_KEYS = [
    'electric-snake-clean-owned-skins-v1',
    'electric-snake-clean-owned-skins-v2',
    'electric-snake-owned-skins'
  ];

  function get(key, fallback){
    try{
      const value = STORAGE.getItem(key);
      return value == null ? fallback : value;
    }catch(e){
      return fallback;
    }
  }

  function set(key, value){
    try{ STORAGE.setItem(key, String(value)); }catch(e){}
  }

  function jget(key, fallback){
    try{
      const raw = STORAGE.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(e){
      return fallback;
    }
  }

  function jset(key, value){
    try{ STORAGE.setItem(key, JSON.stringify(value)); }catch(e){}
  }

  function skins(){
    return (typeof SKINS !== 'undefined' && Array.isArray(SKINS) && SKINS.length)
      ? SKINS
      : [{ id:'neon', name:'Neon Pulse', price:0 }];
  }

  function skinIds(){
    return skins().map(s => s && s.id).filter(Boolean);
  }

  function skinById(id){
    return skins().find(s => s.id === id) || skins()[0];
  }

  function cleanCoins(value){
    const n = Number(value);
    if(!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(999999999, Math.floor(n)));
  }

  function cleanOwned(value){
    const valid = skinIds();
    let owned = Array.isArray(value) ? value : ['neon'];
    owned = owned.filter(id => typeof id === 'string' && valid.includes(id));
    owned = Array.from(new Set(owned));
    if(!owned.includes('neon')) owned.unshift('neon');
    return owned;
  }

  function readCoins(){
    let best = 0;

    COIN_MIRRORS.forEach(key => {
      best = Math.max(best, cleanCoins(get(key, '0')));
    });

    if(typeof state !== 'undefined'){
      best = Math.max(best, cleanCoins(state.coins || 0));
    }

    return best;
  }

  function writeCoins(value){
    const coins = cleanCoins(value);

    COIN_MIRRORS.forEach(key => set(key, coins));

    if(typeof state !== 'undefined'){
      state.coins = coins;
    }

    const headerCoins = document.getElementById('coins');
    if(headerCoins) headerCoins.textContent = String(coins);

    const menuCoins = document.getElementById('menuCoins');
    if(menuCoins) menuCoins.textContent = String(coins);

    return coins;
  }

  function isSuspiciousOwnedList(list){
    const valid = skinIds();
    const owned = cleanOwned(list);

    // Old bug often saved every skin as owned. Do not import that as a purchase record.
    return valid.length > 3 && owned.length >= valid.length;
  }

  function readOwned(){
    const pools = [];

    OWNED_RECOVERY_KEYS.forEach(key => {
      const value = jget(key, null);
      if(Array.isArray(value) && !isSuspiciousOwnedList(value)){
        pools.push(...value);
      }
    });

    if(typeof state !== 'undefined' && Array.isArray(state.ownedSkins) && !isSuspiciousOwnedList(state.ownedSkins)){
      pools.push(...state.ownedSkins);
    }

    return cleanOwned(pools.length ? pools : ['neon']);
  }

  function writeOwned(value){
    const owned = cleanOwned(value);

    // Stable ownership mirrors. These are safe because writeOwned is only called after
    // a purchase or a clean sync of already-owned skins.
    jset(KEYS.owned, owned);
    jset('electric-snake-clean-owned-skins-v2', owned);
    jset('electric-snake-owned-skins', owned);

    if(typeof state !== 'undefined'){
      state.ownedSkins = owned.slice();
    }

    return owned;
  }

  function readEquipped(){
    const owned = readOwned();
    const equipped = get(KEYS.equipped, 'neon');
    return owned.includes(equipped) ? equipped : 'neon';
  }

  function writeEquipped(id){
    const owned = readOwned();
    const equipped = owned.includes(id) ? id : 'neon';

    set(KEYS.equipped, equipped);
    set('electric-snake-equipped-skin', equipped);

    if(typeof state !== 'undefined'){
      state.equippedSkin = equipped;
    }

    return equipped;
  }

  function price(skin){
    if(!skin || skin.id === 'neon') return 0;
    return cleanCoins(skin.price || 0);
  }

  function message(text, color, ms){
    if(typeof addCenterMessage === 'function'){
      addCenterMessage(text, color || '#22c55e', ms || 900);
    }
  }

  function syncState(){
    const coins = writeCoins(readCoins());
    const owned = writeOwned(readOwned());
    const equipped = writeEquipped(readEquipped());

    if(typeof state !== 'undefined'){
      state.coins = coins;
      state.ownedSkins = owned.slice();
      state.equippedSkin = equipped;
    }
  }

  function installCleanShop(){
    // Never reset owned skins on a new version. Preserve any non-suspicious clean save.
    writeCoins(readCoins());
    writeOwned(readOwned());
    writeEquipped(readEquipped());
    set(KEYS.installed, '1');
    syncState();
  }

  function removeResetControls(){
    try{
      document.querySelectorAll('#resetSkinOwnershipBtn,#resetFullShopBtn,#simpleResetShop,.simple-shop-reset').forEach(el => el.remove());
      document.querySelectorAll('button').forEach(btn => {
        const t = (btn.textContent || '').toLowerCase();
        if(t.includes('reset skins') || t.includes('reset shop') || t.includes('reset skins + coins')) btn.remove();
      });
    }catch(e){}
  }

  window.saveCoinsV10 = function(){
    writeCoins(typeof state !== 'undefined' ? state.coins : readCoins());
  };

  window.saveCoins = window.saveCoinsV10;

  window.saveSkins = function(){
    // IMPORTANT: Equipping can save equipped skin, but must never rewrite owned skins from stale state.
    writeEquipped(typeof state !== 'undefined' ? (state.equippedSkin || readEquipped()) : readEquipped());
    syncState();
  };

  window.saveSkinEconomyV3 = window.saveSkins;
  window.normalizeOwnedSkinsV3 = syncState;

  window.unlockAllSkinsForTesting = function(){
    console.warn('Deaktiveret: skins skal købes.');
  };

  window.currentSkin = function(){
    syncState();
    return skinById(readEquipped());
  };

  window.skinOwnedV3 = function(skin){
    if(!skin || !skin.id) return false;
    if(skin.id === 'neon') return true;
    return readOwned().includes(skin.id);
  };

  window.buyOrEquipSkinV3 = function(skin){
    if(!skin || !skin.id) return;

    syncState();

    if(!skinIds().includes(skin.id)){
      message(shopText('invalid'), '#f87171', 900);
      return;
    }

    const owned = readOwned();
    const coins = readCoins();
    const cost = price(skin);

    if(owned.includes(skin.id)){
      writeEquipped(skin.id);
      message(shopText('equipped'), '#22c55e', 700);
      if(typeof window.renderShop === 'function') window.renderShop();
      if(typeof updateUI === 'function') updateUI();
      return;
    }

    if(coins < cost){
      message(shopText('lockedNeed') + (cost - coins) + shopText('coins'), '#facc15', 1100);
      if(typeof window.renderShop === 'function') window.renderShop();
      return;
    }

    writeCoins(coins - cost);
    writeOwned([...readOwned(), skin.id]);
    writeEquipped(skin.id);

    message(shopText('bought'), '#22c55e', 1000);

    if(typeof window.renderShop === 'function') window.renderShop();
    if(typeof updateUI === 'function') updateUI();
  };

  window.renderShop = function(){
    const menu = document.getElementById('shopMenu');
    if(!menu) return;

    syncState();
    removeResetControls();

    menu.innerHTML = '';

    const top = document.createElement('div');
    top.className = 'simple-shop-card';
    top.innerHTML = `
      <div class="simple-shop-top">
        <strong>Shop</strong>
        <span>Coins: <b>${readCoins()}</b> 🪙</span>
      </div>
      <div class="ms-v3-shop-note">${shopText('note')}</div>`;
    menu.appendChild(top);

    const preview = document.createElement('div');
    preview.className = 'skin-preview-v3';
    preview.innerHTML = `
      <div class="skin-preview-v3-info">
        <strong id="skinPreviewV3Title">Neon Pulse</strong>
        <span id="skinPreviewV3Meta">Starter-skin</span>
      </div>
      <canvas id="skinPreviewV3Canvas" width="240" height="78"></canvas>`;
    menu.appendChild(preview);

    const list = document.createElement('div');
    list.className = 'skin-list-v3 compact';
    menu.appendChild(list);

    skins().forEach((skin, index) => {
      const owned = readOwned().includes(skin.id);
      const equipped = readEquipped() === skin.id;
      const cost = price(skin);
      const affordable = readCoins() >= cost;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'skin-row-v3 compact';
      btn.classList.add(owned ? 'ms-v3-owned' : 'ms-v3-locked');
      if(equipped) btn.classList.add('ms-v3-equipped', 'equipped');
      btn.setAttribute('data-skin-id', skin.id);

      btn.innerHTML = `
        <span>${skin.name || skin.id}</span>
        <em>${equipped ? shopText('equipped') : owned ? shopText('owned') : affordable ? shopText('buy') + cost + ' 🪙' : shopText('locked') + cost + ' 🪙'}</em>`;

      btn.addEventListener('mouseenter', () => { if(typeof updateSkinPreviewV3 === 'function') updateSkinPreviewV3(skin); });
      btn.addEventListener('focus', () => { if(typeof updateSkinPreviewV3 === 'function') updateSkinPreviewV3(skin); });
      btn.addEventListener('click', e => {
        e.preventDefault();
        if(typeof updateSkinPreviewV3 === 'function') updateSkinPreviewV3(skin);
        window.buyOrEquipSkinV3(skin);
      });

      list.appendChild(btn);

      if(index === 0 && typeof updateSkinPreviewV3 === 'function'){
        setTimeout(() => updateSkinPreviewV3(skin), 0);
      }
    });

    removeResetControls();
  };

  installCleanShop();

  document.addEventListener('DOMContentLoaded', function(){
    syncState();
    removeResetControls();
    if(typeof window.renderShop === 'function') window.renderShop();
  });

  window.addEventListener('beforeunload', syncState);
})();
