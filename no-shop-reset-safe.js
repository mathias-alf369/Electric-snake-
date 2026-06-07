/* Electric Snake LANGUAGE_TOGGLE_V4_BUTTON_FIXED - language.js
   Robust Danish/English toggle in main menu.
   Does not touch gameplay/shop state.
*/
(function(){
  'use strict';

  const KEY = 'electric-snake-language-v1';

  const header = {
    da: '🎮 af MAA Productions 💀 Overlev dødelige hazards 🪙 Saml coins 🎨 Lås sjældne skins op 🏆 Fuldfør daglige challenges ⚡ Mestre Endless Storm',
    en: '🎮 by MAA Productions 💀 Survive deadly hazards 🪙 Collect coins 🎨 Unlock rare skins 🏆 Complete daily challenges ⚡ Master Endless Storm'
  };

  const textMap = {
    en: {
      'Hovedmenu': 'Main Menu',
      '▶ Start spil': '▶ Start Game',
      '📅 Daglige challenges': '📅 Daily Challenges',
      '🏆 Trofæer': '🏆 Trophies',
      '🔊 Lyd': '🔊 Sound',
      '💾 Gem': '💾 Save',
      '← Tilbage': '← Back',
      'Sværhedsgrad': 'Difficulty',
      'Vælg bane': 'Choose level',
      'Start valgt level': 'Start selected level',
      'Master slider styrer spillets lyd. Den gemmes lokalt.': 'The master slider controls game audio and is saved locally.',
      'Brug dette til at flytte coins, skins, trofæer og highscores mellem versioner.': 'Use this to move coins, skins, trophies and highscores between versions.',
      'Vis save-kode': 'Show save code',
      'Kopiér': 'Copy',
      'Importer': 'Import',
      'Game over': 'Game over',
      'Du nåede level': 'You reached level',
      'og scorede': 'and scored',
      'Spil igen': 'Play again',
      'Tilbage til menu': 'Back to menu',
      'Kontrol': 'Controls',
      'Level fremskridt': 'Level progress',
      'Powerup: ingen aktiv': 'Powerup: none active',
      'Ren shop: køb låser op, ejede skins kan vælges, låste skins kan ikke bruges gratis.': 'Clean shop: buying unlocks, owned skins can be equipped, locked skins cannot be used for free.',
      'Ejet — tryk for at vælge': 'Owned — tap to equip',
      'Valgt ✅': 'Equipped ✅',
      'I gang': 'In progress',
      '✅ Fuldført': '✅ Completed'
    },
    da: {
      'Main Menu': 'Hovedmenu',
      '▶ Start Game': '▶ Start spil',
      '📅 Daily Challenges': '📅 Daglige challenges',
      '🏆 Trophies': '🏆 Trofæer',
      '🔊 Sound': '🔊 Lyd',
      '💾 Save': '💾 Gem',
      '← Back': '← Tilbage',
      'Difficulty': 'Sværhedsgrad',
      'Choose level': 'Vælg bane',
      'Start selected level': 'Start valgt level',
      'The master slider controls game audio and is saved locally.': 'Master slider styrer spillets lyd. Den gemmes lokalt.',
      'Use this to move coins, skins, trophies and highscores between versions.': 'Brug dette til at flytte coins, skins, trofæer og highscores mellem versioner.',
      'Show save code': 'Vis save-kode',
      'Copy': 'Kopiér',
      'Import': 'Importer',
      'Play again': 'Spil igen',
      'Back to menu': 'Tilbage til menu',
      'Controls': 'Kontrol',
      'Level progress': 'Level fremskridt',
      'Powerup: none active': 'Powerup: ingen aktiv',
      'Clean shop: buying unlocks, owned skins can be equipped, locked skins cannot be used for free.': 'Ren shop: køb låser op, ejede skins kan vælges, låste skins kan ikke bruges gratis.',
      'Owned — tap to equip': 'Ejet — tryk for at vælge',
      'Equipped ✅': 'Valgt ✅',
      'In progress': 'I gang',
      '✅ Completed': '✅ Fuldført'
    }
  };

  const dailyMap = {
    da: {
      'Score 25 points': 'Score 25 point',
      'Score 50 points': 'Score 50 point',
      'Score 75 points in Endless Storm': 'Score 75 point i Endless Storm',
      'Score 125 points in Endless Storm': 'Score 125 point i Endless Storm',
      'Reach 5x combo': 'Nå 5x combo',
      'Reach 10x combo': 'Nå 10x combo',
      'Reach 20x combo': 'Nå 20x combo',
      'Survive 60 seconds': 'Overlev 60 sekunder',
      'Survive 60 seconds in Endless Storm': 'Overlev 60 sekunder i Endless Storm',
      'Collect 5 powerups': 'Saml 5 powerups',
      'Collect 50 coins': 'Saml 50 coins',
      'Play 3 games': 'Spil 3 runder',
      'Get 20 points with X2 active': 'Få 20 point mens X2 er aktiv',
      'Use Shield 3 times': 'Brug skjold 3 gange',
      'Get 8 points with Magnet active': 'Få 8 point mens magnet er aktiv'
    },
    en: {
      'Score 25 point': 'Score 25 points',
      'Score 50 point': 'Score 50 points',
      'Score 75 point i Endless Storm': 'Score 75 points in Endless Storm',
      'Score 125 point i Endless Storm': 'Score 125 points in Endless Storm',
      'Nå 5x combo': 'Reach 5x combo',
      'Nå 10x combo': 'Reach 10x combo',
      'Nå 20x combo': 'Reach 20x combo',
      'Overlev 60 sekunder': 'Survive 60 seconds',
      'Overlev 60 sekunder i Endless Storm': 'Survive 60 seconds in Endless Storm',
      'Saml 5 powerups': 'Collect 5 powerups',
      'Saml 50 coins': 'Collect 50 coins',
      'Spil 3 runder': 'Play 3 games',
      'Få 20 point mens X2 er aktiv': 'Get 20 points with X2 active',
      'Brug skjold 3 gange': 'Use Shield 3 times',
      'Få 8 point mens magnet er aktiv': 'Get 8 points with Magnet active'
    }
  };

  function getLang(){
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'da';
  }

  function setLang(lang){
    localStorage.setItem(KEY, lang === 'en' ? 'en' : 'da');
  }

  function updateButton(){
    const btn = document.getElementById('languageToggleBtn');
    if(!btn) return;
    btn.dataset.noTranslate = '1';
    
    const flag = document.getElementById('langFlagIcon');
    const text = document.getElementById('langFlagText');

    if(flag){
      flag.src = getLang() === 'da'
        ? 'https://flagcdn.com/w40/dk.png'
        : 'https://flagcdn.com/w40/gb.png';
    }

    if(text){
      text.textContent = getLang() === 'da'
        ? 'Dansk / English'
        : 'English / Dansk';
    }

  }

  function isInsideNoTranslate(node){
    let el = node.parentElement;
    while(el){
      if(el.dataset && el.dataset.noTranslate === '1') return true;
      el = el.parentElement;
    }
    return false;
  }

  function translateTextNodes(root, lang){
    const maps = [textMap[lang] || {}, dailyMap[lang] || {}];
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      if(isInsideNoTranslate(node)) return;
      const raw = node.nodeValue;
      const trimmed = raw.trim();
      if(!trimmed) return;

      for(const map of maps){
        if(map[trimmed]){
          node.nodeValue = raw.replace(trimmed, map[trimmed]);
          return;
        }
      }
    });
  }


  function translateShop(lang){
    const shop = document.getElementById('shopMenu');
    if(!shop) return;

    const note = shop.querySelector('.ms-v3-shop-note, .simple-shop-card div[style], .simple-shop-card');
    if(note && note.textContent.includes('køb låser op')){
      note.textContent = lang === 'en'
        ? 'Clean shop: buying unlocks, owned skins can be equipped, locked skins cannot be used for free.'
        : 'Ren shop: køb låser op, ejede skins kan vælges, låste skins kan ikke bruges gratis.';
    } else if(note && note.textContent.includes('buying unlocks')){
      note.textContent = lang === 'da'
        ? 'Ren shop: køb låser op, ejede skins kan vælges, låste skins kan ikke bruges gratis.'
        : 'Clean shop: buying unlocks, owned skins can be equipped, locked skins cannot be used for free.';
    }

    shop.querySelectorAll('.skin-row-v3 em').forEach(em => {
      const text = em.textContent.trim();

      if(lang === 'en'){
        if(text === 'Valgt ✅') em.textContent = 'Equipped ✅';
        else if(text === 'Ejet — tryk for at vælge') em.textContent = 'Owned — tap to equip';
        else if(text.startsWith('Køb ')) em.textContent = text.replace(/^Køb /, 'Buy ');
        else if(text.startsWith('Låst ')) em.textContent = text.replace(/^Låst /, 'Locked ');
        else if(text.includes('Låst — mangler')) em.textContent = text.replace('Låst — mangler', 'Locked — need');
      } else {
        if(text === 'Equipped ✅') em.textContent = 'Valgt ✅';
        else if(text === 'Owned — tap to equip') em.textContent = 'Ejet — tryk for at vælge';
        else if(text.startsWith('Buy ')) em.textContent = text.replace(/^Buy /, 'Køb ');
        else if(text.startsWith('Locked ')) em.textContent = text.replace(/^Locked /, 'Låst ');
        else if(text.includes('Locked — need')) em.textContent = text.replace('Locked — need', 'Låst — mangler');
      }
    });
  }


  function applyLanguage(){
    const lang = getLang();
    document.documentElement.lang = lang;

    const headerText = document.getElementById('dynamicHeaderText');
    if(headerText) headerText.innerHTML = header[lang];

    translateTextNodes(document.body, lang);
    translateShop(lang);
    updateButton();
  }

  function bindButton(){
    const btn = document.getElementById('languageToggleBtn');
    if(!btn) return;
    btn.dataset.noTranslate = '1';

    // onclick is used deliberately so it survives re-render/text updates.
    btn.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      setLang(getLang() === 'da' ? 'en' : 'da');
      if(typeof window.renderShop === 'function') window.renderShop();
      applyLanguage();
      return false;
    };

    updateButton();
  }

  function wrapRenderers(){
    if(window.__electricSnakeLanguageWrappedV4) return;
    window.__electricSnakeLanguageWrappedV4 = true;

    const oldRenderShop = window.renderShop;
    if(typeof oldRenderShop === 'function'){
      window.renderShop = function(){
        const result = oldRenderShop.apply(this, arguments);
        setTimeout(function(){ bindButton(); applyLanguage(); translateShop(getLang()); }, 0);
        return result;
      };
    }

    const oldFinalOpenMenu = window.finalOpenMenu;
    if(typeof oldFinalOpenMenu === 'function'){
      window.finalOpenMenu = function(){
        const result = oldFinalOpenMenu.apply(this, arguments);
        setTimeout(function(){ bindButton(); applyLanguage(); translateShop(getLang()); }, 0);
        return result;
      };
    }
  }

  function init(){
    wrapRenderers();
    bindButton();
    applyLanguage();
    setTimeout(function(){ bindButton(); applyLanguage(); }, 100);
    setTimeout(function(){ bindButton(); applyLanguage(); }, 500);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.electricSnakeApplyLanguage = applyLanguage;
})();
