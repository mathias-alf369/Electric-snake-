/* Electric Snake MODULAR_CLEAN_V1 - core.js
   Split from the old single-file build.
   Keep edits isolated to this system.
*/

(function(){
  if(window.__ES_STORAGE__) return;
  const memory = Object.create(null);
  window.__ES_STORAGE__ = (function(){
    try{
      const real = window.localStorage;
      const testKey = '__electric_snake_storage_test__';
      real.setItem(testKey, '1');
      real.removeItem(testKey);
      return real;
    }catch(e){
      return {
        getItem: function(key){ key = String(key); return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null; },
        setItem: function(key, value){ memory[String(key)] = String(value); },
        removeItem: function(key){ delete memory[String(key)]; },
        clear: function(){ Object.keys(memory).forEach(function(key){ delete memory[key]; }); },
        key: function(index){ return Object.keys(memory)[index] || null; },
        get length(){ return Object.keys(memory).length; }
      };
    }
  })();
})();

/* ---- extracted script block ---- */

// ============================================================
  // STABLE MASTER V1 DEV GUIDE
  // ============================================================
  // Build future versions from this file.
  //
  // SEARCH MAP:
  // - MENU:                 search "startOverlay"
  // - DAILY CHALLENGES:     search "DAILY" and keep key electric-snake-dailies-stable-v1
  // - TROPHIES:             search "const TROPHIES = ["
  // - TROPHY PROGRESS:      search "function trophyProgress"
  // - TROPHY UNLOCKS:       search "function checkTrophies"
  // - COMBO REWARDS:        search "function comboBonusCoins"
  // - COMBO TIMER:          search "registerEndlessCombo" / "updateEndlessComboTimer"
  // - POWERUPS:             search "function activatePowerup"
  // - HAZARD SPAWNS:        search "spawnSingleBomb" / "spawnFlame"
  // - MAIN GAME LOOP:       search "function tick"
  // - AUDIO:                search "playDailyCompleteSound" / "audio"
  //
  // RULES:
  // 1) Do not change localStorage keys unless doing a planned migration.
  // 2) Do not add daily reset/sanitizer code unless absolutely needed.
  // 3) Combo tiers: x1-x2=1, x3-x4=2, x5-x6=3, x7-x9=4, x10+=5.
  // 4) X2 doubles the final reward.
  // 5) Syntax-check JS after every patch.
  //
(() => {
  // ============================================================
  // OPTIMIZE V1: performance/stability pass only — no new features
  // - Cached grid background to reduce canvas work
  // - Faster random cell blocking with Set lookups
  // - Lighter high-combo aura rendering on long snakes
  // ============================================================
  /*
   * ELECTRIC SNAKE — CLEAN MASTER
   * ------------------------------------------------------------
   * This file keeps the game in one HTML file for easy sharing,
   * but the JavaScript is divided with clear section markers.
   *
   * Recommended edit order from now on:
   * 1) SETTINGS / constants
   * 2) SKINS
   * 3) TROPHIES
   * 4) POWERUPS
   * 5) HAZARDS
   * 6) DRAWING / UI
   *
   * Rule: change only one system per version.
   */



  // ============================================================
  // 0. DEV MAP / SAFE EDIT GUIDE
  // ============================================================
  // This block is only for future editing. It does not change gameplay.
  // When adding new features, search one of these exact labels first.
  //
  // FAST EDIT MAP:
  // - Add/change skins:                search "const SKINS = ["
  // - Add/change trophies:             search "const TROPHIES = ["
  // - Trophy unlock rules:             search "function checkTrophies()"
  // - Trophy progress bars:            search "function trophyProgress(t)"
  // - Powerup types/spawn:             search "function spawnPowerup()"
  // - Powerup activation effects:      search "function activatePowerup(type)"
  // - Endless combo rules:             search "function comboBonusCoins(combo)"
  // - Endless combo UI:                search "function drawEndlessComboUI()"
  // - Bomb spawning:                   search "function spawnSingleBomb()"
  // - Laser/arrow spawning + damage:   search "function fireArrow(id)"
  // - Flame spawning/fairness:         search "function spawnFlame()"
  // - Snake speed:                     search "function speed()"
  // - Main movement/collision loop:    search "function tick()"
  // - Draw snake skins:                search "function drawSkinSegment"
  // - Touch controls/swipe:            search "TOUCH CONTROLS"
  //
  // SAFE PATCH RULES:
  // 1) Copy this file before every edit.
  // 2) Change only ONE system per version.
  // 3) After editing, syntax-check only the JS inside <script>.
  // 4) Never replace the whole SKINS or TROPHIES list unless intended.
  // 5) Keep this as a single HTML file unless we later build a real app.
  //
  // CURRENT IMPORTANT LOCALSTORAGE KEYS:
  // electric-snake-v3-best, electric-snake-endless-best,
  // electric-snake-coins, electric-snake-skin-coins,
  // electric-snake-trophies, electric-snake-owned-skins,
  // electric-snake-equipped-skin, electric-snake-difficulty,
  // electric-snake-unlocked-normal, electric-snake-unlocked-hard,
  // electric-snake-powerups-collected, electric-snake-half-removed-total.

  // ============================================================
  // 1. CANVAS + CORE CONSTANTS
  // ============================================================
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const GRID = 16;
  const TILE = canvas.width / GRID;
  const NORMAL_POINTS_PER_LEVEL = 25;
  const HARD_POINTS_PER_LEVEL = 30;
  const ENDLESS_LEVEL = 11;
  const ENDLESS_NAME = 'Endless Storm';

  const LEVEL_UNLOCK_KEYS_V1 = {
    normal: 'electric-snake-level-unlock-normal-v1',
    hard: 'electric-snake-level-unlock-hard-v1'
  };

  function cleanUnlockedLevelV1(value){
    const n = Number(value);
    if(!Number.isFinite(n)) return 1;
    return Math.max(1, Math.min(ENDLESS_LEVEL, Math.floor(n)));
  }

  // Quick tuning notes:
  // - Normal level length: NORMAL_POINTS_PER_LEVEL
  // - Hard level length: HARD_POINTS_PER_LEVEL
  // - Endless unlock/menu slot: ENDLESS_LEVEL
  // - Combo timing/rewards: search for "ENDLESS STORM COMBO SYSTEM"

  const $ = id => document.getElementById(id);

  // Optional debug info for future testing in the browser console.
  // Example: type ElectricSnakeDev.version or ElectricSnakeDev.sections.
  window.ElectricSnakeDev = {
    version: 'DEV_FRIENDLY_MASTER',
    basedOn: 'electric_snake_CLEAN_MASTER_REFACTORED.html',
    safeEditRule: 'Change one system per version and syntax-check the JS.',
    sections: ['settings','state','skins','trophies','powerups','hazards','combo','drawing','touch']
  };


  // ============================================================
  // 2. GAME STATE
  // ============================================================
  const state = {
    snake: [],
    dir: {x:1,y:0},
    nextDir: {x:1,y:0},
    food: {x:11,y:8},
    bombs: [],
    explosions: [],
    level: 1,
    progress: 0,
    endlessPoints: 0,
    endlessCombo: 0,
    bestEndlessCombo: Number(window.__ES_STORAGE__.getItem('electric-snake-best-endless-combo') || 0),
    currentRunBestCombo: 0,
    endlessComboUntil: 0,
    lastComboBonus: 0,
    comboPopups: [],
    centerMessages: [],
    score: 0,
    best: Number(window.__ES_STORAGE__.getItem('electric-snake-v3-best') || 0),
    bestEndless: Number(window.__ES_STORAGE__.getItem('electric-snake-endless-best') || 0),
    running: false,
    gameOver: false,
    loop: null,
    audioCtx: null,
    audioMaster: null,
    hazardOsc: null,
    hazardGain: null,
    flameOsc: null,
    flameGain: null,
    audioEnabled: false,
    audioMuted: window.__ES_STORAGE__.getItem('electric-snake-audio-muted') === '1',
    audioMasterVolume: Number(window.__ES_STORAGE__.getItem('electric-snake-audio-volume') || 0.18),
    lastTurnSoundAt: 0,
    lastFoodSoundAt: 0,
    lastFlameCrackleAt: 0,
    bombTimeouts: [],
    bombSpawnerTimeout: null,
    arrows: [],
    arrowSpawnerTimeout: null,
    arrowTimeouts: [],
    selectedLevel: 1,
    unlockedLevel: Number(window.__ES_STORAGE__.getItem('electric-snake-v8-unlocked') || 1),
    powerup: null,
    powerupTimer: null,
    slowmoUntil: 0,
    comboBoostUntil: 0,
    magnetUntil: 0,
    shieldActive: false,
    shieldStartTime: 0,
    bestShieldHoldSeconds: Number(window.__ES_STORAGE__.getItem('electric-snake-best-shield-hold') || 0),
    doublePointsUntil: 0,
    doublePointsThisRun: 0,
    hitFlashUntil: 0,
    hitFlashType: '',
    screenShakeUntil: 0,
    bestDoublePointsRun: Number(window.__ES_STORAGE__.getItem('electric-snake-best-double-points') || 0),
    magnetPointsThisRun: 0,
    slowmoPointsThisRun: 0,
    bestMagnetPoints: Number(window.__ES_STORAGE__.getItem('electric-snake-best-magnet-points') || 0),
    bestSlowmoPoints: Number(window.__ES_STORAGE__.getItem('electric-snake-best-slowmo-points') || 0),
    totalHalfRemoved: Number(window.__ES_STORAGE__.getItem('electric-snake-half-removed-total') || 0),
    totalPowerupsCollected: Number(window.__ES_STORAGE__.getItem('electric-snake-powerups-collected') || 0),
    powerupsThisRunTypes: [],
    flames: [],
    flameSpawnerTimeout: null,
    flameTimeouts: [],
    coins: Number(window.__ES_STORAGE__.getItem('electric-snake-coins') || window.__ES_STORAGE__.getItem('electric-snake-v3-coins') || 0),
    skinCoins: JSON.parse(window.__ES_STORAGE__.getItem('electric-snake-skin-coins') || '{}'),
    unlockedTrophies: JSON.parse(window.__ES_STORAGE__.getItem('electric-snake-trophies') || '[]'),
    perfectRunActive: false,
    runStartTime: Date.now(),
    damagedThisLevel: false,
    ownedSkins: JSON.parse(window.__ES_STORAGE__.getItem('electric-snake-owned-skins') || '["neon"]'),
    equippedSkin: window.__ES_STORAGE__.getItem('electric-snake-equipped-skin') || 'neon',
    difficulty: window.__ES_STORAGE__.getItem('electric-snake-difficulty') || 'normal',
    unlockedNormal: cleanUnlockedLevelV1(window.__ES_STORAGE__.getItem(LEVEL_UNLOCK_KEYS_V1.normal) || 1),
    unlockedHard: cleanUnlockedLevelV1(window.__ES_STORAGE__.getItem(LEVEL_UNLOCK_KEYS_V1.hard) || 1)
  };
  // LEVEL_UNLOCK_V1: levels now unlock one by one. Old all-unlocked keys are ignored.
// Cleanup obsolete Endless trophy ids from before combo rebalance.
  const OBSOLETE_TROPHIES = ['endless_30','endless_40'];
  if(state.unlockedTrophies.some(id => OBSOLETE_TROPHIES.includes(id))){
    state.unlockedTrophies = state.unlockedTrophies.filter(id => !OBSOLETE_TROPHIES.includes(id));
    window.__ES_STORAGE__.setItem('electric-snake-trophies', JSON.stringify(state.unlockedTrophies));
  }

  // Reset old incorrectly unlocked Perfect Run trophy once.
  // From now on it only unlocks after clearing levels 1-10 in one continuous run.
  if(!window.__ES_STORAGE__.getItem('electric-snake-perfect-run-v2-earned') && state.unlockedTrophies.includes('perfect_run')){
    state.unlockedTrophies = state.unlockedTrophies.filter(id => id !== 'perfect_run');
    window.__ES_STORAGE__.setItem('electric-snake-trophies', JSON.stringify(state.unlockedTrophies));
  }



  // TROPHY REBALANCE CLEANUP V1
  try{
    const oldTrophies = ['endless_50','endless_100','endless_150','combo_10','combo_20'];
    if(Array.isArray(state.unlockedTrophies)){
      const before = state.unlockedTrophies.length;
      state.unlockedTrophies = state.unlockedTrophies.filter(id => !oldTrophies.includes(id));
      if(state.unlockedTrophies.length !== before){
        window.__ES_STORAGE__.setItem('electric-snake-trophies', JSON.stringify(state.unlockedTrophies));
      }
    }
  }catch(e){}


  // TROPHY UI ID CLEANUP V1
  try{
    const obsoleteTrophyIds = ['endless_50','endless_100','endless_150','combo_10','combo_20'];
    if(Array.isArray(state.unlockedTrophies)){
      const before = state.unlockedTrophies.length;
      state.unlockedTrophies = state.unlockedTrophies.filter(id => !obsoleteTrophyIds.includes(id));
      if(state.unlockedTrophies.length !== before) saveTrophies();
    }
  }catch(e){}


  // ============================================================
  // COIN SAVE FIX ONLY V10
  // Stable coin persistence. Does not touch menu/start flow.
  // ============================================================

  const COIN_SAVE_KEY_V10 = 'electric-snake-coins';
  const SIMPLE_COIN_SAVE_KEY_V10 = 'electric-snake-simple-coins-v2';

  function readCoinNumberV10(key){
    const n = Number(window.__ES_STORAGE__.getItem(key));
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  }

  function loadCoinsV10(){
    try{
      const keys = [
        SIMPLE_COIN_SAVE_KEY_V10,
        COIN_SAVE_KEY_V10,
        'electric-snake-v3-coins',
        'electric-snake-total-coins',
        'electric-snake-coin-balance'
      ];

      let best = 0;
      keys.forEach(key => {
        best = Math.max(best, readCoinNumberV10(key));
      });

      state.coins = best;
      mirrorCoinsV10(best);
    }catch(e){}
  }

  function mirrorCoinsV10(value){
    try{
      const coins = Math.max(0, Math.floor(Number(value) || 0));
      state.coins = coins;

      // One balance mirrored to every system that still exists in the old file.
      window.__ES_STORAGE__.setItem(SIMPLE_COIN_SAVE_KEY_V10, String(coins));
      window.__ES_STORAGE__.setItem(COIN_SAVE_KEY_V10, String(coins));
      window.__ES_STORAGE__.setItem('electric-snake-v3-coins', String(coins));

      const coinEl = document.getElementById('coins');
      if(coinEl) coinEl.textContent = String(coins);

      const menuCoinEl = document.getElementById('menuCoins');
      if(menuCoinEl) menuCoinEl.textContent = String(coins);

      return coins;
    }catch(e){
      return Number(value || 0);
    }
  }

  function saveCoinsV10(){
    try{
      mirrorCoinsV10(state.coins || 0);
    }catch(e){}
  }

  loadCoinsV10();

// ============================================================
  // 3. GRID HELPERS + GEOMETRY
  // ============================================================
  function same(a,b){ return a.x === b.x && a.y === b.y; }

  function speed(){
    // Slightly slower pacing, especially in high levels / Endless Storm.
    const lenFactor = Math.max(0, state.snake.length - 4) * 3;
    const scoreFactor = Math.max(0, state.score) * 0.35;
    const levelFactor = (state.level - 1) * 4.5;
    const base = Math.max(110, 180 - lenFactor - scoreFactor - levelFactor);
    if(Date.now() < state.slowmoUntil) return base * 2;
    return base;
  }

  function cellKey(c){ return c.x + ',' + c.y; }

  function randomCell(extraBlocked = []){
    // OptimizeV1: use a Set for blocked cells instead of scanning a large array every attempt.
    const blocked = new Set();
    (state.snake || []).forEach(c => blocked.add(cellKey(c)));
    (state.bombs || []).forEach(c => blocked.add(cellKey(c)));
    (state.flames || []).forEach(f => flameCells(f).forEach(c => blocked.add(cellKey(c))));
    (state.arrows || []).forEach(a => arrowCells(a).forEach(c => blocked.add(cellKey(c))));
    (extraBlocked || []).forEach(c => blocked.add(cellKey(c)));
    if(state.powerup) blocked.add(cellKey(state.powerup));

    for(let tries = 0; tries < 500; tries++){
      const p = {x: Math.floor(Math.random()*GRID), y: Math.floor(Math.random()*GRID)};
      if(!blocked.has(cellKey(p))) return p;
    }

    // Fallback: deterministic scan, so spawning never loops forever if the board gets crowded.
    for(let y = 0; y < GRID; y++){
      for(let x = 0; x < GRID; x++){
        const p = {x, y};
        if(!blocked.has(cellKey(p))) return p;
      }
    }

    return {x:0, y:0};
  }

  function wrapX(x){
    if(x < 0) return GRID - 1;
    if(x >= GRID) return 0;
    return x;
  }

  function wrapY(y){
    if(y < 0) return GRID - 1;
    if(y >= GRID) return 0;
    return y;
  }

  function arrowCells(arrow){
    const cells = [];
    if(arrow.dir === 'right' || arrow.dir === 'left'){
      for(let x = 0; x < GRID; x++){
        cells.push({x, y: arrow.y});
      }
    } else {
      for(let y = 0; y < GRID; y++){
        cells.push({x: arrow.x, y});
      }
    }
    return cells;
  }

  function activeArrowCells(arrow){
    const cells = arrowCells(arrow);
    if(!arrow || arrow.phase !== 'flying') return [];

    const progress = Math.max(1, Math.min(cells.length, arrow.progress || 1));
    let startIndex = 0;
    let endIndex = cells.length - 1;

    if(arrow.dir === 'right' || arrow.dir === 'down'){
      endIndex = Math.min(cells.length - 1, progress - 1);
    } else {
      startIndex = Math.max(0, cells.length - progress);
    }

    return cells.slice(startIndex, endIndex + 1);
  }

  function cellInArrowZone(cell, arrow){
    // Damage follows the visible flying laser only.
    // Warning lines are only warnings and do not hurt.
    return activeArrowCells(arrow).some(c => same(c, cell));
  }

  function flameCells(flame){
    const cells = [];
    const len = flame.length || 5;
    if(flame.dir === 'right'){
      for(let i = 0; i < len; i++) cells.push({x: wrapX(flame.x + i), y: flame.y});
    } else if(flame.dir === 'left'){
      for(let i = 0; i < len; i++) cells.push({x: wrapX(flame.x - i), y: flame.y});
    } else if(flame.dir === 'down'){
      for(let i = 0; i < len; i++) cells.push({x: flame.x, y: wrapY(flame.y + i)});
    } else {
      for(let i = 0; i < len; i++) cells.push({x: flame.x, y: wrapY(flame.y - i)});
    }
    return cells;
  }

  function cellInFlameZone(cell, flame){
    return flameCells(flame).some(c => same(c, cell));
  }


  // ============================================================
  // 4. DAMAGE + SHIELD HANDLING
  // ============================================================
  function triggerHitFeedback(type){
    state.hitFlashType = type || 'body';
    state.hitFlashUntil = Date.now() + (type === 'head' ? 380 : 260);
    state.screenShakeUntil = Date.now() + (type === 'shield' ? 140 : 220);
  }

  function drawHitFeedback(){
    const now = Date.now();
    if(now >= (state.hitFlashUntil || 0)) return;
    const left = Math.max(0, state.hitFlashUntil - now);
    const alpha = Math.min(0.22, left / 1200);
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.fillStyle = state.hitFlashType === 'shield'
      ? 'rgba(250,204,21,' + alpha + ')'
      : 'rgba(239,68,68,' + alpha + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function applySegmentDamage(hitIndex){
    if(hitIndex === 0){
      // Shield now protects both your life AND your Endless combo.
      // Only reset combo if the head hit is not shielded.
      if(consumeShield()){
        triggerHitFeedback('shield');
        addCenterMessage('SHIELD SAVED COMBO 🛡⚡', '#facc15', 900);
        playShieldSound();
        return 'shield';
      }
      if(isEndlessLevel()) resetEndlessCombo();
      triggerHitFeedback('head');
      return 'head';
    }
    if(hitIndex > 0){
      // Shield now protects against body/tail damage too.
      // Before this patch, shield only saved the head from direct hits.
      if(consumeShield()){
        triggerHitFeedback('shield');
        addCenterMessage('SHIELD SAVED YOU 🛡', '#facc15', 850);
        playShieldSound();
        return 'shield';
      }

      triggerHitFeedback('body');
      if(isEndlessLevel()) resetEndlessCombo();
      state.damagedThisLevel = true;
      const removed = state.snake.length - hitIndex;
      state.snake = state.snake.slice(0, hitIndex);

      // Body damage penalty is fair: 1 point per lost tail segment.
      const penalty = Math.max(1, removed);
      if(isEndlessLevel()){
        state.endlessPoints = Math.max(0, (state.endlessPoints || 0) - penalty);
        state.progress = state.endlessPoints;
        addRewardPopup('-' + penalty + ' 💀', 10);
        addCenterMessage('DAMAGE -' + penalty + ' 💀', '#ef4444', 760);
        playDamageSound();
      } else {
        state.progress = Math.max(0, state.progress - removed);
        addRewardPopup('-' + removed + ' 💀', 1);
      }
      state.score = Math.max(0, state.score - penalty);

      if(state.running && !state.gameOver) startLoop();
      if(state.snake.length < 1) return 'head';
      return 'body';
    }
    return 'none';
  }




  // ============================================================
  // 5. ENDLESS STORM COMBO SYSTEM
  // ============================================================
  function resetEndlessCombo(){
    const lostCombo = state.endlessCombo || 0;
    if(typeof isEndlessLevel === 'function' && isEndlessLevel() && lostCombo >= 5 && state.running && !state.gameOver){
      addCenterMessage('COMBO LOST 💀', '#ef4444', 900);
      playComboLostSound();
    }
    state.endlessCombo = 0;
    state.endlessComboUntil = 0;
    state.lastComboBonus = 0;
    state.endlessComboWindow = 0;
    state.comboLastTimerTick = 0;
  }

  function comboBonusCoins(combo){
    // Tiered combo reward system:
    // x1-x2 = 1 point
    // x3-x4 = 2 points
    // x5-x6 = 3 points
    // x7-x9 = 4 points
    // x10+ = 5 points
    if(combo >= 10) return 5;
    if(combo >= 7) return 4;
    if(combo >= 5) return 3;
    if(combo >= 3) return 2;
    return 1;
  }

  function updateEndlessComboTimer(){
    if(!isEndlessLevel()) return;
    if(state.endlessCombo > 0){
      const now = Date.now();
      const last = state.comboLastTimerTick || now;

      // Slow-mo also slows the active Endless combo countdown.
      // While slow-mo is active, the combo timer drains at roughly half speed.
      if(now > last && now < state.slowmoUntil){
        state.endlessComboUntil += Math.round((now - last) * 0.5);
      }

      state.comboLastTimerTick = now;

      if(now > state.endlessComboUntil){
        resetEndlessCombo();
      }
    }
  }

  function registerEndlessCombo(){
    if(!isEndlessLevel()) return 0;
    const now = Date.now();
    if(!state.endlessCombo || now > state.endlessComboUntil){
      state.endlessCombo = 1;
    } else {
      state.endlessCombo += 1;
    playComboTierSound(state.endlessCombo);
    }
    const comboWindow = Date.now() < (state.comboBoostUntil || 0) ? 8000 : 4000;
    state.endlessComboWindow = comboWindow;
    state.endlessComboUntil = now + comboWindow;
    state.currentRunBestCombo = Math.max(state.currentRunBestCombo || 0, state.endlessCombo);
    if(typeof dailyFinalUpdate === 'function') dailyFinalUpdate('combo', state.currentRunBestCombo);
    if(typeof dailyV5Update === 'function') dailyV5Update('combo', state.currentRunBestCombo);
    if(typeof dailyFixedUpdate === 'function') dailyFixedUpdate('combo', state.currentRunBestCombo);
    if(typeof updateDaily === 'function') updateDaily('combo', state.currentRunBestCombo);
    if(state.endlessCombo > (state.bestEndlessCombo || 0)){
      state.bestEndlessCombo = state.endlessCombo;
      window.__ES_STORAGE__.setItem('electric-snake-best-endless-combo', String(state.bestEndlessCombo));
    }
    state.comboLastTimerTick = now;
    state.lastComboBonus = comboBonusCoins(state.endlessCombo);
    if([3,5,10,20,30,50].includes(state.endlessCombo)){
      addCenterMessage('x' + state.endlessCombo + ' COMBO ⚡', state.endlessCombo >= 10 ? '#facc15' : '#22d3ee', 900);
      playComboVoice(state.endlessCombo);
    }
    return state.lastComboBonus;
  }


  // ============================================================
  // 6. LEVEL / ENDLESS SETTINGS
  // ============================================================
  function isEndlessLevel(){
    return state.level >= ENDLESS_LEVEL;
  }

  function pointsPerLevel(){
    if(isEndlessLevel()) return Infinity;
    return state.difficulty === 'hard' ? HARD_POINTS_PER_LEVEL : NORMAL_POINTS_PER_LEVEL;
  }

  function endlessBombDelay(){
    const steps = Math.floor((state.endlessPoints || 0) / 10);
    return Math.max(700, Math.round(3000 / Math.pow(1.2, steps)));
  }

  function endlessPowerupDelay(){
    const steps = Math.floor((state.endlessPoints || 0) / 10);
    return Math.max(6000, Math.round(25000 / Math.pow(1.2, steps)));
  }


  function initLevelUnlockV1(){
    state.unlockedNormal = cleanUnlockedLevelV1(state.unlockedNormal);
    state.unlockedHard = cleanUnlockedLevelV1(state.unlockedHard);

    if(!window.__ES_STORAGE__.getItem(LEVEL_UNLOCK_KEYS_V1.normal)){
      window.__ES_STORAGE__.setItem(LEVEL_UNLOCK_KEYS_V1.normal, String(state.unlockedNormal));
    }

    if(!window.__ES_STORAGE__.getItem(LEVEL_UNLOCK_KEYS_V1.hard)){
      window.__ES_STORAGE__.setItem(LEVEL_UNLOCK_KEYS_V1.hard, String(state.unlockedHard));
    }

    if(state.selectedLevel > currentUnlocked()){
      state.selectedLevel = currentUnlocked();
    }
  }

  function currentUnlocked(){
    return state.difficulty === 'hard' ? state.unlockedHard : state.unlockedNormal;
  }

  function setCurrentUnlocked(val){
    const clean = cleanUnlockedLevelV1(val);

    if(state.difficulty === 'hard'){
      state.unlockedHard = clean;
      window.__ES_STORAGE__.setItem(LEVEL_UNLOCK_KEYS_V1.hard, String(clean));
      window.__ES_STORAGE__.setItem('electric-snake-unlocked-hard', String(clean));
    } else {
      state.unlockedNormal = clean;
      window.__ES_STORAGE__.setItem(LEVEL_UNLOCK_KEYS_V1.normal, String(clean));
      window.__ES_STORAGE__.setItem('electric-snake-unlocked-normal', String(clean));
    }
  }

  function saveDifficulty(){
    window.__ES_STORAGE__.setItem('electric-snake-difficulty', state.difficulty);
  }

  function renderDifficultyMenu(){
    const menu = $('difficultyMenu');
    if(!menu) return;
    menu.innerHTML = '';

    const options = [
      {key:'normal', label:'Normal'},
      {key:'hard', label:'Svær'}
    ];

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'difficulty-btn';
      btn.textContent = opt.key === 'hard' ? 'Svær (30)' : 'Normal (25)';
      if(opt.key === state.difficulty){
        btn.style.background = 'var(--cyan)';
        btn.style.color = '#052739';
      }
      btn.addEventListener('click', () => {
        state.difficulty = opt.key;
        if(state.selectedLevel > currentUnlocked()) state.selectedLevel = currentUnlocked();
        saveDifficulty();
        updateUI();
        renderDifficultyMenu();
        renderLevelMenu();
      });
      menu.appendChild(btn);
    });
  }


  // ============================================================
  // 7. SAVE DATA / LOCALSTORAGE HELPERS
  // ============================================================
  function saveCoins(){
    saveCoinsV10();
    if(typeof mirrorCoinsV10 === 'function') mirrorCoinsV10(state.coins || 0);
  }

  function saveSkinCoins(){
    window.__ES_STORAGE__.setItem('electric-snake-skin-coins', JSON.stringify(state.skinCoins || {}));
  }

  function addCoinsForValgtSkin(amount){
    const skinId = state.equippedSkin || 'neon';
    if(!state.skinCoins) state.skinCoins = {};
    state.skinCoins[skinId] = (state.skinCoins[skinId] || 0) + amount;
    saveSkinCoins();
  }

  function skinCoinProgress(skinId){
    return (state.skinCoins && state.skinCoins[skinId]) ? state.skinCoins[skinId] : 0;
  }

  function saveUnlockedLevelUnused(){
    window.__ES_STORAGE__.setItem('electric-snake-v8-unlocked', String(currentUnlocked()));
  }


  // ============================================================
  // 8. LEVEL SETUP + MENUS
  // ============================================================
  function buildLevelStartSnake(level){
    // Endless Storm starter bevidst kortere: 3 segmenter.
    const baseLength = level >= ENDLESS_LEVEL ? 3 : Math.min(4 + Math.floor((level - 1) / 2), 10);
    const startX = 5;
    const y = 8;
    const parts = [];
    for(let i = 0; i < baseLength; i++){
      parts.push({x: startX - i, y});
    }
    return parts;
  }

  function renderLevelMenu(){
    const menu = $('levelMenu');
    menu.innerHTML = '';
    $('unlockedLevelLabel').textContent = currentUnlocked();

    const maxShown = ENDLESS_LEVEL;
    for(let lvl = 1; lvl <= maxShown; lvl++){
      const btn = document.createElement('button');
      btn.className = 'level-btn';
      btn.textContent = lvl >= ENDLESS_LEVEL ? ENDLESS_NAME : 'Level ' + lvl;

      if(lvl > currentUnlocked()){
        btn.classList.add('locked');
        btn.disabled = true;
        btn.title = lvl >= ENDLESS_LEVEL ? 'Lås op ved at klare level 10' : 'Lås op ved at klare level ' + (lvl - 1);
      } else {
        if(lvl === state.selectedLevel){
          btn.style.background = 'var(--cyan)';
          btn.style.color = '#052739';
        }
        btn.addEventListener('click', () => {
          state.selectedLevel = lvl;
          renderLevelMenu();
        });
      }

      menu.appendChild(btn);
    }
  }

  function setupLevel(level){
    state.level = level;
    state.progress = 0;
    state.currentRunBestCombo = 0;
    resetEndlessCombo();
    state.running = false;
    state.gameOver = false;
    state.runStartTime = Date.now();
    state.damagedThisLevel = false;
    state.perfectRunActive = (level === 1 && state.difficulty !== 'hard');
    state.magnetPointsThisRun = 0;
    state.slowmoPointsThisRun = 0;
    state.snake = buildLevelStartSnake(level);
    state.dir = {x:1,y:0};
    state.nextDir = {x:1,y:0};
    state.bombs = [];
    state.explosions = [];
    if(state.explosionAnimFrame){
      cancelAnimationFrame(state.explosionAnimFrame);
      state.explosionAnimFrame = null;
    }
    state.arrows = [];
    state.flames = [];
    state.powerup = null;
    state.food = randomCell();
    spawnBombsForLevel();
    $('gameOverOverlay').classList.add('hidden');
    updateUI();
    checkTrophies();
    draw();
  }



  function refreshEndlessComboTimerFromPowerup(){
    // Powerups should help preserve combo flow, but must NOT give points
    // and must NOT increase the combo count.
    if(!isEndlessLevel()) return;
    if(!state.endlessCombo || state.endlessCombo <= 0) return;

    const now = Date.now();
    const comboWindow = now < (state.comboBoostUntil || 0) ? 8000 : 4000;
    state.endlessComboWindow = comboWindow;
    state.endlessComboUntil = now + comboWindow;
    state.comboLastTimerTick = now;

    addCenterMessage('COMBO SAVED ⏱', '#38bdf8', 650);
  }


  // ============================================================
  // 9. POWERUPS
  // ============================================================

  function firstPowerupDelay(){
    return isEndlessLevel() ? 9000 : 7000;
  }

  function nextPowerupDelay(){
    return isEndlessLevel() ? Math.max(9000, endlessPowerupDelay()) : 16000;
  }

  function startPowerupFlow(){
    clearPowerupTimer();
    state.powerup = null;
    scheduleNextPowerup(firstPowerupDelay());
  }


  function clearPowerupTimer(){
    if(state.powerupTimer){
      clearTimeout(state.powerupTimer);
      state.powerupTimer = null;
    }
  }

  function randomFreeCell(){
    while(true){
      const p = {x: Math.floor(Math.random()*GRID), y: Math.floor(Math.random()*GRID)};
      const blocked = [...state.snake, ...state.bombs, ...state.arrows.map(a => ({x:a.x,y:a.y})), ...state.flames.map(f => ({x:f.x,y:f.y})), state.food];
      if(state.powerup) blocked.push(state.powerup);
      if(!blocked.some(c => same(c,p))) return p;
    }
  }

  function scheduleNextPowerup(delay){
    clearPowerupTimer();
    state.powerupTimer = setTimeout(() => {
      state.powerupTimer = null;
      if(!state.running || state.gameOver) return;
      spawnPowerup();
    }, delay);
  }

  function spawnPowerup(){
    if(state.gameOver) return;
    if(state.powerup) return;
    const kinds = ['M','S','H','🛡','2x'];
    const type = kinds[Math.floor(Math.random() * kinds.length)];
    const p = randomFreeCell();
    state.powerup = { x: p.x, y: p.y, type };
    updateUI();
    draw();
  }

  function halfSnake(){
    if(state.snake.length <= 2) return 0;
    const before = state.snake.length;
    const keep = Math.max(2, Math.ceil(state.snake.length / 2));
    state.snake = state.snake.slice(0, keep);
    return before - state.snake.length;
  }

  function consumeShield(){
    if(!state.shieldActive) return false;
    // Important balance change: using shield no longer breaks Endless combo.
    const heldSeconds = state.shieldStartTime ? Math.floor((Date.now() - state.shieldStartTime) / 1000) : 0;
    if(heldSeconds > (state.bestShieldHoldSeconds || 0)){
      state.bestShieldHoldSeconds = heldSeconds;
      window.__ES_STORAGE__.setItem('electric-snake-best-shield-hold', String(state.bestShieldHoldSeconds));
    }
    state.shieldActive = false;
    state.shieldStartTime = 0;
    triggerHitFeedback('shield');
    updateUI();
    draw();
    return true;
  }

  function activatePowerup(type){
    playPowerupSound(type);
    refreshEndlessComboTimerFromPowerup();
    state.totalPowerupsCollected = (state.totalPowerupsCollected || 0) + 1;
    window.__ES_STORAGE__.setItem('electric-snake-powerups-collected', String(state.totalPowerupsCollected));
    if(!state.powerupsThisRunTypes) state.powerupsThisRunTypes = [];
    if(!state.powerupsThisRunTypes.includes(type)) state.powerupsThisRunTypes.push(type);
    playPowerupSound(type);

    if(type === 'S'){
      // S is now Combo Boost: double combo timer for 15 seconds.
      state.comboBoostUntil = Date.now() + 15000;
      state.slowmoPointsThisRun = 0;
      addCenterMessage('COMBO BOOST ⏱️', '#22d3ee', 1000);
    } else if(type === 'M'){
      state.magnetUntil = Date.now() + 15000;
      state.magnetPointsThisRun = 0;
    } else if(type === 'H'){
      const removed = halfSnake();
      state.totalHalfRemoved = (state.totalHalfRemoved || 0) + removed;
      window.__ES_STORAGE__.setItem('electric-snake-half-removed-total', String(state.totalHalfRemoved));
    } else if(type === '🛡'){
      state.shieldActive = true;
      state.shieldStartTime = Date.now();

      // Daglig challenge-tracking: Brug skjold
      state.shieldsUsedThisRun = (state.shieldsUsedThisRun || 0) + 1;
      state.totalShieldsUsedDaily = Number(window.__ES_STORAGE__.getItem('electric-snake-daily-shields-used') || 0) + 1;
      window.__ES_STORAGE__.setItem('electric-snake-daily-shields-used', String(state.totalShieldsUsedDaily));

      if(typeof dailyFinalUpdate === 'function') dailyFinalUpdate('shield', state.totalShieldsUsedDaily);
      if(typeof dailyV5Update === 'function') dailyV5Update('shield', state.totalShieldsUsedDaily);
      if(typeof dailyFixedUpdate === 'function') dailyFixedUpdate('shield', state.totalShieldsUsedDaily);
      if(typeof updateDaily === 'function') updateDaily('shield', state.totalShieldsUsedDaily);
    } else if(type === '2x'){
      state.doublePointsUntil = Date.now() + 15000;
      state.doublePointsThisRun = 0;
    }

    checkTrophies();
    state.powerup = null;
    scheduleNextPowerup(nextPowerupDelay());
    updateUI();
    draw();
  }

  function magnetCatchesFood(head){
    if(Date.now() > state.magnetUntil) return false;
    const dx = Math.abs(head.x - state.food.x);
    const dy = Math.abs(head.y - state.food.y);
    return dx <= 2 && dy <= 2;
  }



  // ============================================================
  // 10. SKINS + SHOP
  // ============================================================
  const SKINS = [
    { id: 'neon', name: 'Neon Pulse', price: 0, head: '#c084fc', body: '#22d3ee', glow: '#22d3ee', previewClass: 'skin-neon' },
    { id: 'fire', name: 'Fire Tail', price: 150, head: '#facc15', body: '#f97316', glow: '#fb923c', previewClass: 'skin-fire' },
    { id: 'gold', name: 'Gold Shine', price: 500, head: '#fff7ad', body: '#facc15', glow: '#facc15', previewClass: 'skin-gold' },
    { id: 'military', name: 'Military', price: 1000, head: '#0f172a', body: '#5b4636', glow: '#d6b36a', previewClass: 'skin-military' },
    { id: 'arctic', name: 'Arctic', price: 900, head: '#ffffff', body: '#9ca3af', glow: '#e5e7eb', previewClass: 'skin-arctic' },
    { id: 'toxic', name: 'Toxic Venom', price: 300, head: '#bef264', body: '#22c55e', glow: '#a3e635', previewClass: 'skin-toxic' },
    { id: 'galaxy', name: 'Nightshade', price: 750, head: '#a78bfa', body: '#312e81', glow: '#38bdf8', previewClass: 'skin-galaxy' },
    { id: 'rainbow_disco', name: 'Rainbow Disco', price: 2200, head: '#f97316', body: '#22c55e', glow: '#ec4899', previewClass: 'skin-rainbow' },
    { id: 'shadow_venom', name: 'Shadow Venom', price: 2600, head: '#1e0638', body: '#111827', glow: '#a855f7', previewClass: 'skin-shadow' },
    { id: 'cyber_chrome', name: 'Cyber Chrome', price: 3000, head: '#f8fafc', body: '#94a3b8', glow: '#38bdf8', previewClass: 'skin-cyber' }
  ];

  function currentSkin(){
    return SKINS.find(s => s.id === state.equippedSkin) || SKINS[0];
  }

  function unlockAllSkinsForTesting(){
    console.warn('Disabled: skins must be bought in the simple shop.');
  }

  function saveSkins(){
    window.__ES_STORAGE__.setItem('electric-snake-owned-skins', JSON.stringify(state.ownedSkins));
    window.__ES_STORAGE__.setItem('electric-snake-equipped-skin', state.equippedSkin);
  }

  function renderSelectedSkinNameClean(){
    const label = $('selectedSkinNameClean');
    if(!label) return;
    const skin = currentSkin();
    label.textContent = skin.name;
  }

  
  // ============================================================
  // SKIN ECONOMY V3 - SAFE MIGRATION
  // Keeps coins/trophies/highscore. Resets only old free-skin ownership.
  // ============================================================

  const SAVE_KEYS_V3 = {
    coins: 'electric-snake-coins',
    trophies: 'electric-snake-trophies',
    ownedSkins: 'electric-snake-owned-skins',
    equippedSkin: 'electric-snake-equipped-skin',
    migration: 'electric-snake-skin-economy-v3-migrated',
    ownershipFix: 'electric-snake-shop-ownership-v5-hard-reset'
  };

  const SKIN_PRICES_V3 = {
    neon: 0,
    toxic: 500,
    fire: 1500,
    arctic: 2000,
    military: 3000,
    cyber: 3500,
    cyberchrome: 3500,
    nightshade: 4000,
    galaxy: 4000,
    rainbow: 4500,
    rainbowdisco: 4500,
    rainbow_disco: 4500,
    gold: 6000,
    shadowvenom: 5500,
    shadow_venom: 5500
  };

  function jsonLoadV3(key, fallback){
    try{
      const raw = window.__ES_STORAGE__.getItem(key);
      if(raw === null) return fallback;
      return JSON.parse(raw);
    }catch(e){ return fallback; }
  }

  function jsonSaveV3(key, value){
    try{ window.__ES_STORAGE__.setItem(key, JSON.stringify(value)); }catch(e){}
  }

  function skinKeyV3(skin){
    return (skin && (skin.id || skin.name || skin.label) || '').toString().toLowerCase().replace(/\s+/g,'').replace(/[^a-z0-9]/g,'');
  }

  
  function skinPriceV3(skin){
    const key = skinKeyV3(skin);

    if(key === 'neon' || key.includes('neon')) return 0;
    if(key === 'toxic' || key.includes('toxic')) return 500;
    if(key === 'fire' || key.includes('fire')) return 1500;
    if(key === 'arctic' || key.includes('arctic')) return 2000;
    if(key === 'military' || key.includes('military')) return 3000;
    if(key === 'cyberchrome' || key === 'cyber_chrome' || key.includes('cyber')) return 3500;
    if(key === 'galaxy' || key.includes('night') || key.includes('galaxy')) return 4000;
    if(key === 'rainbowdisco' || key === 'rainbow_disco' || key.includes('rainbow')) return 4500;
    if(key === 'shadowvenom' || key === 'shadow_venom' || key.includes('shadow')) return 5500;
    if(key === 'gold' || key.includes('gold')) return 6000;

    return 1000;
  }



  function normalizeEjetSkinsV3(){
    try{
      const HARD_RESET_KEY = SAVE_KEYS_V3.ownershipFix;
      const allSkinIdsV5 = (typeof SKINS !== 'undefined') ? SKINS.map(s => s.id) : ['neon'];

      // One-time hard reset:
      // Old builds sometimes saved every skin as owned before the shop economy was stable.
      // This clears ONLY skin ownership/equipped skin. Coins, trophies and highscores are untouched.
      if(window.__ES_STORAGE__.getItem(HARD_RESET_KEY) !== '1'){
        window.__ES_STORAGE__.removeItem(SAVE_KEYS_V3.ownedSkins);
        window.__ES_STORAGE__.removeItem(SAVE_KEYS_V3.equippedSkin);

        // Also remove known old migration flags so they cannot protect bad ownership data.
        window.__ES_STORAGE__.removeItem('electric-snake-skin-economy-v3-migrated');
        window.__ES_STORAGE__.removeItem('electric-snake-shop-ownership-v4-fixed');

        const cleanEjet = ['neon'];
        jsonSaveV3(SAVE_KEYS_V3.ownedSkins, cleanEjet);
        window.__ES_STORAGE__.setItem(SAVE_KEYS_V3.equippedSkin, 'neon');
        window.__ES_STORAGE__.setItem(HARD_RESET_KEY, '1');
        window.__ES_STORAGE__.setItem(SAVE_KEYS_V3.migration, '1');

        if(typeof state !== 'undefined'){
          state.ownedSkins = cleanEjet;
          state.equippedSkin = 'neon';
          state.coins = Number(window.__ES_STORAGE__.getItem(SAVE_KEYS_V3.coins) || state.coins || 0);
        }
        return;
      }

      let owned = jsonLoadV3(SAVE_KEYS_V3.ownedSkins, ['neon']);
      if(!Array.isArray(owned)) owned = ['neon'];

      // Keep only valid skin ids and always keep Neon.
      owned = Array.from(new Set(owned.filter(id => allSkinIdsV5.includes(id))));
      if(!owned.includes('neon')) owned.unshift('neon');

      let equipped = window.__ES_STORAGE__.getItem(SAVE_KEYS_V3.equippedSkin) || 'neon';
      if(!owned.includes(equipped)) equipped = 'neon';

      jsonSaveV3(SAVE_KEYS_V3.ownedSkins, owned);
      window.__ES_STORAGE__.setItem(SAVE_KEYS_V3.equippedSkin, equipped);

      if(typeof state !== 'undefined'){
        state.ownedSkins = owned;
        state.equippedSkin = equipped;
        state.coins = Number(window.__ES_STORAGE__.getItem(SAVE_KEYS_V3.coins) || state.coins || 0);
      }
    }catch(e){}
  }


  function saveSkinEconomyV3(){
    try{
      if(typeof state === 'undefined') return;

      const validIds = (typeof SKINS !== 'undefined') ? SKINS.map(s => s.id) : ['neon'];
      let owned = Array.isArray(state.ownedSkins) ? state.ownedSkins : ['neon'];
      owned = Array.from(new Set(owned.filter(id => validIds.includes(id))));
      if(!owned.includes('neon')) owned.unshift('neon');

      let equipped = state.equippedSkin || 'neon';
      if(!owned.includes(equipped)) equipped = 'neon';

      state.ownedSkins = owned;
      state.equippedSkin = equipped;

      saveCoinsV10();
      jsonSaveV3(SAVE_KEYS_V3.ownedSkins, owned);
      window.__ES_STORAGE__.setItem(SAVE_KEYS_V3.equippedSkin, equipped);
    }catch(e){}
  }

  function skinEjetV3(skin){
    if(!skin) return false;
    const id = skin.id || skinKeyV3(skin);
    if(id === 'neon') return true;
    if(!Array.isArray(state.ownedSkins)) normalizeEjetSkinsV3();
    return Array.isArray(state.ownedSkins) && state.ownedSkins.includes(id);
  }

  function buyOrEquipSkinV3(skin){
    normalizeEjetSkinsV3();

    const id = skin.id || skinKeyV3(skin);
    const price = skinPriceV3(skin);
    const owned = skinEjetV3(skin);

    // Ejet skins can be equipped.
    if(owned){
      state.equippedSkin = id;
      saveSkinEconomyV3();
      if(typeof addCenterMessage === 'function') addCenterMessage(shopLabelV7('equipped'), '#22c55e', 700);
      if(typeof renderShop === 'function') renderShop();
      if(typeof updateUI === 'function') updateUI();
      return;
    }

    // Låst skins cannot be equipped. They must be bought first.
    const balance = Number(state.coins || 0);
    if(balance < price){
      if(typeof addCenterMessage === 'function') addCenterMessage((uiLangV7()==='en'?'Locked — need ':'Låst — mangler ') + price + ' coins 🪙', '#facc15', 1100);
      if(typeof renderShop === 'function') renderShop();
      return;
    }

    state.coins = balance - price;
    state.ownedSkins = Array.isArray(state.ownedSkins) ? state.ownedSkins : ['neon'];

    if(!state.ownedSkins.includes(id)){
      state.ownedSkins.push(id);
    }

    state.equippedSkin = id;
    saveSkinEconomyV3();

    if(typeof addCenterMessage === 'function') addCenterMessage('Bought for ' + price + ' 🪙', '#22c55e', 1100);
    if(typeof renderShop === 'function') renderShop();
    if(typeof updateUI === 'function') updateUI();
  }

  
  
  function drawMiniSkinPreviewV3(canvas, skin){
    if(!canvas || !skin) return;

    const ctxp = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const key = skinKeyV3(skin);

    ctxp.clearRect(0,0,w,h);

    function rr2(x,y,ww,hh,r){
      ctxp.beginPath();
      ctxp.moveTo(x+r,y);
      ctxp.arcTo(x+ww,y,x+ww,y+hh,r);
      ctxp.arcTo(x+ww,y+hh,x,y+hh,r);
      ctxp.arcTo(x,y+hh,x,y,r);
      ctxp.arcTo(x,y,x+ww,y,r);
      ctxp.closePath();
    }

    function grad(x,y,s,stops){
      const g = ctxp.createLinearGradient(x,y,x+s,y+s);
      stops.forEach(([p,c]) => g.addColorStop(p,c));
      return g;
    }

    function skinPalette(){
      if(key.includes('military')) return {glow:'#d6b36a', stops:[[0,'#101827'],[.35,'#4a3b27'],[.68,'#5f6f3a'],[1,'#111827']], accent:'#c6b27a'};
      if(key.includes('arctic')) return {glow:'#93c5fd', stops:[[0,'#f8fafc'],[.42,'#bfdbfe'],[.78,'#3b82f6'],[1,'#0f172a']], accent:'#e0f2fe'};
      if(key.includes('rainbow')) return {rainbow:true, glow:'#ec4899', accent:'#fdf4ff'};
      if(key.includes('gold')) return {glow:'#facc15', stops:[[0,'#fff7ad'],[.38,'#facc15'],[.75,'#b45309'],[1,'#451a03']], accent:'#fff7ad'};
      if(key.includes('galaxy') || key.includes('night')) return {glow:'#8b5cf6', stops:[[0,'#a78bfa'],[.35,'#312e81'],[.72,'#111827'],[1,'#020617']], accent:'#c4b5fd'};
      if(key.includes('shadow')) return {glow:'#a855f7', stops:[[0,'#2e1065'],[.55,'#111827'],[1,'#020617']], accent:'#d8b4fe'};
      if(key.includes('cyber')) return {glow:'#38bdf8', stops:[[0,'#f8fafc'],[.32,'#94a3b8'],[.68,'#334155'],[1,'#020617']], accent:'#22d3ee'};
      if(key.includes('fire')) return {glow:'#fb923c', stops:[[0,'#fef08a'],[.35,'#f97316'],[.78,'#991b1b'],[1,'#1c0707']], accent:'#fed7aa'};
      if(key.includes('toxic')) return {glow:'#a3e635', stops:[[0,'#bef264'],[.42,'#22c55e'],[.84,'#14532d'],[1,'#052e16']], accent:'#d9f99d'};
      return {glow:'#22d3ee', stops:[[0,'#c084fc'],[.35,'#22d3ee'],[.82,'#0f172a'],[1,'#020617']], accent:'#a5f3fc'};
    }

    const pal = skinPalette();

    ctxp.save();

    const bg = ctxp.createRadialGradient(w/2,h/2,8,w/2,h/2,w/2);
    bg.addColorStop(0, pal.glow + '33');
    bg.addColorStop(1, 'rgba(2,6,23,0)');
    ctxp.fillStyle = bg;
    ctxp.fillRect(0,0,w,h);

    const size = 27;
    const gap = 7;
    const startX = Math.max(10, (w - size*6 - gap*5) / 2);
    const y = (h - size) / 2;

    const rainbow = ['#ef4444','#f97316','#facc15','#22c55e','#38bdf8','#a855f7'];

    for(let i=5;i>=0;i--){
      const isHead = i === 0;
      const x = startX + i*(size+gap);
      const s = size;

      ctxp.shadowColor = pal.rainbow ? rainbow[i] : pal.glow;
      ctxp.shadowBlur = isHead ? 14 : 9;

      if(pal.rainbow){
        ctxp.fillStyle = grad(x,y,s,[[0,'#ffffff'],[.25,rainbow[i]],[1,'#020617']]);
      }else{
        ctxp.fillStyle = grad(x,y,s,pal.stops);
      }

      rr2(x,y,s,s,isHead?10:7);
      ctxp.fill();

      // sleek highlight
      ctxp.shadowBlur = 0;
      ctxp.strokeStyle = 'rgba(255,255,255,.28)';
      ctxp.lineWidth = 1.2;
      ctxp.beginPath();
      ctxp.moveTo(x+s*.22, y+s*.22);
      ctxp.lineTo(x+s*.72, y+s*.18);
      ctxp.stroke();

      // subtle style indicators, not cartoon details
      if(key.includes('military')){
        ctxp.fillStyle='rgba(20,24,22,.55)';
        rr2(x+s*.14,y+s*.54,s*.30,s*.16,4); ctxp.fill();
        ctxp.fillStyle='rgba(198,178,122,.45)';
        rr2(x+s*.52,y+s*.22,s*.32,s*.14,4); ctxp.fill();
      }else if(key.includes('galaxy') || key.includes('night') || key.includes('shadow')){
        ctxp.fillStyle='rgba(255,255,255,.75)';
        ctxp.beginPath(); ctxp.arc(x+s*.30,y+s*.30,1.15,0,Math.PI*2); ctxp.fill();
        ctxp.beginPath(); ctxp.arc(x+s*.70,y+s*.62,1.0,0,Math.PI*2); ctxp.fill();
      }else if(key.includes('cyber')){
        ctxp.strokeStyle=pal.accent;
        ctxp.lineWidth=1.2;
        ctxp.beginPath(); ctxp.moveTo(x+s*.18,y+s*.58); ctxp.lineTo(x+s*.82,y+s*.58); ctxp.stroke();
      }else if(key.includes('fire')){
        ctxp.strokeStyle='rgba(254,240,138,.55)';
        ctxp.lineWidth=1.4;
        ctxp.beginPath(); ctxp.moveTo(x+s*.50,y+s*.78); ctxp.quadraticCurveTo(x+s*.30,y+s*.50,x+s*.52,y+s*.22); ctxp.stroke();
      }

      if(isHead){
        ctxp.shadowBlur = 0;
        ctxp.fillStyle = key.includes('gold') ? '#111827' : '#020617';

        if(key.includes('rainbow')){
          rr2(x+s*.22,y+s*.38,s*.20,s*.12,3); ctxp.fill();
          rr2(x+s*.58,y+s*.38,s*.20,s*.12,3); ctxp.fill();
        }else if(key.includes('gold')){
          ctxp.font = 'bold 8px Arial';
          ctxp.textAlign='center';
          ctxp.textBaseline='middle';
          ctxp.fillText('$', x+s*.38, y+s*.52);
          ctxp.fillText('$', x+s*.62, y+s*.52);
        }else{
          ctxp.beginPath(); ctxp.arc(x+s*.35,y+s*.45,1.9,0,Math.PI*2); ctxp.fill();
          ctxp.beginPath(); ctxp.arc(x+s*.65,y+s*.45,1.9,0,Math.PI*2); ctxp.fill();
        }
      }
    }

    ctxp.restore();
  }



  function updateSkinPreviewV3(skin){
    const canvas = document.getElementById('skinPreviewV3Canvas');
    const title = document.getElementById('skinPreviewV3Title');
    const meta = document.getElementById('skinPreviewV3Meta');
    if(!canvas || !skin) return;

    drawMiniSkinPreviewV3(canvas, skin);

    const name = skin.name || skin.label || skin.id || 'Skin';
    const owned = skinEjetV3(skin);
    const price = skinPriceV3(skin);

    if(title) title.textContent = name;
    if(meta) meta.textContent = owned ? 'Ejet' : price + ' coins';
  }

  normalizeEjetSkinsV3();



  

  function uiLangV7(){
    try{ return localStorage.getItem('electric-snake-language-v1') === 'en' ? 'en' : 'da'; }
    catch(e){ return 'da'; }
  }

  function shopLabelV7(key){
    const lang = uiLangV7();
    const labels = {
      da: {
        equipped:'Valgt ✅',
        owned:'Ejet — tryk for at vælge',
        buy:'Køb ',
        locked:'Låst '
      },
      en: {
        equipped:'Equipped ✅',
        owned:'Owned — tap to equip',
        buy:'Buy ',
        locked:'Locked '
      }
    };
    return (labels[lang] && labels[lang][key]) || labels.da[key] || key;
  }


  function renderShop(){
    const menu = $('shopMenu');
    if(!menu) return;

    normalizeEjetSkinsV3();

    menu.innerHTML = '';

    const preview = document.createElement('div');
    preview.className = 'skin-preview-v3';
    preview.innerHTML = `
      <div class="skin-preview-v3-info">
        <strong id="skinPreviewV3Title">Neon</strong>
        <span id="skinPreviewV3Meta">Ejet</span>
      </div>
      <canvas id="skinPreviewV3Canvas" width="240" height="78"></canvas>
    `;
    menu.appendChild(preview);

    // Shop reset UI removed intentionally.

    const list = document.createElement('div');
    list.className = 'skin-list-v3 compact';
    menu.appendChild(list);

    const sortedSkins = [...SKINS].sort((a,b) => {
      const pa = skinPriceV3(a);
      const pb = skinPriceV3(b);
      if(pa !== pb) return pa - pb;
      return (a.name || a.id || '').localeCompare(b.name || b.id || '');
    });

    sortedSkins.forEach((skin, index) => {
      const id = skin.id || skinKeyV3(skin);
      const name = skin.name || skin.label || id;
      const owned = skinEjetV3(skin);
      const equipped = (state.equippedSkin || 'neon') === id;
      const price = skinPriceV3(skin);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'skin-row-v3 compact';
      if(equipped) btn.classList.add('equipped');

      const canKøb = Number(state.coins || 0) >= price;
      btn.dataset.skinId = id;
      if(!owned) btn.classList.add(canKøb ? 'can-buy' : 'locked');
      btn.innerHTML = `
        <span>${name}</span>
        <em>${owned ? (equipped ? shopLabelV7('equipped') : shopLabelV7('owned')) : (canKøb ? shopLabelV7('buy') + price + ' 🪙' : shopLabelV7('locked') + price + ' 🪙')}</em>
      `;

      btn.addEventListener('mouseenter', () => updateSkinPreviewV3(skin));
      btn.addEventListener('focus', () => updateSkinPreviewV3(skin));
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        updateSkinPreviewV3(skin);
        buyOrEquipSkinV3(skin);
      });

      list.appendChild(btn);

      if(index === 0) setTimeout(() => updateSkinPreviewV3(skin), 0);
    });
  }




  // ============================================================
  // 11. TROPHIES
  // ============================================================
  const TROPHIES = [
    // Platinum - always shown at the very top
    { id:'platinum_all', name:'Platin-slange', tier:'platinum', desc:'Lås alle andre trofæer op.' },

    // Basic / early trophies
    { id:'first_spark', name:'Første gnist', tier:'bronze', desc:'Få dit første point.' },
    { id:'no_damage', name:'Ingen skade', tier:'bronze', desc:'Klar et level uden at miste hale.' },
    { id:'survivor', name:'Overlever', tier:'bronze', desc:'Overlev 60 sekunder.' },
    { id:'survivor_150', name:'Overlever II', tier:'silver', desc:'Overlev 150 sekunder uden at dø.' },

    // Level progression before gold trophies
    { id:'level_runner', name:'Level-runner', tier:'bronze', desc:'Nå level 5.' },
    { id:'snake_master', name:'Slange-mester', tier:'silver', desc:'Nå level 10.' },
    { id:'hard_mode', name:'Svær tilstand', tier:'silver', desc:'Klar level 5 på svær.' },

    // Endless Storm progression after combo balance
    { id:'endless_75', name:'Storm-rookie', tier:'bronze', desc:'Få 75 point i Endless Storm.' },
    { id:'combo_15', name:'Combo-starter', tier:'bronze', desc:'Nå x15 combo i Endless Storm.' },
    { id:'endless_125', name:'Storm Overlever', tier:'silver', desc:'Få 125 point i Endless Storm.' },
    { id:'combo_25', name:'Combo-mester', tier:'silver', desc:'Nå x25 combo i Endless Storm.' },
    { id:'combo_40', name:'Combo-legende', tier:'gold', desc:'Nå x40 combo i Endless Storm.' },

    // Coins total before gold trophies
    { id:'rich_snake', name:'Rig slange', tier:'bronze', desc:'Saml 500 coins.' },
    { id:'coin_collector_2500', name:'Coin-samler', tier:'bronze', desc:'Saml 2500 coins i alt.' },
    { id:'coin_vault_10000', name:'Coin-boks', tier:'silver', desc:'Saml 10000 coins i alt.' },

    // Skin collection before gold trophies
    { id:'skin_collector_bronze', name:'Skin-samler I', tier:'bronze', desc:'Køb 3 skins.' },
    { id:'skin_collector_silver', name:'Skin-samler II', tier:'silver', desc:'Køb 6 skins.' },

    // Powerup challenges
    { id:'full_power_set', name:'Fuldt power-sæt', tier:'bronze', desc:'Saml alle 5 forskellige powerups i én run uden at dø.' },
    { id:'magnet_master', name:'Magnet-mester', tier:'bronze', desc:'Få 8 point mens magneten er aktiv.' },
    { id:'time_bender', name:'Tidsbøjer', tier:'bronze', desc:'Få 4 point mens slow-mo er aktiv.' },
    { id:'shield_keeper', name:'Skjold-holder', tier:'bronze', desc:'Hold shield i 60 sekunder uden at bruge det.' },
    { id:'double_trouble', name:'Dobbelt ballade', tier:'bronze', desc:'Få 6 point på én 2x powerup.' },
    { id:'cut_in_half', name:'Skåret over', tier:'bronze', desc:'Få fjernet 10 hale-led med halverings-powerup.' },
    { id:'power_hunter', name:'Power-jæger', tier:'bronze', desc:'Saml 100 super powers.' },
    { id:'power_addict', name:'Power-afhængig', tier:'silver', desc:'Saml 200 super powers.' },

    // Skin coin mastery - bronze
    { id:'skin_coin_neon_1000', name:'Neon Grinder', tier:'bronze', desc:'Saml 1000 coins med Neon skin.' },
    { id:'skin_coin_fire_1000', name:'Fire Grinder', tier:'bronze', desc:'Saml 1000 coins med Fire skin.' },
    { id:'skin_coin_gold_1000', name:'Gold Grinder', tier:'bronze', desc:'Saml 1000 coins med Gold skin.' },
    { id:'skin_coin_toxic_1000', name:'Toxic Grinder', tier:'bronze', desc:'Saml 1000 coins med Toxic skin.' },
    { id:'skin_coin_arctic_1000', name:'Arctic Grinder', tier:'bronze', desc:'Saml 1000 coins med Arctic skin.' },

    // Skin coin mastery - silver
    { id:'skin_coin_shadow_2000', name:'Shadow Venom Elite', tier:'silver', desc:'Saml 2000 coins med Shadow Venom skin.' },
    { id:'skin_coin_cyber_2000', name:'Cyber Chrome Elite', tier:'silver', desc:'Saml 2000 coins med Cyber Chrome skin.' },
    { id:'skin_coin_rainbow_2000', name:'Rainbow Disco Elite', tier:'silver', desc:'Saml 2000 coins med Rainbow Disco skin.' },
    { id:'skin_coin_nightshade_2000', name:'Nightshade Elite', tier:'silver', desc:'Saml 2000 coins med Nightshade skin.' },
    { id:'skin_coin_military_2000', name:'Military Elite', tier:'silver', desc:'Saml 2000 coins med Military skin.' },

    // Gold trophies - hardest trophies at the bottom
    { id:'ultimate_snake', name:'Ultimate Snake', tier:'gold', desc:'Klar level 10 på svær.' },
    { id:'perfect_run', name:'Perfect Run', tier:'gold', desc:'Klar alle baner uden at dø.' },
    { id:'endless_175', name:'Storm Dominator', tier:'gold', desc:'Få 175 point i Endless Storm.' },
    { id:'endless_250', name:'Storm God', tier:'gold', desc:'Få 250 point i Endless Storm.' },
    { id:'coin_king', name:'Coin King', tier:'gold', desc:'Få 30000 coins.' },
    { id:'skin_collector_gold', name:'Skin-samler III', tier:'gold', desc:'Køb 9 skins.' }
  ];

  function saveTrophies(){
    window.__ES_STORAGE__.setItem('electric-snake-trophies', JSON.stringify(state.unlockedTrophies));
  }

  function showTrophyPopup(trophy){
    const popup = $('trophyPopup');
    const text = $('trophyPopupText');
    if(!popup || !text) return;

    const tier = trophy.tier || 'bronze';
    const tierName = trophyTierLabel(tier);

    popup.className = 'trophy-popup ' + tier;
    text.textContent = trophy.name + ' (' + tierName + ')';

    popup.classList.remove('hidden');
    playDailyCompleteSound();

    setTimeout(() => {
      popup.classList.add('hidden');
    }, 3200);
  }

  function unlockTrophy(id){
    if(state.unlockedTrophies.includes(id)) return;
    const trophy = TROPHIES.find(t => t.id === id);
    if(!trophy) return;
    state.unlockedTrophies.push(id);
    saveTrophies();
    renderTrophies();
    showTrophyPopup(trophy);
  }


  function trophyTierClass(tier){
    if(tier === 'platinum') return 'trophy-platinum';
    if(tier === 'gold') return 'trophy-gold';
    if(tier === 'silver') return 'trophy-silver';
    return 'trophy-bronze';
  }

  function trophyTierLabel(tier){
    if(tier === 'platinum') return 'Platinum';
    if(tier === 'gold') return 'Guld';
    if(tier === 'silver') return 'Sølv';
    return 'Bronze';
  }

  function trophyProgress(t){
    const ownedSkinCount = state.ownedSkins ? state.ownedSkins.length : 0;
    const bestEndless = Math.max(state.bestEndless || 0, state.endlessPoints || 0);
    const bestMagnet = Math.max(state.bestMagnetPoints || 0, state.magnetPointsThisRun || 0);
    const bestSlow = Math.max(state.bestSlowmoPoints || 0, state.slowmoPointsThisRun || 0);
    const nonPlatinumTotal = TROPHIES.filter(x => x.id !== 'platinum_all').length;
    const nonPlatinumUnlocked = TROPHIES.filter(x => x.id !== 'platinum_all' && state.unlockedTrophies.includes(x.id)).length;

    const map = {
      platinum_all: [Math.min(nonPlatinumUnlocked, nonPlatinumTotal), nonPlatinumTotal, 'Andre trofæer'],
      first_spark: [Math.min(state.score || 0, 1), 1, 'Point'],
      level_runner: [Math.min(state.level || 1, 5), 5, 'Level'],
      snake_master: [Math.min(state.level || 1, 10), 10, 'Level'],
      endless_125: [Math.min(bestEndless, 125), 125, 'Endless point'],
      endless_125: [Math.min(bestEndless, 125), 125, 'Endless point'],
      endless_175: [Math.min(bestEndless, 175), 175, 'Endless point'],
      endless_250: [Math.min(bestEndless, 250), 250, 'Endless point'],
      combo_15: [Math.min(Math.max(state.bestEndlessCombo || 0, state.endlessCombo || 0), 15), 15, 'Bedste combo'],
      combo_25: [Math.min(Math.max(state.bestEndlessCombo || 0, state.endlessCombo || 0), 25), 25, 'Bedste combo'],
      combo_40: [Math.min(Math.max(state.bestEndlessCombo || 0, state.endlessCombo || 0), 40), 40, 'Bedste combo'],
      magnet_master: [Math.min(bestMagnet, 8), 8, 'Bedste magnet-run'],
      time_bender: [Math.min(bestSlow, 4), 4, 'Bedste slow-mo-run'],
      cut_in_half: [Math.min(state.totalHalfRemoved || 0, 10), 10, 'Hale-led fjernet'],
      power_hunter: [Math.min(state.totalPowerupsCollected || 0, 100), 100, 'Super powers'],
      power_addict: [Math.min(state.totalPowerupsCollected || 0, 200), 200, 'Super powers'],
      full_power_set: [Math.min((state.powerupsThisRunTypes || []).length, 5), 5, 'Forskellige powerups denne run'],
      shield_keeper: [Math.min(Math.max(state.bestShieldHoldSeconds || 0, state.shieldActive && state.shieldStartTime ? Math.floor((Date.now() - state.shieldStartTime) / 1000) : 0), 60), 60, 'Sekunder med shield'],
      double_trouble: [Math.min(Math.max(state.bestDoublePointsRun || 0, state.doublePointsThisRun || 0), 6), 6, 'Point på 2x'],
      rich_snake: [Math.min(state.coins || 0, 500), 500, 'Coins'],
      coin_collector_2500: [Math.min(state.coins || 0, 2500), 2500, 'Coins'],
      coin_vault_10000: [Math.min(state.coins || 0, 10000), 10000, 'Coins'],
      skin_coin_neon_1000: [Math.min(skinCoinProgress('neon'), 1000), 1000, 'Coins med Neon'],
      skin_coin_fire_1000: [Math.min(skinCoinProgress('fire'), 1000), 1000, 'Coins med Fire'],
      skin_coin_gold_1000: [Math.min(skinCoinProgress('gold'), 1000), 1000, 'Coins med Gold'],
      skin_coin_toxic_1000: [Math.min(skinCoinProgress('toxic'), 1000), 1000, 'Coins med Toxic'],
      skin_coin_arctic_1000: [Math.min(skinCoinProgress('arctic'), 1000), 1000, 'Coins med Arctic'],
      skin_coin_shadow_2000: [Math.min(skinCoinProgress('shadow_venom'), 2000), 2000, 'Coins med Shadow Venom'],
      skin_coin_cyber_2000: [Math.min(skinCoinProgress('cyber_chrome'), 2000), 2000, 'Coins med Cyber Chrome'],
      skin_coin_rainbow_2000: [Math.min(skinCoinProgress('rainbow_disco'), 2000), 2000, 'Coins med Rainbow Disco'],
      skin_coin_nightshade_2000: [Math.min(skinCoinProgress('galaxy'), 2000), 2000, 'Coins med Nightshade'],
      skin_coin_military_2000: [Math.min(skinCoinProgress('military'), 2000), 2000, 'Coins med Military'],
      survivor: [Math.min(Math.floor((Date.now() - state.runStartTime) / 1000), 60), 60, 'Sekunder denne tur'],
      survivor_150: [Math.min(Math.floor((Date.now() - state.runStartTime) / 1000), 150), 150, 'Sekunder denne tur'],
      no_damage: [state.damagedThisLevel ? 0 : Math.min(state.progress || 0, pointsPerLevel()), pointsPerLevel(), 'Nuværende level'],
      hard_mode: [state.difficulty === 'hard' ? Math.min(state.level || 1, 5) : 0, 5, 'Svær level'],
      skin_collector_bronze: [Math.min(ownedSkinCount, 3), 3, 'Skins ejet'],
      skin_collector_silver: [Math.min(ownedSkinCount, 6), 6, 'Skins ejet'],
      skin_collector_gold: [Math.min(ownedSkinCount, 9), 9, 'Skins ejet'],
      ultimate_snake: [state.difficulty === 'hard' ? Math.min(state.level || 1, 10) : 0, 10, 'Svær level'],
      perfect_run: [state.perfectRunActive ? Math.min(state.level || 1, 10) : 0, 10, 'Levels i træk denne run'],
      coin_king: [Math.min(state.coins || 0, 30000), 30000, 'Coins']
    };

    const item = map[t.id];
    if(!item) return null;

    const target = item[1];
    const label = item[2];

    // Trophy UI sync fix:
    // If a trophy is unlocked, progress should always look completed.
    const isUnlocked = state.unlockedTrophies.includes(t.id);
    const current = isUnlocked ? target : item[0];
    const pct = isUnlocked ? 100 : (target > 0 ? Math.max(0, Math.min(100, (current / target) * 100)) : 0);

    return {current, target, label, pct};
  }

  
  function syncCompletedTrophyProgress(){
    try{
      let changed = false;

      TROPHIES.forEach(t => {
        if(state.unlockedTrophies.includes(t.id)) return;
        const p = trophyProgress(t);
        if(p && p.target > 0 && p.current >= p.target){
          state.unlockedTrophies.push(t.id);
          changed = true;
        }
      });

      if(changed){
        saveTrophies();
        renderTrophies();
      }
    }catch(e){
      console.log('Trophy progress sync failed', e);
    }
  }


function renderTrophies(){
    if(!state.__syncingTrophies){
      state.__syncingTrophies = true;
      syncCompletedTrophyProgress();
      state.__syncingTrophies = false;
    }
    const list = $('trophyList');
    if(!list) return;
    list.innerHTML = '';

    const total = TROPHIES.length;
    const unlockedCount = TROPHIES.filter(t => state.unlockedTrophies.includes(t.id)).length;
    const percent = total ? Math.round((unlockedCount / total) * 100) : 0;
    const tiers = ['platinum','bronze','silver','gold'];
    const tierLabels = { platinum:'Platinum', bronze:'Bronze', silver:'Sølv', gold:'Guld' };
    const statsBox = document.createElement('div');
    statsBox.className = 'trophy-stats-box';
    const tierHtml = tiers.map(tier => {
      const tierTotal = TROPHIES.filter(t => t.tier === tier).length;
      const tierUnlocked = TROPHIES.filter(t => t.tier === tier && state.unlockedTrophies.includes(t.id)).length;
      return '<div class="trophy-stat-pill"><strong>' + tierUnlocked + ' / ' + tierTotal + '</strong>' + tierLabels[tier] + '</div>';
    }).join('');
    statsBox.innerHTML = '<div class="trophy-stats-main">Trofæer: ' + unlockedCount + ' / ' + total + ' — ' + percent + '%</div><div class="trophy-stats-grid">' + tierHtml + '</div>';
    list.appendChild(statsBox);

    TROPHIES.forEach(t => {
      const unlocked = state.unlockedTrophies.includes(t.id);
      const card = document.createElement('div');
      card.className = 'trophy-card ' + (unlocked ? 'unlocked' : 'locked');

      const icon = document.createElement('div');
      icon.className = 'trophy-icon ' + trophyTierClass(t.tier);
      if(unlocked){
        icon.innerHTML = t.tier === 'platinum'
          ? '💎'
          : t.tier === 'gold'
          ? '<svg width="26" height="26" viewBox="0 0 26 26"><path fill="#facc15" d="M9 4h8v3c0 2.8-1.8 5-4 5s-4-2.2-4-5V4z"/><path fill="#facc15" d="M10 13h6v3h2v2H8v-2h2z"/><path fill="#fde68a" d="M8 6c-3 1-3 6 0 7 1-1 1-2 1-3s0-2-1-4z"/><circle cx="6.7" cy="12.2" r="1" fill="#111827"/><path fill="#fde68a" d="M18 6c3 1 3 6 0 7-1-1-1-2-1-3s0-2 1-4z"/><circle cx="19.3" cy="12.2" r="1" fill="#111827"/></svg>'
          : t.tier === 'silver'
          ? '<svg width="26" height="26" viewBox="0 0 26 26"><path fill="#d1d5db" d="M9 4h8v3c0 2.8-1.8 5-4 5s-4-2.2-4-5V4z"/><path fill="#d1d5db" d="M10 13h6v3h2v2H8v-2h2z"/><path fill="#e5e7eb" d="M8 6c-3 1-3 6 0 7 1-1 1-2 1-3s0-2-1-4z"/><circle cx="6.7" cy="12.2" r="1" fill="#111827"/><path fill="#e5e7eb" d="M18 6c3 1 3 6 0 7-1-1-1-2-1-3s0-2 1-4z"/><circle cx="19.3" cy="12.2" r="1" fill="#111827"/></svg>'
          : '<svg width="26" height="26" viewBox="0 0 26 26"><path fill="#cd7f32" d="M9 4h8v3c0 2.8-1.8 5-4 5s-4-2.2-4-5V4z"/><path fill="#cd7f32" d="M10 13h6v3h2v2H8v-2h2z"/><path fill="#d89a5b" d="M8 6c-3 1-3 6 0 7 1-1 1-2 1-3s0-2-1-4z"/><circle cx="6.7" cy="12.2" r="1" fill="#111827"/><path fill="#d89a5b" d="M18 6c3 1 3 6 0 7-1-1-1-2-1-3s0-2 1-4z"/><circle cx="19.3" cy="12.2" r="1" fill="#111827"/></svg>';
      } else {
        icon.textContent = '🔒';
        icon.style.color = '#64748b';
      }

      const body = document.createElement('div');
      const prog = trophyProgress(t);
      const progressHtml = prog
        ? '<div class="trophy-progress-wrap"><div class="trophy-progress-text">' + prog.label + ': ' + prog.current + ' / ' + prog.target + '</div><div class="trophy-progress-bar"><div class="trophy-progress-fill" style="width:' + prog.pct + '%"></div></div></div>'
        : '';
      body.innerHTML = '<div class="trophy-title">' + t.name + ' <span class="' + trophyTierClass(t.tier) + '">' + trophyTierLabel(t.tier) + '</span></div><div class="trophy-desc">' + t.desc + '</div>' + progressHtml;

      const status = document.createElement('div');
      status.className = 'trophy-status';
      status.textContent = unlocked ? 'Låst op' : 'Låst';

      card.appendChild(icon);
      card.appendChild(body);
      card.appendChild(status);
      list.appendChild(card);
    });
  }

  function checkTrophies(){
    if(state.score >= 1) unlockTrophy('first_spark');
    if(state.level >= 5) unlockTrophy('level_runner');
    if(state.level >= 10) unlockTrophy('snake_master');
    const bestEndlessNow = Math.max(state.bestEndless || 0, state.endlessPoints || 0);
    if(bestEndlessNow >= 50) unlockTrophy('endless_50');
    if(bestEndlessNow >= 75) unlockTrophy('endless_75');
    if(bestEndlessNow >= 100) unlockTrophy('endless_100');
    if(bestEndlessNow >= 150) unlockTrophy('endless_150');
    const bestComboNow = Math.max(state.bestEndlessCombo || 0, state.endlessCombo || 0);
    if(bestComboNow >= 10) unlockTrophy('combo_10');
    if(bestComboNow >= 20) unlockTrophy('combo_20');
    if((state.bestMagnetPoints || 0) >= 8 || (state.magnetPointsThisRun || 0) >= 8) unlockTrophy('magnet_master');
    if((state.bestSlowmoPoints || 0) >= 4 || (state.slowmoPointsThisRun || 0) >= 4) unlockTrophy('time_bender');
    if((state.totalHalfRemoved || 0) >= 10) unlockTrophy('cut_in_half');
    if((state.totalPowerupsCollected || 0) >= 100) unlockTrophy('power_hunter');
    if((state.totalPowerupsCollected || 0) >= 200) unlockTrophy('power_addict');
    if((state.powerupsThisRunTypes || []).length >= 5) unlockTrophy('full_power_set');
    const shieldHoldNow = state.shieldActive && state.shieldStartTime ? Math.floor((Date.now() - state.shieldStartTime) / 1000) : 0;
    if(shieldHoldNow > (state.bestShieldHoldSeconds || 0)){
      state.bestShieldHoldSeconds = shieldHoldNow;
      window.__ES_STORAGE__.setItem('electric-snake-best-shield-hold', String(state.bestShieldHoldSeconds));
    }
    if((state.bestShieldHoldSeconds || 0) >= 60 || shieldHoldNow >= 60) unlockTrophy('shield_keeper');
    if((state.bestDoublePointsRun || 0) >= 6 || (state.doublePointsThisRun || 0) >= 6) unlockTrophy('double_trouble');
    if(state.coins >= 500) unlockTrophy('rich_snake');
    if(state.coins >= 2500) unlockTrophy('coin_collector_2500');
    if(state.coins >= 10000) unlockTrophy('coin_vault_10000');
    if(skinCoinProgress('neon') >= 1000) unlockTrophy('skin_coin_neon_1000');
    if(skinCoinProgress('fire') >= 1000) unlockTrophy('skin_coin_fire_1000');
    if(skinCoinProgress('gold') >= 1000) unlockTrophy('skin_coin_gold_1000');
    if(skinCoinProgress('toxic') >= 1000) unlockTrophy('skin_coin_toxic_1000');
    if(skinCoinProgress('arctic') >= 1000) unlockTrophy('skin_coin_arctic_1000');
    if(skinCoinProgress('shadow_venom') >= 2000) unlockTrophy('skin_coin_shadow_2000');
    if(skinCoinProgress('cyber_chrome') >= 2000) unlockTrophy('skin_coin_cyber_2000');
    if(skinCoinProgress('rainbow_disco') >= 2000) unlockTrophy('skin_coin_rainbow_2000');
    if(skinCoinProgress('galaxy') >= 2000) unlockTrophy('skin_coin_nightshade_2000');
    if(skinCoinProgress('military') >= 2000) unlockTrophy('skin_coin_military_2000');
    if(Date.now() - state.runStartTime >= 60000) unlockTrophy('survivor');
    if(Date.now() - state.runStartTime >= 150000) unlockTrophy('survivor_150');
    const ownedSkinCount = state.ownedSkins ? state.ownedSkins.length : 0;
    if(ownedSkinCount >= 3) unlockTrophy('skin_collector_bronze');
    if(ownedSkinCount >= 6) unlockTrophy('skin_collector_silver');
    if(ownedSkinCount >= 9) unlockTrophy('skin_collector_gold');
    if(state.difficulty === 'hard' && state.level >= 10) unlockTrophy('ultimate_snake');
    if(state.coins >= 30000) unlockTrophy('coin_king');
    const allOtherTrophiesUnlocked = TROPHIES.filter(t => t.id !== 'platinum_all').every(t => state.unlockedTrophies.includes(t.id));
    if(allOtherTrophiesUnlocked) unlockTrophy('platinum_all');
  }


  // ============================================================
  // 12. UI UPDATE + GAME FLOW
  // ============================================================

  function activePowerupStatus(){
    const now = Date.now();
    const items = [
      {label:'Magnet', until: state.magnetUntil || 0, total:15000},
      {label:'Combo Boost', until: state.comboBoostUntil || 0, total:15000},
      {label:'2x', until: state.doublePointsUntil || 0, total:15000}
    ].filter(p => p.until > now);

    if(state.shieldActive){
      // Shield has no countdown, so show it as full while active.
      items.push({label:'Shield', until: now + 1, total:1, shield:true});
    }

    if(!items.length) return null;

    // Show the powerup with the most time left.
    items.sort((a,b) => (b.until - now) - (a.until - now));
    const p = items[0];

    if(p.shield){
      return {label:p.label, pct:100, text:'Powerup: Shield aktiv 🛡'};
    }

    const remaining = Math.max(0, p.until - now);
    const pct = Math.max(0, Math.min(100, (remaining / p.total) * 100));
    return {
      label:p.label,
      pct,
      text:`Powerup: ${p.label} · ${(remaining / 1000).toFixed(1)} sek tilbage`
    };
  }

  function updatePowerupBar(){
    const fill = $('powerupFill');
    const textEl = $('powerupText');
    if(!fill || !textEl) return;

    const status = activePowerupStatus();
    if(!status){
      fill.style.width = '0%';
      textEl.textContent = 'Powerup: ingen aktiv';
      return;
    }

    fill.style.width = `${status.pct}%`;
    textEl.textContent = status.text;
  }


  function updateUI(){
    $('level').textContent = isEndlessLevel() ? '∞' : state.level;
    $('score').textContent = state.score;
    $('best').textContent = state.best;
    if($('endlessBest')) $('endlessBest').textContent = state.bestEndless || 0;
    if($('bombCount')) $('bombCount').textContent = state.bombs.length;

    if(isEndlessLevel()){
      if($('progressLabel')) $('progressLabel').textContent = 'Combo timer';

      updateEndlessComboTimer();

      const now = Date.now();
      const comboActive = state.endlessCombo > 0 && state.endlessComboUntil > now;
      const comboWindow = state.endlessComboWindow || (Date.now() < (state.comboBoostUntil || 0) ? 8000 : 4000);

      if(comboActive){
        const remaining = Math.max(0, state.endlessComboUntil - now);
        const pct = Math.max(0, Math.min(100, (remaining / comboWindow) * 100));
        $('progressFill').style.width = `${pct}%`;
        $('progressText').textContent = `x${state.endlessCombo} · ${(remaining / 1000).toFixed(1)} sek tilbage`;
      } else {
        $('progressFill').style.width = '0%';
        $('progressText').textContent = `${state.endlessPoints} endless point · ingen combo`;
      }
    } else {
      if($('progressLabel')) $('progressLabel').textContent = 'Level fremskridt';
      $('progressText').textContent = `${state.progress} / ${pointsPerLevel()}`;
      $('progressFill').style.width = `${(state.progress / pointsPerLevel()) * 100}%`;
    }

    $('finalLevel').textContent = isEndlessLevel() ? ENDLESS_NAME : state.level;
    $('finalScore').textContent = state.score;
    if($('unlockedLevelLabel')) $('unlockedLevelLabel').textContent = currentUnlocked() >= ENDLESS_LEVEL ? ENDLESS_NAME : currentUnlocked();
    if($('coins')) $('coins').textContent = state.coins;
    if($('menuCoins')) $('menuCoins').textContent = state.coins;
    updatePowerupBar();
  }

  function clearHazardTimers(){
    state.bombTimeouts.forEach(clearTimeout);
    state.bombTimeouts = [];
    state.arrowTimeouts.forEach(clearTimeout);
    state.arrowTimeouts = [];
    state.flameTimeouts.forEach(clearTimeout);
    state.flameTimeouts = [];
    if(state.bombSpawnerTimeout){
      clearTimeout(state.bombSpawnerTimeout);
      state.bombSpawnerTimeout = null;
    }
    if(state.arrowSpawnerTimeout){
      clearTimeout(state.arrowSpawnerTimeout);
      state.arrowSpawnerTimeout = null;
    }
    if(state.flameSpawnerTimeout){
      clearTimeout(state.flameSpawnerTimeout);
      state.flameSpawnerTimeout = null;
    }
  }

  function setGameOver(){
    playDeathSound();
    state.running = false;
    state.gameOver = true;
    stopLoop();
    clearHazardTimers();
    clearPowerupTimer();
    $('gameOverOverlay').classList.remove('hidden');
    updateUI();
    draw();
  }

  // buildLevelStartSnake is defined once above in the Level Setup section.


  function resetRuntimeState(){
    stopLoop();
    clearHazardTimers();
    clearPowerupTimer();
    state.running = false;
    state.gameOver = false;
    state.powerup = null;
    state.slowmoUntil = 0;
    state.comboBoostUntil = 0;
    state.magnetUntil = 0;
    state.shieldActive = false;
    state.shieldStartTime = 0;
    state.doublePointsUntil = 0;
    state.doublePointsThisRun = 0;
    state.magnetPointsThisRun = 0;
    state.slowmoPointsThisRun = 0;
    state.powerupsThisRunTypes = [];
    state.bombs = [];
    state.arrows = [];
    state.flames = [];
  }

  function showMenu(){
    resetRuntimeState();
    state.score = 0;
    state.endlessPoints = 0;
    resetEndlessCombo();
    state.best = Number(window.__ES_STORAGE__.getItem('electric-snake-v3-best') || 0);
    state.bestEndless = Number(window.__ES_STORAGE__.getItem('electric-snake-endless-best') || 0);
    state.coins = Number(window.__ES_STORAGE__.getItem('electric-snake-coins') || 0);
    state.difficulty = window.__ES_STORAGE__.getItem('electric-snake-difficulty') || 'normal';
    state.selectedLevel = Math.min(state.selectedLevel, currentUnlocked());

    // Build a clean preview board, then immediately stop all timers that setupLevel may have scheduled.
    setupLevel(state.selectedLevel);
    resetRuntimeState();

    $('startOverlay').classList.remove('hidden');
    $('gameOverOverlay').classList.add('hidden');
    $('trophyBtn').classList.remove('hidden');
    renderDifficultyMenu();
    renderLevelMenu();
    renderShop();
    renderSelectedSkinNameClean();
    updateUI();
    draw();
  }

  function resetGame(){
    showMenu();
  }

  function retryLevel(){
    resetRuntimeState();
    state.score = 0;
    state.endlessPoints = 0;
    resetEndlessCombo();
    state.powerupsThisRunTypes = [];
    resetRunScoreForFreshStart();
    resetRunScoreForFreshStart();
    setupLevel(state.selectedLevel);
    $('startOverlay').classList.add('hidden');
    $('gameOverOverlay').classList.add('hidden');
    $('trophyBtn').classList.add('hidden');
    $('trophyModal').classList.add('hidden');
    state.running = true;
    state.gameOver = false;
    startPowerupFlow();
    startLoop();
  }

  function stopLoop(){
    if(state.loop) clearInterval(state.loop);
    state.loop = null;
  }

  function startLoop(){
    stopLoop();
    state.loop = setInterval(tick, speed());
  }

  function startGame(){
    resumeAudio();
    playStartSound();
    if(state.gameOver || !$('startOverlay').classList.contains('hidden')){
      retryLevel();
      return;
    }

    state.running = true;
    state.gameOver = false;
    if(!state.powerup && !state.powerupTimer) scheduleNextPowerup(firstPowerupDelay());
    $('trophyBtn').classList.add('hidden');
    $('trophyModal').classList.add('hidden');
    $('startOverlay').classList.add('hidden');
    $('gameOverOverlay').classList.add('hidden');
    startLoop();
  }

  function toggleGame(){
    if(state.gameOver) return;
    if(state.running){
      playPauseSound();
      state.running = false;
      stopLoop();
    } else {
      startGame();
    }
  }

  function setDir(dir){
    const opposite = dir.x === -state.dir.x && dir.y === -state.dir.y;
    if(opposite) return;
    if(state.running && (dir.x !== state.nextDir.x || dir.y !== state.nextDir.y)) playTurnSound();
    state.nextDir = dir;
    if(!state.running && !state.gameOver) startGame();
  }


  // ============================================================
  // 13. HAZARD SPAWNING / DAMAGE
  // ============================================================
  function scheduleNextBomb(delay = null){
    if(state.level <= 1 || state.gameOver) return;
    if(delay === null) delay = isEndlessLevel() ? endlessBombDelay() : 3000;
    if(state.bombSpawnerTimeout) clearTimeout(state.bombSpawnerTimeout);
    state.bombSpawnerTimeout = setTimeout(() => {
      spawnSingleBomb();
    }, delay);
  }


  function forwardDangerCells(steps = 4){
    const cells = [];
    if(!state.snake || !state.snake.length) return cells;
    const head = state.snake[0];
    const dir = state.nextDir || state.dir || {x:1,y:0};
    for(let i = 1; i <= steps; i++){
      cells.push({
        x: wrapX(head.x + dir.x * i),
        y: wrapY(head.y + dir.y * i)
      });
    }
    return cells;
  }

  function isNearAnySnakeSegment(cell, distance){
    return (state.snake || []).some(seg => distanceOnBoard(cell, seg) <= distance);
  }

  function bombWouldFeelUnfair(candidate){
    const radius = state.level >= 9 ? 2 : 1;
    const head = state.snake && state.snake[0];
    const futurePath = forwardDangerCells(isEndlessLevel() ? 5 : 4);

    // Do not spawn bombs in the blast range of the snake/head or directly in the route ahead.
    if(head && distanceOnBoard(candidate, head) <= radius + 2) return true;
    if(isNearAnySnakeSegment(candidate, radius + 1)) return true;
    if(futurePath.some(c => distanceOnBoard(candidate, c) <= radius + 1)) return true;
    if(same(candidate, state.food)) return true;
    if(state.powerup && same(candidate, state.powerup)) return true;

    return false;
  }

  function flameWouldFeelUnfair(candidate){
    const cells = flameCells(candidate);
    const head = state.snake && state.snake[0];
    const futurePath = forwardDangerCells(isEndlessLevel() ? 5 : 4);
    const safeHeadDistance = isEndlessLevel() ? 4 : 3;

    // Flames should never appear on the snake, on pickups, close to the head,
    // or directly in the next few cells the player is already committed to.
    if(cells.some(c => (state.snake || []).some(seg => same(c, seg)))) return true;
    if(cells.some(c => same(c, state.food))) return true;
    if(state.powerup && cells.some(c => same(c, state.powerup))) return true;
    if(head && cells.some(c => distanceOnBoard(c, head) <= safeHeadDistance)) return true;
    if(cells.some(c => futurePath.some(fp => same(c, fp) || distanceOnBoard(c, fp) <= 1))) return true;

    return false;
  }


  function spawnSingleBomb(){
    if(state.level <= 1 || state.gameOver) return;

    let p = null;
    for(let tries = 0; tries < 180; tries++){
      const candidate = randomCell();
      if(!bombWouldFeelUnfair(candidate)){
        p = candidate;
        break;
      }
    }

    // If the board is too crowded, wait instead of forcing an unfair bomb.
    if(!p){
      scheduleNextBomb(isEndlessLevel() ? 900 : 1300);
      return;
    }

    const bomb = {id: `${Date.now()}-${Math.random()}`, x:p.x, y:p.y, countdown:3};
    state.bombs.push(bomb);
    playBombCountdownBeep(3);

    state.bombTimeouts.push(setTimeout(() => {
      const b = state.bombs.find(x => x.id === bomb.id);
      if(b){ b.countdown = 2;
        playBombCountdownBeep(2); draw(); updateUI(); }
    }, 1000));
    state.bombTimeouts.push(setTimeout(() => {
      const b = state.bombs.find(x => x.id === bomb.id);
      if(b){ b.countdown = 1;
        playBombCountdownBeep(1); draw(); updateUI(); }
    }, 2000));
    state.bombTimeouts.push(setTimeout(() => explodeBomb(bomb.id), 3000));

    updateUI();
    draw();
  }

  function spawnBombsForLevel(){
    clearHazardTimers();
    state.bombs = [];
    state.arrows = [];
    state.flames = [];

    if(state.level === 1){
      updateUI();
      draw();
      return;
    }

    if(state.level === 2){
      scheduleNextBomb();
    } else if(state.level === 3){
      scheduleNextArrow(state.level >= 10 ? 1333 : 2000);
    } else if(state.level === 4){
      scheduleNextFlame(4000);
    } else if(state.level === 5){
      scheduleNextBomb();
      scheduleNextArrow(state.level >= 10 ? 1333 : 2000);
    } else if(state.level === 6){
      scheduleNextBomb();
      scheduleNextFlame(4000);
    } else if(state.level === 7){
      scheduleNextArrow(state.level >= 10 ? 1333 : 2000);
      scheduleNextFlame(4000);
    } else {
      scheduleNextBomb();
      scheduleNextArrow(state.level >= 10 ? 1333 : 2000);
      scheduleNextFlame(4000);
    }

    updateUI();
    draw();
  }

  function scheduleNextArrow(delay = 5000){
    if(state.level < 3 || state.gameOver) return;
    if(state.arrowSpawnerTimeout) clearTimeout(state.arrowSpawnerTimeout);
    state.arrowSpawnerTimeout = setTimeout(() => {
      spawnArrowWarning();
    }, delay);
  }

  function spawnArrowWarning(){
    if(state.level < 3 || state.gameOver) return;
    const dirs = ['up','down','left','right'];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];

    let arrow;
    if(dir === 'right'){
      arrow = { id: `${Date.now()}-${Math.random()}`, x: 0, y: Math.floor(Math.random() * GRID), dir, countdown: 3, phase: 'warning', progress: 0 };
    } else if(dir === 'left'){
      arrow = { id: `${Date.now()}-${Math.random()}`, x: GRID - 1, y: Math.floor(Math.random() * GRID), dir, countdown: 3, phase: 'warning', progress: 0 };
    } else if(dir === 'down'){
      arrow = { id: `${Date.now()}-${Math.random()}`, x: Math.floor(Math.random() * GRID), y: 0, dir, countdown: 3, phase: 'warning', progress: 0 };
    } else {
      arrow = { id: `${Date.now()}-${Math.random()}`, x: Math.floor(Math.random() * GRID), y: GRID - 1, dir, countdown: 3, phase: 'warning', progress: 0 };
    }

    state.arrows.push(arrow);

    state.arrowTimeouts.push(setTimeout(() => {
      const a = state.arrows.find(x => x.id === arrow.id);
      if(a){ a.countdown = 2; updateUI(); draw(); }
    }, 1000));

    state.arrowTimeouts.push(setTimeout(() => {
      const a = state.arrows.find(x => x.id === arrow.id);
      if(a){ a.countdown = 1; updateUI(); draw(); }
    }, 2000));

    state.arrowTimeouts.push(setTimeout(() => {
      fireArrow(arrow.id);
    }, 3000));

    updateUI();
    draw();
  }

  function handleArrowHit(arrow){
    const liveArrow = state.arrows.find(a => a.id === arrow.id);
    if(!liveArrow || state.gameOver) return false;

    const hitIndex = state.snake.findIndex(seg => cellInArrowZone(seg, liveArrow));
    if(hitIndex < 0) return false;

    const result = applySegmentDamage(hitIndex);
    state.arrows = state.arrows.filter(a => a.id !== arrow.id);
    updateUI();
    draw();

    if(result === 'head'){
      playDamageSound();
      setGameOver();
    } else {
      scheduleNextArrow(state.level >= 10 ? 2000 : 3000);
    }
    return true;
  }

  function animateArrowFlight(arrow, onDone){
    const steps = GRID;
    let step = 0;
    arrow.phase = 'flying';
    arrow.progress = 0;
    playLaserFlybySound(arrow);
    draw();

    // Check immediately when the laser fires, and again on every animation frame.
    // Before it only checked at the end, so it could visually pass through the snake.
    if(handleArrowHit(arrow)) return;

    function advance(){
      const current = state.arrows.find(a => a.id === arrow.id);
      if(!current || state.gameOver) return;
      step += 1;
      current.progress = step;
      draw();

      if(handleArrowHit(current)) return;

      if(step < steps){
        const t = setTimeout(advance, 55);
        state.arrowTimeouts.push(t);
      } else {
        onDone();
      }
    }

    const t = setTimeout(advance, 55);
    state.arrowTimeouts.push(t);
  }

  function fireArrow(id){
    playLaserSound();
    const arrow = state.arrows.find(a => a.id === id);
    if(!arrow) return;

    animateArrowFlight(arrow, () => {
      const liveArrow = state.arrows.find(a => a.id === id);
      if(!liveArrow) return;

      state.arrows = state.arrows.filter(a => a.id !== id);
      updateUI();
      draw();
      scheduleNextArrow(state.level >= 10 ? 2000 : 3000);
    });
  }


  function addExplosionEffect(bomb){
    if(!bomb) return;
    if(!state.explosions) state.explosions = [];
    state.explosions.push({
      x: bomb.x,
      y: bomb.y,
      radius: state.level >= 9 ? 2 : 1,
      startedAt: Date.now()
    });
    animateExplosionEffect();
  }

  function animateExplosionEffect(){
    if(state.explosionAnimFrame) return;

    const frame = () => {
      state.explosions = (state.explosions || []).filter(ex => Date.now() - ex.startedAt < 650);
      draw();

      if(state.explosions.length){
        state.explosionAnimFrame = requestAnimationFrame(frame);
      } else {
        state.explosionAnimFrame = null;
      }
    };

    state.explosionAnimFrame = requestAnimationFrame(frame);
  }

  function drawExplosionEffects(){
    const now = Date.now();
    (state.explosions || []).forEach(ex => {
      const age = now - ex.startedAt;
      const t = Math.max(0, Math.min(1, age / 650));
      const cx = ex.x * TILE + TILE / 2;
      const cy = ex.y * TILE + TILE / 2;

      ctx.save();

      // expanding shockwave ring
      ctx.globalAlpha = 1 - t;
      ctx.shadowBlur = 28;
      ctx.shadowColor = '#f97316';
      ctx.strokeStyle = 'rgba(254,215,170,' + (0.9 - t * 0.65) + ')';
      ctx.lineWidth = 5 * (1 - t) + 1;
      ctx.beginPath();
      ctx.arc(cx, cy, TILE * (0.35 + t * (1.8 + ex.radius * 0.7)), 0, Math.PI * 2);
      ctx.stroke();

      // hot blast core
      const coreAlpha = Math.max(0, 1 - t * 1.35);
      ctx.globalAlpha = coreAlpha;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, TILE * (0.45 + t * 1.4));
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.22, '#facc15');
      grad.addColorStop(0.55, '#f97316');
      grad.addColorStop(1, 'rgba(239,68,68,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, TILE * (0.45 + t * 1.4), 0, Math.PI * 2);
      ctx.fill();

      // sparks
      ctx.globalAlpha = Math.max(0, 1 - t);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#facc15';
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 3;
      for(let i = 0; i < 10; i++){
        const angle = (Math.PI * 2 / 10) * i + t * 0.7;
        const inner = TILE * (0.25 + t * 0.45);
        const outer = TILE * (0.55 + t * (1.1 + ex.radius * 0.45));
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  function inExplosionZone(cell, bomb){
    const r = state.level >= 9 ? 2 : 1;
    return Math.abs(cell.x - bomb.x) <= r && Math.abs(cell.y - bomb.y) <= r;
  }

  function explodeBomb(id){
    const bomb = state.bombs.find(b => b.id === id);
    if(!bomb) return;

    addExplosionEffect(bomb);
    playExplosionSound();

    const hitIndex = state.snake.findIndex(seg => inExplosionZone(seg, bomb));
    const result = applySegmentDamage(hitIndex);

    state.bombs = state.bombs.filter(b => b.id !== id);
    updateUI();
    draw();

    if(result === 'head'){
      setGameOver();
      return;
    }

    scheduleNextBomb();
  }


  function scheduleNextFlame(delay = 20000){
    if(state.level < 4 || state.gameOver) return;
    if(state.flameSpawnerTimeout) clearTimeout(state.flameSpawnerTimeout);
    state.flameSpawnerTimeout = setTimeout(() => {
      spawnFlame();
    }, delay);
  }

  function distanceOnBoard(a, b){
    const dxRaw = Math.abs(a.x - b.x);
    const dyRaw = Math.abs(a.y - b.y);
    const dx = Math.min(dxRaw, GRID - dxRaw);
    const dy = Math.min(dyRaw, GRID - dyRaw);
    return Math.max(dx, dy);
  }

  function spawnFlame(){
    if(state.level < 4 || state.gameOver) return;
    const dirs = ['up','down','left','right'];
    const length = state.level >= 10 ? 7 : 5;

    let flame = null;
    for(let tries = 0; tries < 180; tries++){
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const anchor = randomFreeCell();
      const candidate = { id: `${Date.now()}-${Math.random()}`, x: anchor.x, y: anchor.y, dir, length };

      if(!flameWouldFeelUnfair(candidate)){
        flame = candidate;
        break;
      }
    }

    // If the board is too crowded, wait and try again instead of forcing an unfair flame.
    if(!flame) return scheduleNextFlame(1600);

playFlameLoopSound();
          state.flames.push(flame);
    playFlameSpawnSound();

    // Safety: with the new spawn rules this should not damage immediately.
    // Keep the check as backup, but the fair-spawn filter prevents it in normal play.
    const hitIndex = state.snake.findIndex(seg => cellInFlameZone(seg, flame));
    const result = applySegmentDamage(hitIndex);
    updateUI();
    draw();
    if(result === 'head'){
      setGameOver();
      return;
    }

    const removeTimer = setTimeout(() => {
      state.flames = state.flames.filter(f => f.id !== flame.id);
      updateUI();
      draw();
    }, 10000);

    const respawnTimer = setTimeout(() => {
      scheduleNextFlame(0);
    }, 20000);

    state.flameTimeouts.push(removeTimer, respawnTimer);
  }


  // ============================================================
  // 14. LEVEL PROGRESSION + MAIN TICK
  // ============================================================
  function nextLevel(){
    if(isEndlessLevel()) return;
    if(!state.damagedThisLevel) unlockTrophy('no_damage');
    if(state.difficulty === 'hard' && state.level >= 5) unlockTrophy('hard_mode');
    if(state.difficulty !== 'hard' && state.level === 10 && state.perfectRunActive && !state.gameOver){
      window.__ES_STORAGE__.setItem('electric-snake-perfect-run-v2-earned', '1');
      unlockTrophy('perfect_run');
    }

    state.level += 1;
    state.damagedThisLevel = false;

    if(state.level > currentUnlocked()){
      setCurrentUnlocked(Math.min(ENDLESS_LEVEL, state.level));
    }

    if(state.level >= ENDLESS_LEVEL){
      state.level = ENDLESS_LEVEL;
      state.endlessPoints = 0;
    }

    renderDifficultyMenu();
    state.progress = 0;
    state.snake = buildLevelStartSnake(Math.min(state.level, 10));
    state.dir = {x:1,y:0};
    state.nextDir = {x:1,y:0};
    state.food = randomCell();
    spawnBombsForLevel();
    renderLevelMenu();
    updateUI();
    draw();
  }

  function tick(){
    updateEndlessComboTimer();
    if(!state.running || state.gameOver) return;
    if(!state.snake.length){
      setGameOver();
      return;
    }

    state.dir = state.nextDir;
    const head = state.snake[0];

    let nx = head.x + state.dir.x;
    let ny = head.y + state.dir.y;

    if(nx < 0) nx = GRID - 1;
    if(nx >= GRID) nx = 0;
    if(ny < 0) ny = GRID - 1;
    if(ny >= GRID) ny = 0;

    const newHead = {x:nx, y:ny};

    const bodyWithoutHead = state.snake.slice(1);
    if(bodyWithoutHead.some(seg => same(seg, newHead))){
      if(consumeShield()){
        updateUI();
        draw();
        return;
      }
      setGameOver();
      return;
    }

    const directBomb = state.bombs.find(b => same(b, newHead));
    if(directBomb){
      // Direct bomb hit must always be handled as a real head hit.
      // If shield is active, the shield is consumed and the snake keeps moving,
      // but the bomb is NOT removed randomly before its countdown/explosion.
      state.snake.unshift(newHead);
      const result = applySegmentDamage(0);

      if(result === 'shield'){
        // Keep normal snake length after the protected move.
        state.snake.pop();
        updateUI();
        draw();
        return;
      }

      setGameOver();
      return;
    }

    if(state.flames.some(f => cellInFlameZone(newHead, f))){
      state.snake.unshift(newHead);
      if(consumeShield()){
        // Shield absorbs the flame hit and the snake keeps moving from the new position,
        // but it should not accidentally grow the snake.
        state.snake.pop();
        updateUI();
        draw();
        return;
      }
      setGameOver();
      return;
    }

    state.snake.unshift(newHead);

    if(state.powerup && same(newHead, state.powerup)){
      activatePowerup(state.powerup.type);
    }

    const ateFood = same(newHead, state.food) || magnetCatchesFood(newHead);

    if(ateFood){
      playSoftPop();
      const x2Active = Date.now() <= state.doublePointsUntil;
      const basePointGain = 1;
      const comboBonus = registerEndlessCombo();
      // Combo bonus is the TOTAL reward tier, not base + bonus.
      // Example: x10 combo => comboBonus 5 => 5 points total, not 6.
      // Combo bonus represents the TOTAL reward tier, not base + bonus.
      const rawGain = isEndlessLevel() ? comboBonus : basePointGain;
      const scoreGain = rawGain * (x2Active ? 2 : 1);
      const coinGain = scoreGain;
      if(isEndlessLevel()) addComboCoinPopup(coinGain, scoreGain);
      state.score += scoreGain;
      if(x2Active){
        state.doublePointsThisRun = (state.doublePointsThisRun || 0) + scoreGain;
        if(state.doublePointsThisRun > (state.bestDoublePointsRun || 0)){
          state.bestDoublePointsRun = state.doublePointsThisRun;
          window.__ES_STORAGE__.setItem('electric-snake-best-double-points', String(state.bestDoublePointsRun));
        }
      }
      if(Date.now() <= state.magnetUntil){
        state.magnetPointsThisRun = (state.magnetPointsThisRun || 0) + 1;
        if(state.magnetPointsThisRun > (state.bestMagnetPoints || 0)){
          state.bestMagnetPoints = state.magnetPointsThisRun;
          window.__ES_STORAGE__.setItem('electric-snake-best-magnet-points', String(state.bestMagnetPoints));
        }
      }
      if(Date.now() <= state.slowmoUntil){
        state.slowmoPointsThisRun = (state.slowmoPointsThisRun || 0) + 1;
        if(state.slowmoPointsThisRun > (state.bestSlowmoPoints || 0)){
          state.bestSlowmoPoints = state.slowmoPointsThisRun;
          window.__ES_STORAGE__.setItem('electric-snake-best-slowmo-points', String(state.bestSlowmoPoints));
        }
      }
      unlockTrophy('first_spark');
      if(isEndlessLevel()){
        state.endlessPoints += scoreGain;
        state.progress = state.endlessPoints;
        if(state.endlessPoints > (state.bestEndless || 0)){
          state.bestEndless = state.endlessPoints;
          window.__ES_STORAGE__.setItem('electric-snake-endless-best', String(state.bestEndless));
        }
      } else {
        state.progress += scoreGain;
      }
      state.coins += coinGain;
    saveCoinsV10();
      addCoinsForValgtSkin(coinGain);
      saveCoins();
      if(state.score > state.best){
        state.best = state.score;
        window.__ES_STORAGE__.setItem('electric-snake-v3-best', String(state.best));
      }
      checkTrophies();
      state.food = randomCell();
      if(state.progress >= pointsPerLevel()){
        nextLevel();
      }
      startLoop();
    } else {
      state.snake.pop();
    }

    checkTrophies();
    updateUI();
    draw();
  }


  // ============================================================
  // 15. DRAWING HELPERS + SKIN RENDERING
  // ============================================================
  function rr(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  // POWERUP_ORB_STYLE: unified canvas icons for all powerups.
  function drawUnifiedPowerup(powerup){
    const cx = powerup.x * TILE + TILE / 2;
    const cy = powerup.y * TILE + TILE / 2;
    const t = Date.now() / 1000;
    const pulse = 0.5 + Math.sin(t * 5.2) * 0.5;
    const radius = TILE * (0.32 + pulse * 0.025);
    const styles = {
      'M': { color:'#a855f7', dark:'#312e81', label:'magnet' },
      'S': { color:'#38bdf8', dark:'#0f172a', label:'slow' },
      'H': { color:'#fb923c', dark:'#7c2d12', label:'half' },
      '🛡': { color:'#22d3ee', dark:'#164e63', label:'shield' },
      '2x': { color:'#facc15', dark:'#713f12', label:'double' }
    };
    const style = styles[powerup.type] || styles.M;

    ctx.save();

    // outer glow / common orb shell
    ctx.shadowBlur = 16 + pulse * 10;
    ctx.shadowColor = style.color;
    const grad = ctx.createRadialGradient(cx - radius * .35, cy - radius * .35, radius * .15, cx, cy, radius * 1.15);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.18, style.color);
    grad.addColorStop(0.74, style.dark);
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // clean rim, same for every icon
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,.82)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * .92, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = style.color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.08, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#f8fafc';
    ctx.fillStyle = '#f8fafc';

    if(powerup.type === 'M'){
      // magnet: clean U-shape with two tips
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy + radius * .05, radius * .43, Math.PI * .15, Math.PI * .85, true);
      ctx.stroke();
      ctx.fillRect(cx - radius * .48, cy - radius * .05, radius * .22, radius * .20);
      ctx.fillRect(cx + radius * .26, cy - radius * .05, radius * .22, radius * .20);
      ctx.fillStyle = style.color;
      ctx.fillRect(cx - radius * .48, cy + radius * .08, radius * .22, radius * .10);
      ctx.fillRect(cx + radius * .26, cy + radius * .08, radius * .22, radius * .10);
    } else if(powerup.type === 'S'){
      // slow: minimal clock
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * .48, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - radius * .30);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * .25, cy + radius * .14);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    } else if(powerup.type === 'H'){
      // half: split orb symbol
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx - radius * .12, cy, radius * .35, Math.PI * .5, Math.PI * 1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + radius * .12, cy, radius * .35, -Math.PI * .5, Math.PI * .5);
      ctx.stroke();
      ctx.strokeStyle = style.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius * .48);
      ctx.lineTo(cx, cy + radius * .48);
      ctx.stroke();
    } else if(powerup.type === '🛡'){
      // shield: sharp shield icon
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius * .52);
      ctx.lineTo(cx + radius * .42, cy - radius * .30);
      ctx.lineTo(cx + radius * .32, cy + radius * .22);
      ctx.quadraticCurveTo(cx, cy + radius * .56, cx - radius * .32, cy + radius * .22);
      ctx.lineTo(cx - radius * .42, cy - radius * .30);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = style.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if(powerup.type === '2x'){
      // double points: same style, readable text
      ctx.font = '900 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('×2', cx, cy + 1);
    }

    // tiny common sparkle for premium feel
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.beginPath();
    ctx.arc(cx - radius * .28, cy - radius * .34, radius * .07, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  let gridCacheCanvas = null;

  function buildGridCache(){
    gridCacheCanvas = document.createElement('canvas');
    gridCacheCanvas.width = canvas.width;
    gridCacheCanvas.height = canvas.height;
    const g = gridCacheCanvas.getContext('2d');
    g.fillStyle = '#020617';
    g.fillRect(0,0,canvas.width,canvas.height);
    g.strokeStyle = '#083344';
    g.lineWidth = 1;
    for(let i=0;i<=GRID;i++){
      const p = i*TILE;
      g.beginPath(); g.moveTo(p,0); g.lineTo(p,canvas.height); g.stroke();
      g.beginPath(); g.moveTo(0,p); g.lineTo(canvas.width,p); g.stroke();
    }
  }

  function drawGrid(){
    // OptimizeV1: grid is static, so draw it from cache instead of redrawing all lines every frame.
    if(!gridCacheCanvas) buildGridCache();
    ctx.drawImage(gridCacheCanvas, 0, 0);
  }


  function drawSpark(x, y, color, size = 2){
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawSkinEffectsBeforeSnake(skin){
    if(!state.snake.length) return;
    const t = Date.now() / 1000;
    const head = state.snake[0];
    const hx = head.x * TILE + TILE / 2;
    const hy = head.y * TILE + TILE / 2;

    
    if(skin.id === 'military'){
      state.snake.forEach((seg, idx) => {
        const cx = seg.x * TILE + TILE / 2;
        const cy = seg.y * TILE + TILE / 2;
        if(idx % 3 === 0){
          drawSpark(cx + Math.sin(t+idx)*TILE*.2, cy - TILE*.22, '#d6b36a', 1.6);
        }
      });
    }

    if(skin.id === 'arctic'){
      // No blinking spark particles on Arctic body.
      // Keeps the skin clean and stable while moving.
    }

if(skin.id === 'neon'){
      // pulserende elektrisk aura + små lyn omkring hovedet
      state.snake.forEach((seg, idx) => {
        const cx = seg.x * TILE + TILE / 2;
        const cy = seg.y * TILE + TILE / 2;
        const pulse = 0.5 + Math.sin(t * 7 + idx * 0.8) * 0.5;
        ctx.shadowBlur = 18 + pulse * 12;
        ctx.shadowColor = idx === 0 ? '#a855f7' : '#22d3ee';
        ctx.strokeStyle = idx === 0 ? 'rgba(168,85,247,0.8)' : 'rgba(34,211,238,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, TILE * (0.35 + pulse * 0.07), 0, Math.PI * 2);
        ctx.stroke();
      });

      for(let i=0;i<4;i++){
        const a = t*8 + i*1.7;
        const x1 = hx + Math.cos(a)*TILE*.32;
        const y1 = hy + Math.sin(a)*TILE*.32;
        const x2 = hx + Math.cos(a+.45)*TILE*.55;
        const y2 = hy + Math.sin(a+.45)*TILE*.55;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#67e8f9';
        ctx.strokeStyle = i%2 ? '#a855f7' : '#67e8f9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo((x1+x2)/2 + Math.sin(a)*5, (y1+y2)/2 + Math.cos(a)*5);
        ctx.lineTo(x2,y2);
        ctx.stroke();
      }
    }

    
    if(skin.id === 'rainbow_disco'){
      // Clean disco aura only. The actual rainbow body/head is drawn in drawSkinSegment.
      // Kept deliberately simple so the skin does not crash or clutter gameplay.
      state.snake.forEach((seg, idx) => {
        if(idx % 3 !== 0) return;
        const cx = seg.x * TILE + TILE / 2;
        const cy = seg.y * TILE + TILE / 2;
        const colors = ['#ef4444','#f97316','#facc15','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899'];
        drawSpark(cx, cy, colors[idx % colors.length], 1.3);
      });
    }


    if(skin.id === 'galaxy'){
      state.snake.forEach((seg, idx) => {
        const cx = seg.x * TILE + TILE / 2;
        const cy = seg.y * TILE + TILE / 2;
        if(idx > 0 && idx % 2 === 0){
          drawSpark(cx - TILE*0.18, cy + TILE*0.18, '#ffffff', 1.4);
        }
      });
    }
  }

  function drawSkinSegment(seg, idx, skin){
    const x = seg.x * TILE + 3;
    const y = seg.y * TILE + 3;
    const s = TILE - 6;
    const isHead = idx === 0;
    const t = Date.now() / 1000;

    
    if(skin.id === 'military'){
      const grad = ctx.createLinearGradient(x, y, x + s, y + s);
      grad.addColorStop(0, '#111827');
      grad.addColorStop(0.28, '#5b4636');
      grad.addColorStop(0.55, '#3f4f2f');
      grad.addColorStop(0.82, '#8a6a43');
      grad.addColorStop(1, '#0f172a');

      ctx.shadowBlur = isHead ? 20 : 11;
      ctx.shadowColor = '#d6b36a';
      ctx.fillStyle = grad;
      rr(x, y, s, s, isHead ? 13 : 9);
      ctx.fill();

      // bold woodland camo pattern inspired by the uploaded reference
      ctx.shadowBlur = 0;

      function blob(points, color){
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x + s*points[0][0], y + s*points[0][1]);
        for(let i=1;i<points.length;i++){
          ctx.lineTo(x + s*points[i][0], y + s*points[i][1]);
        }
        ctx.closePath();
        ctx.fill();
      }

      const wob = (idx % 4) * 0.035;

      blob([[0.02,0.22+wob],[0.18,0.10],[0.36,0.16],[0.42,0.30],[0.31,0.43],[0.12,0.39]], 'rgba(204,194,160,.82)');
      blob([[0.58,0.05],[0.84,0.10+wob],[0.98,0.26],[0.86,0.42],[0.64,0.36],[0.50,0.20]], 'rgba(204,194,160,.75)');
      blob([[0.12,0.52],[0.30,0.42],[0.48,0.52+wob],[0.44,0.72],[0.24,0.80],[0.06,0.68]], 'rgba(75,88,48,.84)');
      blob([[0.56,0.54-wob],[0.76,0.46],[0.96,0.58],[0.90,0.80],[0.70,0.88],[0.52,0.74]], 'rgba(65,78,43,.82)');
      blob([[0.30,0.02],[0.50,0.08],[0.55,0.22],[0.42,0.34],[0.25,0.28],[0.20,0.12]], 'rgba(20,24,22,.86)');
      blob([[0.02,0.78],[0.18,0.66],[0.34,0.74],[0.30,0.96],[0.10,0.98]], 'rgba(17,24,21,.86)');
      blob([[0.74,0.28],[0.94,0.34],[0.98,0.50],[0.84,0.58],[0.68,0.48]], 'rgba(28,30,27,.82)');
      blob([[0.38,0.34],[0.56,0.28],[0.68,0.40],[0.60,0.56],[0.42,0.54]], 'rgba(92,75,58,.76)');
      blob([[0.36,0.82],[0.54,0.76],[0.66,0.90],[0.54,0.99],[0.38,0.96]], 'rgba(105,88,66,.74)');
      blob([[0.08,0.08],[0.16,0.04],[0.22,0.10],[0.16,0.17],[0.07,0.15]], 'rgba(55,65,42,.80)');
      blob([[0.80,0.78],[0.92,0.72],[0.99,0.86],[0.90,0.96],[0.78,0.92]], 'rgba(201,191,160,.70)');

      ctx.strokeStyle = 'rgba(214,179,106,.55)';
      ctx.lineWidth = 1.5;
      rr(x+3, y+3, s-6, s-6, isHead ? 10 : 7);
      ctx.stroke();

      if(isHead){
        ctx.fillStyle = '#d6b36a';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', x+s*.50, y+s*.35);

        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.arc(x+s*.32, y+s*.55, 2.6, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x+s*.68, y+s*.55, 2.6, 0, Math.PI*2); ctx.fill();
      }
      return;
    }

    if(skin.id === 'arctic'){
      const grad = ctx.createLinearGradient(x, y, x + s, y + s);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(0.40, '#dbeafe');
      grad.addColorStop(0.72, '#93c5fd');
      grad.addColorStop(1, '#334155');

      ctx.shadowBlur = isHead ? 24 : 14;
      ctx.shadowColor = '#bfdbfe';
      ctx.fillStyle = grad;
      rr(x, y, s, s, isHead ? 13 : 9);
      ctx.fill();

      if(isHead){
        // CLEAN ARCTIC HEAD: simple helmet, mask, eyes and jaw only.
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(248,250,252,.92)';
        ctx.beginPath();
        ctx.moveTo(x+s*.20, y+s*.26);
        ctx.lineTo(x+s*.50, y+s*.10);
        ctx.lineTo(x+s*.80, y+s*.26);
        ctx.lineTo(x+s*.68, y+s*.38);
        ctx.lineTo(x+s*.32, y+s*.38);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(2,6,23,.94)';
        ctx.beginPath();
        ctx.ellipse(x+s*.50, y+s*.49, s*.34, s*.18, 0, 0, Math.PI*2);
        ctx.fill();

        ctx.shadowBlur = 16;
        ctx.shadowColor = '#38bdf8';
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.ellipse(x+s*.37, y+s*.48, s*.075, s*.052, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x+s*.63, y+s*.48, s*.075, s*.052, 0, 0, Math.PI*2); ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#020617';
        ctx.beginPath(); ctx.arc(x+s*.37, y+s*.48, s*.018, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x+s*.63, y+s*.48, s*.018, 0, Math.PI*2); ctx.fill();

        ctx.strokeStyle = 'rgba(224,242,254,.92)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x+s*.34, y+s*.70);
        ctx.quadraticCurveTo(x+s*.50, y+s*.76, x+s*.66, y+s*.70);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255,255,255,.55)';
        ctx.lineWidth = 1.4;
        rr(x+3, y+3, s-6, s-6, 10);
        ctx.stroke();
      } else {
        // CLEAN ORDERED ARCTIC BODY: Xbox-style grey/white camo, repeated per segment.
        // No random speckles/loose lines — the pattern now feels intentional and connected.
        ctx.shadowBlur = 0;

        function smoothBlob(points, color){
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(x + s*points[0][0], y + s*points[0][1]);
          for(let i = 1; i < points.length; i++){
            const p = points[i];
            ctx.lineTo(x + s*p[0], y + s*p[1]);
          }
          ctx.closePath();
          ctx.fill();
        }

        // Small controlled offset so the body has rhythm, not chaos.
        const wave = (idx % 2) * 0.035;

        // soft white base patches
        smoothBlob([[0.04,0.18+wave],[0.22,0.08],[0.43,0.16],[0.38,0.36],[0.18,0.40],[0.02,0.31]], 'rgba(255,255,255,.55)');
        smoothBlob([[0.54,0.10],[0.83,0.14+wave],[0.98,0.32],[0.84,0.46],[0.60,0.38],[0.47,0.24]], 'rgba(248,250,252,.46)');

        // medium grey camo shapes like the reference
        smoothBlob([[0.05,0.58],[0.25,0.47],[0.45,0.55+wave],[0.38,0.76],[0.14,0.82],[0.00,0.70]], 'rgba(156,163,175,.46)');
        smoothBlob([[0.52,0.57-wave],[0.72,0.47],[0.97,0.60],[0.91,0.80],[0.68,0.88],[0.49,0.74]], 'rgba(148,163,184,.50)');

        // darker grey pieces for contrast, but not too noisy
        smoothBlob([[0.25,0.30],[0.42,0.24],[0.58,0.36],[0.51,0.51],[0.33,0.49]], 'rgba(100,116,139,.34)');
        smoothBlob([[0.68,0.20],[0.88,0.25],[0.94,0.39],[0.78,0.46],[0.62,0.35]], 'rgba(71,85,105,.28)');
        smoothBlob([[0.28,0.78],[0.48,0.72],[0.62,0.87],[0.50,0.98],[0.30,0.94]], 'rgba(71,85,105,.24)');

        // controlled black accents: gives the Arctic camo depth like the reference,
        // but keeps it clean and readable instead of random/noisy.
        smoothBlob([[0.08,0.40+wave],[0.25,0.32],[0.40,0.42],[0.33,0.58],[0.13,0.58]], 'rgba(2,6,23,.72)');
        smoothBlob([[0.54,0.70-wave],[0.75,0.61],[0.92,0.74],[0.83,0.92],[0.58,0.88]], 'rgba(2,6,23,.68)');
        // Removed one-off black patch so no single segment gets an odd black dot.

        // Extra dark flow patches so the camo reads clearly black/grey/white,
        // but still repeats in a controlled pattern across the body.
        smoothBlob([[0.02,0.76],[0.16,0.66],[0.29,0.75],[0.23,0.92],[0.06,0.95]], 'rgba(2,6,23,.52)');
        if(idx % 2 === 1){
          smoothBlob([[0.45,0.14],[0.58,0.09],[0.70,0.18],[0.63,0.31],[0.48,0.28]], 'rgba(2,6,23,.46)');
        }

        // Removed the white diagonal highlight lines from the body.
        // They overlapped the black camo patches and made the pattern look messy.
        // The body now relies on clean camo blobs + a subtle edge only.

        // Subtle border only — keeps the body readable in motion.
        ctx.strokeStyle = 'rgba(255,255,255,.26)';
        ctx.lineWidth = 1;
        rr(x+3, y+3, s-6, s-6, 7);
        ctx.stroke();
      }

      return;
    }


    if(skin.id === 'shadow_venom'){
      const grad = ctx.createLinearGradient(x, y, x + s, y + s);
      grad.addColorStop(0, isHead ? '#240046' : '#05000d'); grad.addColorStop(.45, isHead ? '#7e22ce' : '#111827'); grad.addColorStop(1, '#3b0764');
      ctx.shadowBlur = isHead ? 28 : 16; ctx.shadowColor = '#a855f7'; ctx.fillStyle = grad; rr(x,y,s,s,isHead?13:9); ctx.fill(); ctx.shadowBlur = 0;
      if(isHead){
        ctx.fillStyle = 'rgba(2,6,23,.50)'; ctx.beginPath(); ctx.moveTo(x+s*.16,y+s*.58); ctx.lineTo(x+s*.84,y+s*.48); ctx.lineTo(x+s*.72,y+s*.86); ctx.lineTo(x+s*.28,y+s*.86); ctx.closePath(); ctx.fill();
        ctx.shadowBlur = 14; ctx.shadowColor = '#c084fc'; ctx.fillStyle = '#c084fc';
        ctx.beginPath(); ctx.moveTo(x+s*.25,y+s*.40); ctx.lineTo(x+s*.43,y+s*.36); ctx.lineTo(x+s*.36,y+s*.49); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x+s*.75,y+s*.40); ctx.lineTo(x+s*.57,y+s*.36); ctx.lineTo(x+s*.64,y+s*.49); ctx.closePath(); ctx.fill();
        ctx.shadowBlur = 0; ctx.strokeStyle = '#020617'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x+s*.34,y+s*.67); ctx.quadraticCurveTo(x+s*.50,y+s*.76,x+s*.66,y+s*.67); ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.moveTo(x+s*.42,y+s*.70); ctx.lineTo(x+s*.46,y+s*.84); ctx.lineTo(x+s*.50,y+s*.70); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(x+s*.58,y+s*.70); ctx.lineTo(x+s*.54,y+s*.84); ctx.lineTo(x+s*.50,y+s*.70); ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(168,85,247,.30)'; ctx.beginPath(); ctx.moveTo(x+s*.08,y+s*.26); ctx.lineTo(x+s*.48,y+s*.16); ctx.lineTo(x+s*.92,y+s*.32); ctx.lineTo(x+s*.78,y+s*.48); ctx.lineTo(x+s*.40,y+s*.38); ctx.lineTo(x+s*.18,y+s*.52); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(2,6,23,.38)'; ctx.beginPath(); ctx.moveTo(x+s*.12,y+s*.72); ctx.lineTo(x+s*.48,y+s*.58); ctx.lineTo(x+s*.88,y+s*.72); ctx.lineTo(x+s*.72,y+s*.91); ctx.lineTo(x+s*.30,y+s*.88); ctx.closePath(); ctx.fill();
      }
      return;
    }

    if(skin.id === 'cyber_chrome'){
      const grad = ctx.createLinearGradient(x, y, x + s, y + s);
      grad.addColorStop(0,'#f8fafc'); grad.addColorStop(.25,'#94a3b8'); grad.addColorStop(.52,'#38bdf8'); grad.addColorStop(.72,'#64748b'); grad.addColorStop(1,'#e5e7eb');
      ctx.shadowBlur = isHead ? 24 : 14; ctx.shadowColor = '#38bdf8'; ctx.fillStyle = grad; rr(x,y,s,s,isHead?13:9); ctx.fill(); ctx.shadowBlur = 0;
      if(isHead){
        ctx.fillStyle = 'rgba(2,6,23,.86)'; ctx.beginPath(); ctx.moveTo(x+s*.18,y+s*.38); ctx.lineTo(x+s*.82,y+s*.33); ctx.lineTo(x+s*.76,y+s*.53); ctx.lineTo(x+s*.24,y+s*.57); ctx.closePath(); ctx.fill();
        ctx.shadowBlur = 14; ctx.shadowColor = '#67e8f9'; ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = 2.3; ctx.beginPath(); ctx.moveTo(x+s*.26,y+s*.46); ctx.lineTo(x+s*.74,y+s*.42); ctx.stroke(); ctx.shadowBlur = 0;
        ctx.strokeStyle = '#020617'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x+s*.34,y+s*.72); ctx.lineTo(x+s*.66,y+s*.69); ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(248,250,252,.34)'; ctx.beginPath(); ctx.moveTo(x+s*.10,y+s*.18); ctx.lineTo(x+s*.50,y+s*.08); ctx.lineTo(x+s*.42,y+s*.42); ctx.lineTo(x+s*.08,y+s*.48); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(15,23,42,.25)'; ctx.beginPath(); ctx.moveTo(x+s*.56,y+s*.54); ctx.lineTo(x+s*.94,y+s*.42); ctx.lineTo(x+s*.86,y+s*.82); ctx.lineTo(x+s*.46,y+s*.90); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x+s*.16,y+s*.68); ctx.lineTo(x+s*.42,y+s*.58); ctx.lineTo(x+s*.62,y+s*.68); ctx.lineTo(x+s*.86,y+s*.56); ctx.stroke();
      }
      return;
    }

    if(skin.id === 'rainbow_disco'){
      const rainbow = ['#ef4444','#f97316','#facc15','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899'];
      const c = rainbow[Math.abs(idx) % rainbow.length];
      const c2 = rainbow[(Math.abs(idx) + 1) % rainbow.length];
      const c3 = rainbow[(Math.abs(idx) + 2) % rainbow.length];

      ctx.shadowBlur = isHead ? 26 : 16;
      ctx.shadowColor = isHead ? '#ffffff' : c;

      if(isHead){
        // Rainbow Disco head: all rainbow colors, clean form, two black eyes.
        const grad = ctx.createLinearGradient(x, y, x + s, y + s);
        rainbow.forEach((col, i) => grad.addColorStop(i / (rainbow.length - 1), col));
        ctx.fillStyle = grad;
        rr(x, y, s, s, 13);
        ctx.fill();

        // Glassy shine so the rainbow head still reads as one premium skin.
        ctx.shadowBlur = 0;
        const shine = ctx.createLinearGradient(x, y, x + s, y + s*.35);
        shine.addColorStop(0, 'rgba(255,255,255,.55)');
        shine.addColorStop(.55, 'rgba(255,255,255,.10)');
        shine.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = shine;
        ctx.beginPath();
        ctx.moveTo(x+s*.16, y+s*.18);
        ctx.lineTo(x+s*.82, y+s*.10);
        ctx.lineTo(x+s*.70, y+s*.36);
        ctx.lineTo(x+s*.25, y+s*.40);
        ctx.closePath();
        ctx.fill();

        // Subtle dark lower jaw for contrast.
        ctx.fillStyle = 'rgba(2,6,23,.30)';
        ctx.beginPath();
        ctx.moveTo(x+s*.18, y+s*.66);
        ctx.lineTo(x+s*.82, y+s*.58);
        ctx.lineTo(x+s*.72, y+s*.82);
        ctx.lineTo(x+s*.28, y+s*.86);
        ctx.closePath();
        ctx.fill();

        // Bigger clean disco glasses. No eyebrows.
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#000000';
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.moveTo(x+s*.14, y+s*.38);
        ctx.lineTo(x+s*.38, y+s*.31);
        ctx.lineTo(x+s*.49, y+s*.38);
        ctx.lineTo(x+s*.61, y+s*.31);
        ctx.lineTo(x+s*.86, y+s*.38);
        ctx.lineTo(x+s*.81, y+s*.58);
        ctx.lineTo(x+s*.63, y+s*.64);
        ctx.lineTo(x+s*.50, y+s*.55);
        ctx.lineTo(x+s*.37, y+s*.64);
        ctx.lineTo(x+s*.19, y+s*.58);
        ctx.closePath();
        ctx.fill();

        // Small glass shine so the shades look cool instead of flat.
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255,255,255,.34)';
        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x+s*.22, y+s*.40);
        ctx.lineTo(x+s*.39, y+s*.36);
        ctx.moveTo(x+s*.61, y+s*.36);
        ctx.lineTo(x+s*.78, y+s*.40);
        ctx.stroke();

        // Cool simple smile.
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x+s*.35, y+s*.73);
        ctx.quadraticCurveTo(x+s*.52, y+s*.82, x+s*.70, y+s*.70);
        ctx.stroke();

        ctx.lineCap = 'butt';
        ctx.strokeStyle = 'rgba(255,255,255,.72)';
        ctx.lineWidth = 1.5;
        rr(x+3, y+3, s-6, s-6, 10);
        ctx.stroke();
      } else {
        // Each body segment has its own rainbow color.
        const grad = ctx.createLinearGradient(x, y, x + s, y + s);
        grad.addColorStop(0, c);
        grad.addColorStop(.55, c2);
        grad.addColorStop(1, c3);
        ctx.fillStyle = grad;
        rr(x, y, s, s, 9);
        ctx.fill();

        // Disco facet pattern: controlled, not random.
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,.22)';
        ctx.beginPath();
        ctx.moveTo(x+s*.10, y+s*.15);
        ctx.lineTo(x+s*.48, y+s*.08);
        ctx.lineTo(x+s*.36, y+s*.42);
        ctx.lineTo(x+s*.06, y+s*.44);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(0,0,0,.16)';
        ctx.beginPath();
        ctx.moveTo(x+s*.54, y+s*.52);
        ctx.lineTo(x+s*.96, y+s*.38);
        ctx.lineTo(x+s*.86, y+s*.84);
        ctx.lineTo(x+s*.48, y+s*.90);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,.38)';
        ctx.lineWidth = 1.2;
        rr(x+3, y+3, s-6, s-6, 7);
        ctx.stroke();
      }
      return;
    }

if(skin.id === 'fire'){
      const grad = ctx.createRadialGradient(x+s*0.5,y+s*0.35,2,x+s*0.5,y+s*0.5,s*0.65);
      grad.addColorStop(0, isHead ? '#fff7ad' : '#facc15');
      grad.addColorStop(0.45, isHead ? '#fb923c' : '#f97316');
      grad.addColorStop(1, '#b91c1c');
      ctx.shadowBlur = isHead ? 26 : 16;
      ctx.shadowColor = '#fb923c';
      ctx.fillStyle = grad;
      rr(x, y, s, s, isHead ? 13 : 9);
      ctx.fill();

      if(isHead){
        for(let i = 0; i < 4; i++){
          const px = x + s * (0.18 + i * 0.18);
          const flameH = s * (0.25 + 0.08 * Math.sin(t * 8 + i));
          ctx.shadowBlur = 16;
          ctx.shadowColor = '#fb923c';
          ctx.fillStyle = i % 2 ? '#f97316' : '#facc15';
          ctx.beginPath();
          ctx.moveTo(px, y + s * 0.20);
          ctx.quadraticCurveTo(px + s * 0.06, y - flameH, px + s * 0.13, y + s * 0.20);
          ctx.quadraticCurveTo(px + s * 0.06, y + s * 0.05, px, y + s * 0.20);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#090909';
        ctx.beginPath(); ctx.arc(x+s*0.32,y+s*0.44,3.2,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x+s*0.68,y+s*0.44,3.2,0,Math.PI*2); ctx.fill();
      }
      return;
    }

    if(skin.id === 'gold'){
      const grad = ctx.createLinearGradient(x, y, x + s, y + s);
      grad.addColorStop(0, '#92400e');
      grad.addColorStop(0.25, '#f59e0b');
      grad.addColorStop(0.55, '#fff7ad');
      grad.addColorStop(0.8, '#facc15');
      grad.addColorStop(1, '#b45309');
      ctx.shadowBlur = isHead ? 26 : 14;
      ctx.shadowColor = '#facc15';
      ctx.fillStyle = grad;
      rr(x, y, s, s, isHead ? 13 : 9);
      ctx.fill();

      if(isHead){
        // lille kongekrone / premium coin vibe
        ctx.fillStyle = '#fff7ad';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#fff7ad';
        ctx.beginPath();
        ctx.moveTo(x+s*.23,y+s*.18);
        ctx.lineTo(x+s*.34,y-s*.02);
        ctx.lineTo(x+s*.48,y+s*.18);
        ctx.lineTo(x+s*.62,y-s*.02);
        ctx.lineTo(x+s*.76,y+s*.18);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#111111';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', x + s*0.34, y + s*0.42);
        ctx.fillText('$', x + s*0.66, y + s*0.42);
      }
      return;
    }

    if(skin.id === 'toxic'){
      const grad = ctx.createRadialGradient(x+s*0.5,y+s*0.35,2,x+s*0.5,y+s*0.5,s*0.65);
      grad.addColorStop(0, isHead ? '#ecfccb' : '#bef264');
      grad.addColorStop(0.42, '#22c55e');
      grad.addColorStop(1, '#581c87');
      ctx.shadowBlur = isHead ? 24 : 14;
      ctx.shadowColor = '#a3e635';
      ctx.fillStyle = grad;
      rr(x, y, s, s, isHead ? 13 : 9);
      ctx.fill();

      ctx.shadowBlur = 8;
      ctx.shadowColor = '#a3e635';
      ctx.fillStyle = '#a3e635';
      const drops = isHead ? 3 : 1;
      for(let d=0; d<drops; d++){
        const px = x + s*(0.25 + d*0.22);
        const py = y + s*(0.78 + 0.05*Math.sin(t*5+d+idx));
        ctx.beginPath();
        ctx.ellipse(px, py, 2.0, 4.0, 0, 0, Math.PI*2);
        ctx.fill();
      }

      if(isHead){
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(x+s*0.32,y+s*0.40,3,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x+s*0.68,y+s*0.40,3,0,Math.PI*2); ctx.fill();

        // gift-tænder
        ctx.fillStyle = '#ecfccb';
        ctx.beginPath();
        ctx.moveTo(x+s*.38,y+s*.62); ctx.lineTo(x+s*.44,y+s*.82); ctx.lineTo(x+s*.50,y+s*.62);
        ctx.moveTo(x+s*.56,y+s*.62); ctx.lineTo(x+s*.62,y+s*.82); ctx.lineTo(x+s*.68,y+s*.62);
        ctx.fill();

        // bobler omkring hovedet
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 1.5;
        for(let b=0;b<3;b++){
          ctx.beginPath();
          ctx.arc(x+s*(.18+b*.32), y+s*(.18+.04*Math.sin(t*4+b)), 3+b, 0, Math.PI*2);
          ctx.stroke();
        }
      }
      return;
    }

    if(skin.id === 'galaxy'){
      state.snake.forEach((seg, idx) => {
        const cx = seg.x * TILE + TILE / 2;
        const cy = seg.y * TILE + TILE / 2;
        if(idx > 0 && idx % 2 === 0){
          drawSpark(cx - TILE*0.18, cy + TILE*0.18, '#ffffff', 1.4);
        }
      });

      const tw = 0.5 + 0.5*Math.sin(t*3 + idx);
      const grad = ctx.createLinearGradient(x, y, x + s, y + s);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.45, '#0f172a');
      grad.addColorStop(1, '#111827');
      ctx.shadowBlur = isHead ? 24 : 12;
      ctx.shadowColor = 'rgba(255,255,255,0.35)';
      ctx.fillStyle = grad;
      rr(x, y, s, s, isHead ? 13 : 9);
      ctx.fill();

      // stars in body
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = '#ffffff';
      const stars = isHead ? 3 : 2;
      for(let st=0; st<stars; st++){
        const sx = x + s*(0.22 + ((st*3+idx)%5)*0.14);
        const sy = y + s*(0.22 + ((st*5+idx)%4)*0.16);
        const sr = (isHead ? 1.7 : 1.3) + tw*0.6;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI*2);
        ctx.fill();
      }

      if(isHead){
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✦', x+s*0.34, y+s*0.40);
        ctx.fillText('✦', x+s*0.66, y+s*0.40);
      }
      return;
    }

    // Neon
    const pulse = 0.5 + Math.sin(t * 6 + idx * 0.6) * 0.5;
    ctx.shadowBlur = isHead ? 30 : (16 + pulse * 12);
    ctx.shadowColor = isHead ? '#f0abfc' : '#22d3ee';
    ctx.fillStyle = isHead ? '#a855f7' : (idx % 2 ? '#22d3ee' : '#38bdf8');
    rr(x, y, s, s, isHead ? 13 : 9);
    ctx.fill();

    ctx.strokeStyle = isHead ? 'rgba(255,255,255,.95)' : 'rgba(236,254,255,0.45)';
    ctx.lineWidth = 2;
    rr(x + 3, y + 3, s - 6, s - 6, isHead ? 10 : 7);
    ctx.stroke();

    if(isHead){
      // lilla elektrisk krone
      ctx.strokeStyle = '#f0abfc';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#f0abfc';
      ctx.beginPath();
      ctx.moveTo(x+s*.24,y+s*.18); ctx.lineTo(x+s*.35,y-s*.04); ctx.lineTo(x+s*.46,y+s*.18);
      ctx.moveTo(x+s*.54,y+s*.18); ctx.lineTo(x+s*.65,y-s*.04); ctx.lineTo(x+s*.76,y+s*.18);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(x+s*0.34,y+s*0.40,2.8,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x+s*0.66,y+s*0.40,2.8,0,Math.PI*2); ctx.fill();
    }
  }


  function drawEndlessComboAura(){
    updateEndlessComboTimer();
    if(!isEndlessLevel() || !state.endlessCombo || state.endlessCombo < 5) return;
    const strength = Math.min(1, state.endlessCombo / 12);
    const t = Date.now() / 180;
    const step = state.snake.length > 18 ? 2 : 1;
    const color = state.endlessCombo >= 10 ? '#facc15' : '#22d3ee';

    ctx.save();
    ctx.globalAlpha = 0.10 + strength * 0.13;
    ctx.shadowBlur = 12 + strength * 14;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 + strength * 1.5;

    for(let idx = 0; idx < state.snake.length; idx += step){
      const seg = state.snake[idx];
      const cx = seg.x * TILE + TILE / 2;
      const cy = seg.y * TILE + TILE / 2;
      const radius = TILE * (0.46 + Math.sin(t + idx) * 0.035);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }


  // ============================================================
  // 16. ENDLESS COMBO VISUALS
  // ============================================================
  function addRewardPopup(text, combo = 1){
    if(!state.snake || !state.snake.length) return;
    const head = state.snake[0];
    if(!state.comboPopups) state.comboPopups = [];
    state.comboPopups.push({
      x: head.x,
      y: head.y,
      text,
      combo,
      created: Date.now(),
      life: combo >= 10 ? 760 : 650
    });
    if(state.comboPopups.length > 10) state.comboPopups.shift();
  }

  function addComboCoinPopup(coinGain, scoreGain){
    addRewardPopup('+' + coinGain + ' 🪙', state.endlessCombo || 1);
  }

  function addCenterMessage(text, color = '#22d3ee', life = 850){
    const msgNow = Date.now();
    const msgText = arguments[0];
    if(msgText === 'ENDLESS STORM' && state.lastEndlessStormMessageAt && msgNow - state.lastEndlessStormMessageAt < 2500) return;
    if(msgText === 'ENDLESS STORM') state.lastEndlessStormMessageAt = msgNow;

    if(!state.centerMessages) state.centerMessages = [];
    state.centerMessages.push({text, color, created: Date.now(), life});
    if(state.centerMessages.length > 4) state.centerMessages.shift();
  }

  function drawComboCoinPopups(){
    if(!state.comboPopups || !state.comboPopups.length) return;
    const now = Date.now();
    state.comboPopups = state.comboPopups.filter(p => now - p.created < p.life);
    state.comboPopups.forEach(p => {
      const age = now - p.created;
      const t = Math.max(0, Math.min(1, age / p.life));
      const cx = p.x * TILE + TILE / 2;
      const cy = p.y * TILE + TILE / 2 - 12 - t * 22;
      ctx.save();
      ctx.globalAlpha = 1 - t;
      ctx.shadowBlur = p.combo >= 10 ? 18 : 12;
      ctx.shadowColor = p.combo >= 10 ? '#facc15' : '#22d3ee';
      ctx.fillStyle = p.combo >= 10 ? '#facc15' : '#e0f2fe';
      ctx.font = p.combo >= 10 ? 'bold 18px Arial' : 'bold 15px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.text, cx, cy);
      ctx.restore();
    });
  }

  function drawCenterMessages(){
    if(!state.centerMessages || !state.centerMessages.length) return;
    const now = Date.now();
    state.centerMessages = state.centerMessages.filter(m => now - m.created < m.life);
    state.centerMessages.forEach((m, idx) => {
      const age = now - m.created;
      const t = Math.max(0, Math.min(1, age / m.life));
      const scale = 1 + Math.sin(t * Math.PI) * 0.16;
      ctx.save();
      ctx.globalAlpha = 1 - Math.max(0, (t - 0.62) / 0.38);
      ctx.translate(canvas.width / 2, canvas.height * 0.25 + idx * 34);
      ctx.scale(scale, scale);
      ctx.shadowBlur = 22;
      ctx.shadowColor = m.color;
      ctx.fillStyle = m.color;
      ctx.font = 'bold 30px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(m.text, 0, 0);
      ctx.restore();
    });
  }

  function drawEndlessComboUI(){
    updateEndlessComboTimer();
    if(!isEndlessLevel() || !state.endlessCombo) return;

    // Minimal Endless combo UI: small top-right text only, no box/overlay.
    const isMax = state.endlessCombo >= 10;
    const label = isMax ? 'MAX x' + state.endlessCombo + ' ⚡' : 'x' + state.endlessCombo;
    const bonus = comboBonusCoins(state.endlessCombo);
    const coinText = bonus > 0 ? '    +' + bonus + ' 🪙' : '';

    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.shadowBlur = isMax ? 10 : 5;
    ctx.shadowColor = isMax ? '#facc15' : '#22d3ee';
    ctx.fillStyle = isMax ? '#facc15' : '#e0f2fe';
    ctx.font = isMax ? 'bold 15px Arial' : 'bold 14px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(label + coinText, canvas.width - 12, 12);
    ctx.restore();
  }



  // ============================================================
  // AUDIO SYSTEM: ELECTRIC SOUND ENGINE V2
  // Web Audio only: no external files, no delays, mobile-friendly unlock.
  // Layers:
  // - Reward: food, coin/combo, trophies
  // - Danger: adaptive bomb/laser/flame tension
  // - Impact: shield, damage, death
  // - UX: start, pause, turns, mute button
  // ============================================================
  function updateSoundButton(){
    const btn = $('soundBtn');
    if(!btn) return;
    btn.textContent = state.audioMuted ? '🔇 Lyd' : '🔊 Lyd';
    btn.title = state.audioMuted ? 'Slå lyd til' : 'Slå lyd fra';
    btn.style.opacity = state.audioMuted ? '0.72' : '1';
  }

  function toggleSound(){
    state.audioMuted = !state.audioMuted;
    window.__ES_STORAGE__.setItem('electric-snake-audio-muted', state.audioMuted ? '1' : '0');
    if(!state.audioMuted){
      resumeAudio();
      playStartSound();
    } else if(state.hazardGain && state.audioCtx){
      state.hazardGain.gain.setTargetAtTime(0, state.audioCtx.currentTime, 0.04);
    }
    updateSoundButton();
  }

  function initAudio(){
    if(state.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if(!AudioContext) return;

    state.audioCtx = new AudioContext();
    state.audioMaster = state.audioCtx.createGain();
    state.audioMaster.gain.value = state.audioMasterVolume || 0.18;

    state.audioCompressor = state.audioCtx.createDynamicsCompressor();
    state.audioCompressor.threshold.value = -24;
    state.audioCompressor.knee.value = 20;
    state.audioCompressor.ratio.value = 6;
    state.audioCompressor.attack.value = 0.004;
    state.audioCompressor.release.value = 0.16;

    state.audioMaster.connect(state.audioCompressor);
    state.audioCompressor.connect(state.audioCtx.destination);

    // Continuous danger bed. It stays silent until danger is near.
    state.hazardOsc = state.audioCtx.createOscillator();
    state.hazardGain = state.audioCtx.createGain();
    state.hazardFilter = state.audioCtx.createBiquadFilter();
    state.hazardOsc.type = 'triangle';
    state.hazardOsc.frequency.value = 70;
    state.hazardFilter.type = 'lowpass';
    state.hazardFilter.frequency.value = 480;
    state.hazardGain.gain.value = 0;
    state.hazardOsc.connect(state.hazardFilter);
    state.hazardFilter.connect(state.hazardGain);
    state.hazardGain.connect(state.audioMaster);
    state.hazardOsc.start();

    state.audioEnabled = true;
  }

  function resumeAudio(){
    initAudio();
    if(state.audioCtx && state.audioCtx.state === 'suspended') state.audioCtx.resume();
  }

  function clamp01(v){ return Math.max(0, Math.min(1, v)); }

  function wrappedDistance(a, b){
    const dxRaw = Math.abs(a.x - b.x);
    const dyRaw = Math.abs(a.y - b.y);
    const dx = Math.min(dxRaw, GRID - dxRaw);
    const dy = Math.min(dyRaw, GRID - dyRaw);
    return Math.sqrt(dx * dx + dy * dy);
  }

  function nearestBombDistance(){
    if(!state.snake.length) return Infinity;
    const head = state.snake[0];
    let best = Infinity;
    (state.bombs || []).forEach(b => best = Math.min(best, wrappedDistance(head, b)));
    return best;
  }

  function nearestFlameDistance(){
    if(!state.snake.length) return Infinity;
    const head = state.snake[0];
    let best = Infinity;
    (state.flames || []).forEach(f => flameCells(f).forEach(c => best = Math.min(best, wrappedDistance(head, c))));
    return best;
  }

  function nearestArrowDistance(){
    if(!state.snake.length) return Infinity;
    const head = state.snake[0];
    let best = Infinity;
    (state.arrows || []).forEach(a => arrowCells(a).forEach(c => best = Math.min(best, wrappedDistance(head, c))));
    return best;
  }

  function updateProximityAudio(){ return; }

  function makeBeep(freqStart, freqEnd, duration, volume, type, delay = 0){
    resumeAudio();
    if(!state.audioCtx || state.audioMuted) return;
    const now = state.audioCtx.currentTime + delay;
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(Math.max(1, freqStart), now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.010);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(state.audioMaster || state.audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  function playNoiseBurst(duration, volume, filterFreq, filterType = 'bandpass', delay = 0){
    resumeAudio();
    if(!state.audioCtx || state.audioMuted) return;
    const now = state.audioCtx.currentTime + delay;
    const size = Math.floor(state.audioCtx.sampleRate * duration);
    const buffer = state.audioCtx.createBuffer(1, size, state.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i = 0; i < size; i++){
      const t = i / size;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2);
    }
    const src = state.audioCtx.createBufferSource();
    const filter = state.audioCtx.createBiquadFilter();
    const gain = state.audioCtx.createGain();
    src.buffer = buffer;
    filter.type = filterType;
    filter.frequency.value = filterFreq;
    filter.Q.value = 1.2;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(state.audioMaster || state.audioCtx.destination);
    src.start(now);
    src.stop(now + duration + 0.02);
  }

  function playTurnSound(){
    const now = Date.now();
    if(now - (state.lastTurnSoundAt || 0) < 45) return;
    state.lastTurnSoundAt = now;
    makeBeep(190, 260, 0.025, 0.012, 'triangle');
  }

  function playStartSound(){
    makeBeep(280, 520, 0.075, 0.040, 'triangle');
    makeBeep(520, 880, 0.080, 0.028, 'sine', 0.055);
  }

  function playPauseSound(){
    makeBeep(420, 210, 0.070, 0.028, 'triangle');
  }

  function playSoftPop(){
    const now = Date.now();
    if(now - (state.lastFoodSoundAt || 0) < 35) return;
    state.lastFoodSoundAt = now;
    const combo = isEndlessLevel() ? Math.min(20, state.endlessCombo || 0) : 0;
    const lift = combo * 10;
    makeBeep(520 + lift, 960 + lift * 1.5, 0.070, 0.060, 'triangle');
    makeBeep(900 + lift, 1320 + lift * 1.5, 0.052, 0.032, 'sine', 0.032);
    if(combo >= 5) makeBeep(1280, 1820, 0.045, 0.020, 'square', 0.065);
  }

  function playPowerupSound(type){
    const map = {
      'M': [360, 820],
      'S': [520, 1200],
      'H': [300, 650],
      '🛡': [240, 920],
      '2x': [700, 1500]
    };
    const pair = map[type] || [420, 900];
    makeBeep(pair[0], pair[1], 0.12, 0.055, 'triangle');
    makeBeep(pair[1], pair[1] * 1.35, 0.08, 0.030, 'sine', 0.065);
  }

  function playExplosionSound(){
    resumeAudio();
    if(!state.audioCtx || state.audioMuted) return;
    makeBeep(115, 34, 0.30, 0.145, 'sawtooth');
    playNoiseBurst(0.22, 0.080, 420, 'lowpass', 0.015);
  }

  function laserDistanceToSnake(arrow){
    if(!arrow || !state.snake.length) return Infinity;
    const head = state.snake[0];
    let best = Infinity;
    arrowCells(arrow).forEach(c => best = Math.min(best, wrappedDistance(head, c)));
    return best;
  }

  function playLaserFlybySound(arrow){
    resumeAudio();
    if(!state.audioCtx || state.audioMuted) return;
    const now = state.audioCtx.currentTime;
    const dist = laserDistanceToSnake(arrow);
    const intensity = clamp01((5.0 - dist) / 5.0);
    const volume = 0.030 + Math.pow(intensity, 1.45) * 0.12;
    const duration = 0.13 + intensity * 0.10;
    const panNode = state.audioCtx.createStereoPanner ? state.audioCtx.createStereoPanner() : null;
    const out = panNode || (state.audioMaster || state.audioCtx.destination);
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(760 + intensity * 650, now);
    osc.frequency.exponentialRampToValueAtTime(130 + intensity * 100, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(out);
    if(panNode){
      let startPan = 0, endPan = 0;
      if(arrow){
        if(arrow.dir === 'right'){ startPan = -0.85; endPan = 0.85; }
        if(arrow.dir === 'left'){ startPan = 0.85; endPan = -0.85; }
        if(arrow.dir === 'down' || arrow.dir === 'up'){
          const xNorm = typeof arrow.x === 'number' ? (arrow.x / (GRID - 1)) : 0.5;
          startPan = Math.max(-0.7, Math.min(0.7, xNorm * 1.4 - 0.7));
          endPan = startPan * 0.25;
        }
      }
      panNode.pan.setValueAtTime(startPan, now);
      panNode.pan.linearRampToValueAtTime(endPan, now + duration);
      panNode.connect(state.audioMaster || state.audioCtx.destination);
    }
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  function playFlameCrackle(intensity){
    const safeIntensity = clamp01(intensity || 0);
    playNoiseBurst(0.055 + Math.random() * 0.075, 0.015 + safeIntensity * 0.060, 620 + safeIntensity * 620, 'lowpass');
  }

  function maybeFlameCrackle(flameIntensity){
    if(!state.audioEnabled || state.audioMuted || !state.running || state.gameOver) return;
    const intensity = clamp01(flameIntensity || 0);
    if(intensity <= 0.08) return;
    const nowMs = Date.now();
    const gap = Math.max(95, 280 - intensity * 125 + Math.random() * 120);
    if(nowMs - (state.lastFlameCrackleAt || 0) < gap) return;
    state.lastFlameCrackleAt = nowMs;
    playFlameCrackle(intensity);
    if(Math.random() < intensity * 0.20) setTimeout(() => playFlameCrackle(intensity * 0.7), 55 + Math.random() * 70);
  }

  function playFlameSpawnSound(){
    makeBeep(74, 36, 0.22, 0.052, 'sawtooth');
    playNoiseBurst(0.10, 0.050, 720, 'lowpass', 0.050);
    setTimeout(() => playFlameCrackle(0.75), 55);
    setTimeout(() => playFlameCrackle(0.55), 135);
  }

  function playShieldSound(){
    // Big "saved" moment, but combo remains protected by your latest gameplay rule.
    makeBeep(180, 640, 0.16, 0.070, 'triangle');
    makeBeep(640, 1180, 0.13, 0.042, 'sine', 0.060);
    playNoiseBurst(0.08, 0.025, 1100, 'highpass', 0.015);
  }

  
  // ============================================================
  // HAZARD AUDIO V1
  // ============================================================

  function playExplosionSound(){
    try{
      if(state.audioMuted) return;

      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.35;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);

      for(let i=0;i<bufferSize;i++){
        data[i] = (Math.random()*2-1) * (1 - (i / bufferSize));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.20 * getSoundVolume('hazard'), now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();

      bass.type = 'sine';
      bass.frequency.setValueAtTime(140, now);
      bass.frequency.exponentialRampToValueAtTime(42, now + 0.32);

      bassGain.gain.setValueAtTime(0.0001, now);
      bassGain.gain.linearRampToValueAtTime(0.34 * getSoundVolume('hazard'), now + 0.015);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);

      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      bass.connect(bassGain);
      bassGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.36);

      bass.start(now);
      bass.stop(now + 0.36);

    }catch(e){}
  }

  function playBombCountdownBeep(countdown){
    try{
      if(state.audioMuted) return;
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const vol = getSoundVolume('hazard');
      const freq = countdown <= 1 ? 880 : countdown === 2 ? 620 : 420;
      const duration = countdown <= 1 ? 0.13 : 0.10;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = countdown <= 1 ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.92, now + duration);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime((countdown <= 1 ? 0.13 : 0.085) * vol, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.03);

      if(countdown <= 1){
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1320, now + 0.055);
        gain2.gain.setValueAtTime(0.0001, now + 0.055);
        gain2.gain.linearRampToValueAtTime(0.06 * vol, now + 0.065);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.055);
        osc2.stop(now + 0.16);
      }
    }catch(e){}
  }

function playLaserSound(){
    try{
      if(state.audioMuted) return;
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const vol = getSoundVolume('hazard');

      const sweep = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweep.type = 'sawtooth';
      sweep.frequency.setValueAtTime(1900, now);
      sweep.frequency.exponentialRampToValueAtTime(260, now + 0.26);
      sweepGain.gain.setValueAtTime(0.0001, now);
      sweepGain.gain.linearRampToValueAtTime(0.105 * vol, now + 0.012);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      sweep.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweep.start(now);
      sweep.stop(now + 0.30);

      const zap = ctx.createOscillator();
      const zapGain = ctx.createGain();
      zap.type = 'square';
      zap.frequency.setValueAtTime(1250, now + 0.035);
      zap.frequency.exponentialRampToValueAtTime(520, now + 0.14);
      zapGain.gain.setValueAtTime(0.0001, now + 0.035);
      zapGain.gain.linearRampToValueAtTime(0.07 * vol, now + 0.045);
      zapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      zap.connect(zapGain);
      zapGain.connect(ctx.destination);
      zap.start(now + 0.035);
      zap.stop(now + 0.18);
    }catch(e){}
  }

  function playFlameLoopSound(){
    try{
      if(state.audioMuted) return;
      if(state.__flameLoopPlaying) return;

      state.__flameLoopPlaying = true;

      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.45;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);

      for(let i=0;i<bufferSize;i++){
        data[i] = (Math.random()*2-1) * 0.65;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.08 * getSoundVolume('hazard'), now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.45);

      setTimeout(() => {
        state.__flameLoopPlaying = false;
      }, 320);

    }catch(e){}
  }


function playDamageSound(){
    makeBeep(240, 90, 0.14, 0.070, 'sawtooth');
    playNoiseBurst(0.07, 0.035, 360, 'lowpass', 0.010);
  }

  function playDeathSound(){
    makeBeep(220, 120, 0.16, 0.075, 'sawtooth');
    makeBeep(150, 55, 0.36, 0.095, 'sawtooth', 0.095);
    playNoiseBurst(0.28, 0.070, 300, 'lowpass', 0.045);
  }

  function playComboStinger(combo){
    resumeAudio();
    if(!state.audioCtx || state.audioMuted) return;
    const strength = Math.min(1, combo / 20);
    makeBeep(120 + strength * 50, 42, 0.22, 0.088 + strength * 0.035, 'sawtooth');
    makeBeep(380 + combo * 7, 880 + combo * 14, 0.15, 0.040 + strength * 0.030, 'triangle', 0.020);
    if(combo >= 10){
      makeBeep(180, 90, 0.10, 0.040, 'square', 0.080);
      playNoiseBurst(0.060, 0.020, 1600, 'highpass', 0.060);
    }
    if(combo >= 20){
      makeBeep(940, 1880, 0.16, 0.032, 'sine', 0.120);
    }
  }

  function playComboVoice(combo){
    if(!isEndlessLevel()) return;
    playComboStinger(combo);
  }

  function playComboLostSound(){
    makeBeep(300, 90, 0.18, 0.060, 'sawtooth');
    playNoiseBurst(0.070, 0.025, 420, 'lowpass', 0.015);
  }

  // ============================================================
  // 17. MAIN DRAW LOOP
  // ============================================================
  
  // ============================================================
  // VISUAL POLISH V1
  // ============================================================

  function drawNeonGrid(){
    const t = Date.now() * 0.001;
    ctx.save();

    ctx.fillStyle = '#020617';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // subtle animated background glow
    const bg = ctx.createRadialGradient(
      canvas.width * (0.5 + Math.sin(t * 0.35) * 0.08),
      canvas.height * (0.45 + Math.cos(t * 0.28) * 0.08),
      20,
      canvas.width/2,
      canvas.height/2,
      canvas.width * 0.72
    );
    bg.addColorStop(0,'rgba(34,211,238,.10)');
    bg.addColorStop(.45,'rgba(15,23,42,.10)');
    bg.addColorStop(1,'rgba(2,6,23,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = 'rgba(34,211,238,.055)';
    ctx.lineWidth = 1;

    for(let i = 0; i <= GRID; i++){
      const p = i * TILE;
      ctx.beginPath();
      ctx.moveTo(p,0);
      ctx.lineTo(p,canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0,p);
      ctx.lineTo(canvas.width,p);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawGlowOrb(x,y,r,core,glow,pulse=1){
    ctx.save();
    ctx.shadowColor = glow;
    ctx.shadowBlur = 18 * pulse;
    ctx.fillStyle = glow;
    ctx.globalAlpha = .32;
    ctx.beginPath();
    ctx.arc(x,y,r*1.45,0,Math.PI*2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 12 * pulse;
    const grad = ctx.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);
    grad.addColorStop(0,'#ffffff');
    grad.addColorStop(.28,core);
    grad.addColorStop(1,glow);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function drawPolishedFood(){
    const t = Date.now() * 0.006;
    const cx = state.food.x * TILE + TILE/2;
    const cy = state.food.y * TILE + TILE/2;
    const pulse = 1 + Math.sin(t) * .12;
    drawGlowOrb(cx,cy,TILE*.22*pulse,'#fef08a','#facc15',pulse);

    ctx.save();
    ctx.strokeStyle = 'rgba(250,204,21,.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx,cy,TILE*.32*pulse,0,Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }

  function drawPolishedPowerup(){
    if(!state.powerup) return;
    const t = Date.now() * 0.006;
    const cx = state.powerup.x * TILE + TILE/2;
    const cy = state.powerup.y * TILE + TILE/2;
    const pulse = 1 + Math.sin(t) * .10;

    const colorMap = {
      'M':['#bbf7d0','#22c55e'],
      'S':['#bae6fd','#38bdf8'],
      'H':['#fde68a','#f97316'],
      '🛡':['#e0f2fe','#60a5fa'],
      '2x':['#fbcfe8','#ec4899']
    };

    const c = colorMap[state.powerup.type] || ['#e0f2fe','#22d3ee'];

    drawGlowOrb(cx,cy,TILE*.28*pulse,c[0],c[1],pulse);

    ctx.save();
    ctx.fillStyle = '#020617';
    ctx.font = 'bold 15px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.powerup.type, cx, cy + 1);
    ctx.restore();
  }

  function drawHazardGlow(){
    ctx.save();

    // Bomb glow rings
    if(Array.isArray(state.bombs)){
      state.bombs.forEach(b => {
        const cx = b.x * TILE + TILE/2;
        const cy = b.y * TILE + TILE/2;
        const danger = b.countdown <= 1 ? '#ef4444' : b.countdown <= 2 ? '#f97316' : '#facc15';

        ctx.shadowColor = danger;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = danger;
        ctx.globalAlpha = .32;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, TILE * (b.countdown <= 1 ? .62 : .48), 0, Math.PI*2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
    }
    ctx.restore();
  }



  // ============================================================
  // MAGNET FIELD VISUAL V1
  // ============================================================

  function drawMagnetFieldVisual(){
    if(Date.now() > (state.magnetUntil || 0)) return;
    if(!state.snake || !state.snake.length) return;

    const head = state.snake[0];
    const cx = head.x * TILE + TILE / 2;
    const cy = head.y * TILE + TILE / 2;

    const now = Date.now();
    const t = now * 0.006;
    const remaining = Math.max(0, state.magnetUntil - now);
    const fade = Math.min(1, remaining / 1200);

    ctx.save();

    // Main magnet field range: 2 tile radius
    const radius = TILE * (2.35 + Math.sin(t) * 0.08);

    const gradient = ctx.createRadialGradient(cx, cy, TILE * 0.35, cx, cy, radius);
    gradient.addColorStop(0, 'rgba(56,189,248,0.18)');
    gradient.addColorStop(0.45, 'rgba(34,211,238,0.08)');
    gradient.addColorStop(1, 'rgba(34,211,238,0)');

    ctx.globalAlpha = fade;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Rotating neon rings
    for(let i = 0; i < 3; i++){
      const ringRadius = TILE * (1.25 + i * 0.42 + Math.sin(t + i) * 0.05);
      ctx.globalAlpha = (0.34 - i * 0.075) * fade;
      ctx.strokeStyle = i === 0 ? '#67e8f9' : '#38bdf8';
      ctx.lineWidth = 2.5 - i * 0.35;
      ctx.setLineDash([10 + i * 4, 9 + i * 3]);
      ctx.lineDashOffset = -(t * 18 + i * 12);
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Subtle electric particles around field
    for(let i = 0; i < 12; i++){
      const angle = t * 0.55 + i * (Math.PI * 2 / 12);
      const pr = TILE * (1.15 + (i % 4) * 0.28 + Math.sin(t + i) * 0.08);
      const px = cx + Math.cos(angle) * pr;
      const py = cy + Math.sin(angle) * pr;

      ctx.globalAlpha = (0.28 + Math.sin(t * 2 + i) * 0.14) * fade;
      ctx.shadowColor = '#67e8f9';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#a5f3fc';
      ctx.beginPath();
      ctx.arc(px, py, 2.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pull line from food to head if food is inside magnet range
    if(state.food){
      const fx = state.food.x * TILE + TILE / 2;
      const fy = state.food.y * TILE + TILE / 2;
      const dx = Math.abs(head.x - state.food.x);
      const dy = Math.abs(head.y - state.food.y);

      if(dx <= 2 && dy <= 2){
        const pulse = 0.5 + Math.sin(t * 2.4) * 0.25;
        ctx.globalAlpha = (0.38 + pulse * 0.32) * fade;
        ctx.strokeStyle = '#a5f3fc';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 16;

        ctx.beginPath();
        ctx.moveTo(fx, fy);

        const mx = (fx + cx) / 2 + Math.sin(t) * 9;
        const my = (fy + cy) / 2 + Math.cos(t * 0.8) * 9;

        ctx.quadraticCurveTo(mx, my, cx, cy);
        ctx.stroke();

        // small direction sparks along the pull line
        for(let i = 1; i <= 3; i++){
          const p = (i / 4 + (Math.sin(t + i) * 0.04));
          const sx = fx + (cx - fx) * p;
          const sy = fy + (cy - fy) * p;

          ctx.globalAlpha = (0.38 + i * 0.12) * fade;
          ctx.fillStyle = '#e0f2fe';
          ctx.beginPath();
          ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }



  // ============================================================
  // FLAME VISUAL FIX V1
  // ============================================================

  function drawUnifiedFlameVisuals(){
    if(!Array.isArray(state.flames)) return;

    ctx.save();

    state.flames.forEach(f => {
      const cells = flameCells(f);
      const t = Date.now() * 0.006;

      cells.forEach((c, i) => {
        const x = c.x * TILE;
        const y = c.y * TILE;
        const flicker = 0.85 + Math.sin(t + i * 0.9) * 0.12;

        // Same base for every flame cell
        ctx.save();
        ctx.globalAlpha = 0.95;
        ctx.shadowColor = '#fb923c';
        ctx.shadowBlur = 14 * flicker;

        const grad = ctx.createRadialGradient(
          x + TILE * 0.48,
          y + TILE * 0.44,
          TILE * 0.08,
          x + TILE * 0.50,
          y + TILE * 0.50,
          TILE * 0.55
        );

        grad.addColorStop(0, 'rgba(254,240,138,0.95)');
        grad.addColorStop(0.35, 'rgba(249,115,22,0.88)');
        grad.addColorStop(0.75, 'rgba(220,38,38,0.58)');
        grad.addColorStop(1, 'rgba(127,29,29,0.20)');

        ctx.fillStyle = grad;
        rr(x + 3, y + 3, TILE - 6, TILE - 6, 7);
        ctx.fill();

        // Inner animated flame tongue, same rule for every segment
        ctx.globalAlpha = 0.78;
        ctx.fillStyle = 'rgba(255,237,213,0.72)';
        ctx.beginPath();
        ctx.moveTo(x + TILE * 0.50, y + TILE * 0.20);
        ctx.quadraticCurveTo(
          x + TILE * (0.30 + Math.sin(t + i) * 0.04),
          y + TILE * 0.55,
          x + TILE * 0.50,
          y + TILE * 0.78
        );
        ctx.quadraticCurveTo(
          x + TILE * (0.72 + Math.cos(t + i) * 0.04),
          y + TILE * 0.52,
          x + TILE * 0.50,
          y + TILE * 0.20
        );
        ctx.fill();

        ctx.restore();
      });
    });

    ctx.restore();
  }


function draw(){
    drawNeonGrid();

    if(isEndlessLevel() && !$('startOverlay').classList.contains('hidden')){
      // keep menu stable before Endless starts
    } else if(isEndlessLevel()){
      updateUI();
    }
    ctx.save();
    if(Date.now() < (state.screenShakeUntil || 0)){
      const shake = state.hitFlashType === 'shield' ? 2 : 4;
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    }
    drawGrid();

    // Bombers eksplosionsfelt — color based on countdown (3=yellow,2=orange,1=red)
    state.bombs.forEach(b => {
      if(b.countdown <= 3){
        const radius = state.level >= 9 ? 2 : 1;
        const pulse = (Math.sin(Date.now() / 95) + 1) / 2;

        let baseColor = 'rgba(250,204,21,';   // yellow
        let borderColor = 'rgba(254,240,138,';
        if(b.countdown === 2){
          baseColor = 'rgba(251,146,60,';     // orange
          borderColor = 'rgba(254,215,170,';
        }
        if(b.countdown === 1){
          baseColor = 'rgba(239,68,68,';      // red
          borderColor = 'rgba(254,226,226,';
        }

        for(let dy = -radius; dy <= radius; dy++){
          for(let dx = -radius; dx <= radius; dx++){
            let zx = wrapX(b.x + dx);
            let zy = wrapY(b.y + dy);
            const x = zx * TILE + 4;
            const y = zy * TILE + 4;
            const s = TILE - 8;
            const centerCell = dx === 0 && dy === 0;

            ctx.shadowBlur = centerCell ? 20 : 10;
            ctx.shadowColor = baseColor + (0.8) + ')';
            ctx.fillStyle = baseColor + (0.15 + pulse * 0.15) + ')';
            rr(x, y, s, s, 9);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.strokeStyle = borderColor + (0.3 + pulse * 0.3) + ')';
            ctx.lineWidth = centerCell ? 2 : 1.2;
            rr(x + 1.5, y + 1.5, s - 3, s - 3, 8);
            ctx.stroke();
          }
        }
      }
    });

    drawExplosionEffects();

    // Laser-pile
    state.arrows.forEach(a => {
      const cells = arrowCells(a);

      if(a.phase === 'warning'){
        cells.forEach((c, idx) => {
          const cx = c.x * TILE + TILE / 2;
          const cy = c.y * TILE + TILE / 2;

          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(34,211,238,0.28)';
          ctx.strokeStyle = a.countdown === 1 ? 'rgba(125,211,252,0.55)' : 'rgba(34,211,238,0.22)';
          ctx.lineWidth = 6;
          ctx.beginPath();
          if(a.dir === 'left' || a.dir === 'right'){
            ctx.moveTo(c.x * TILE + 8, cy);
            ctx.lineTo(c.x * TILE + TILE - 8, cy);
          } else {
            ctx.moveTo(cx, c.y * TILE + 8);
            ctx.lineTo(cx, c.y * TILE + TILE - 8);
          }
          ctx.stroke();

          const showTip =
            (a.dir === 'right' && idx === cells.length - 1) ||
            (a.dir === 'left' && idx === 0) ||
            (a.dir === 'down' && idx === cells.length - 1) ||
            (a.dir === 'up' && idx === 0);

          if(showTip){
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(147,197,253,0.9)';
            ctx.fillStyle = '#e0f2fe';
            ctx.font = 'bold 22px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const symbol = a.dir === 'up' ? '▲' : a.dir === 'down' ? '▼' : a.dir === 'left' ? '◀' : '▶';
            ctx.fillText(symbol, cx, cy);
          }
        });

        const bx = a.x * TILE + 10;
        const by = a.y * TILE + 10;
        const bs = TILE - 20;
        ctx.shadowBlur = 16;
        ctx.shadowColor = 'rgba(56,189,248,0.95)';
        ctx.fillStyle = 'rgba(8,145,178,0.95)';
        rr(bx, by, bs, bs, 10);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ecfeff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(a.countdown), a.x * TILE + TILE/2, a.y * TILE + TILE/2);
      } else if(a.phase === 'flying'){
        const activeCells = activeArrowCells(a);
        if(activeCells.length){
          const first = activeCells[0];
          const last = activeCells[activeCells.length - 1];
          const fx = first.x * TILE + TILE / 2;
          const fy = first.y * TILE + TILE / 2;
          const lx = last.x * TILE + TILE / 2;
          const ly = last.y * TILE + TILE / 2;

          ctx.shadowBlur = 18;
          ctx.shadowColor = 'rgba(56,189,248,0.95)';
          ctx.strokeStyle = 'rgba(125,211,252,0.98)';
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(lx, ly);
          ctx.stroke();

          ctx.shadowBlur = 8;
          ctx.strokeStyle = 'rgba(224,242,254,1)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(lx, ly);
          ctx.stroke();

          ctx.shadowBlur = 20;
          ctx.shadowColor = 'rgba(224,242,254,1)';
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(lx, ly, TILE * 0.18, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    state.flames.forEach(f => {
      const cells = flameCells(f);
      const pulse = (Math.sin(Date.now() / 120) + 1) / 2;
      const flow = Date.now() / 260;

      cells.forEach((c, idx) => {
        const cx = c.x * TILE + TILE / 2;
        const cy = c.y * TILE + TILE / 2;
        const progress = cells.length <= 1 ? 1 : idx / (cells.length - 1);
        const size = TILE * (0.72 - progress * 0.10 + pulse * 0.035);
        const x = cx - size / 2;
        const y = cy - size / 2;

        // soft danger tile glow
        ctx.shadowBlur = 18;
        ctx.shadowColor = 'rgba(249,115,22,0.85)';
        ctx.fillStyle = 'rgba(127,29,29,' + (0.16 + pulse * 0.08) + ')';
        rr(c.x * TILE + 5, c.y * TILE + 5, TILE - 10, TILE - 10, 12);
        ctx.fill();

        // outer flame body with gradient
        const grad = ctx.createRadialGradient(
          cx - TILE * 0.10, cy - TILE * 0.18, TILE * 0.05,
          cx, cy, size * 0.62
        );
        grad.addColorStop(0, '#fff7ed');
        grad.addColorStop(0.18, '#fde68a');
        grad.addColorStop(0.44, '#fb923c');
        grad.addColorStop(0.76, '#ef4444');
        grad.addColorStop(1, 'rgba(127,29,29,0.15)');

        ctx.shadowBlur = 22;
        ctx.shadowColor = 'rgba(249,115,22,0.95)';
        ctx.fillStyle = grad;
        ctx.beginPath();

        if(f.dir === 'right' || f.dir === 'left'){
          const dirSign = f.dir === 'right' ? 1 : -1;
          ctx.moveTo(cx - dirSign * size * 0.46, cy);
          ctx.bezierCurveTo(
            cx - dirSign * size * 0.30, cy - size * 0.45,
            cx + dirSign * size * 0.20, cy - size * 0.42,
            cx + dirSign * size * 0.50, cy
          );
          ctx.bezierCurveTo(
            cx + dirSign * size * 0.20, cy + size * 0.42,
            cx - dirSign * size * 0.30, cy + size * 0.45,
            cx - dirSign * size * 0.46, cy
          );
        } else {
          const dirSign = f.dir === 'down' ? 1 : -1;
          ctx.moveTo(cx, cy - dirSign * size * 0.46);
          ctx.bezierCurveTo(
            cx + size * 0.45, cy - dirSign * size * 0.30,
            cx + size * 0.42, cy + dirSign * size * 0.20,
            cx, cy + dirSign * size * 0.50
          );
          ctx.bezierCurveTo(
            cx - size * 0.42, cy + dirSign * size * 0.20,
            cx - size * 0.45, cy - dirSign * size * 0.30,
            cx, cy - dirSign * size * 0.46
          );
        }
        ctx.closePath();
        ctx.fill();

        // inner hot core
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(254,240,138,1)';
        ctx.fillStyle = 'rgba(255,247,237,' + (0.78 + pulse * 0.18) + ')';
        ctx.beginPath();
        ctx.arc(cx, cy, TILE * (0.14 + pulse * 0.03), 0, Math.PI * 2);
        ctx.fill();

        // animated ember particles
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#facc15';
        for(let p = 0; p < 3; p++){
          const offset = (flow + idx * 0.7 + p * 1.9) % 1;
          const angle = (idx + p * 2.3) * 1.7;
          const drift = TILE * (0.10 + offset * 0.22);
          const px = cx + Math.cos(angle) * drift;
          const py = cy - TILE * 0.20 - offset * TILE * 0.24 + Math.sin(angle) * TILE * 0.05;
          ctx.globalAlpha = 1 - offset;
          ctx.fillStyle = p % 2 === 0 ? '#fde68a' : '#fb923c';
          ctx.beginPath();
          ctx.arc(px, py, TILE * (0.035 + (1 - offset) * 0.018), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // bright leading tip on the last cell
        if(idx === cells.length - 1){
          let tipX = cx;
          let tipY = cy;
          if(f.dir === 'right') tipX = cx + size * 0.48;
          if(f.dir === 'left') tipX = cx - size * 0.48;
          if(f.dir === 'down') tipY = cy + size * 0.48;
          if(f.dir === 'up') tipY = cy - size * 0.48;

          ctx.shadowBlur = 20;
          ctx.shadowColor = '#fff7ed';
          ctx.fillStyle = '#fff7ed';
          ctx.beginPath();
          ctx.arc(tipX, tipY, TILE * (0.11 + pulse * 0.03), 0, Math.PI * 2);
          ctx.fill();

          // heatwave lines
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(254,215,170,' + (0.45 + pulse * 0.25) + ')';
          ctx.lineWidth = 2;
          for(let w = 0; w < 2; w++){
            ctx.beginPath();
            const shift = (w - 0.5) * TILE * 0.22;
            if(f.dir === 'left' || f.dir === 'right'){
              ctx.moveTo(cx - TILE * 0.28, cy + shift);
              ctx.quadraticCurveTo(cx, cy + shift - TILE * 0.12, cx + TILE * 0.28, cy + shift);
            } else {
              ctx.moveTo(cx + shift, cy - TILE * 0.28);
              ctx.quadraticCurveTo(cx + shift - TILE * 0.12, cy, cx + shift, cy + TILE * 0.28);
            }
            ctx.stroke();
          }
        }
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });

    if(state.snake.length && state.shieldActive){
      const h = state.snake[0];
      const hx = h.x * TILE + TILE / 2;
      const hy = h.y * TILE + TILE / 2;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#facc15';
      ctx.strokeStyle = 'rgba(250,204,21,.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(hx, hy, TILE * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    if(state.snake.length && Date.now() <= state.doublePointsUntil){
      const h = state.snake[0];
      const hx = h.x * TILE + TILE / 2;
      const hy = h.y * TILE - TILE * 0.12;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fb7185';
      ctx.fillStyle = '#fecdd3';
      ctx.font = 'bold 13px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('2x', hx, hy);
      ctx.shadowBlur = 0;
    }

    if(state.snake.length && Date.now() <= (state.comboBoostUntil || 0)){
      const h = state.snake[0];
      const hx = h.x * TILE + TILE / 2;
      const hy = h.y * TILE - TILE * 0.42;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#22d3ee';
      ctx.fillStyle = '#cffafe';
      ctx.font = 'bold 13px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⏱ COMBO', hx, hy);
      ctx.shadowBlur = 0;
    }

    if(state.powerup){
      drawUnifiedPowerup(state.powerup);
    }

    const fx = state.food.x * TILE + TILE * 0.16;
    const fy = state.food.y * TILE + TILE * 0.16;
    const fs = TILE * 0.68;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#d946ef';
    ctx.fillStyle = '#d946ef';
    rr(fx, fy, fs, fs, 10);
    ctx.fill();

    state.bombs.forEach(b => {
      const cx = b.x * TILE + TILE / 2;
      const cy = b.y * TILE + TILE / 2;
      const pulse = (Math.sin(Date.now() / 115) + 1) / 2;
      const urgency = Math.max(0, 4 - (b.countdown || 3)) / 3;
      const bodyR = TILE * (0.34 + pulse * 0.025 + urgency * 0.035);

      // outer warning ring
      ctx.shadowBlur = 18 + urgency * 12;
      ctx.shadowColor = b.countdown === 1 ? 'rgba(239,68,68,1)' : 'rgba(251,146,60,0.75)';
      ctx.strokeStyle = b.countdown === 1
        ? 'rgba(248,113,113,' + (0.55 + pulse * 0.35) + ')'
        : 'rgba(251,191,36,' + (0.35 + pulse * 0.25) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, TILE * (0.47 + pulse * 0.06), 0, Math.PI * 2);
      ctx.stroke();

      // bomb body
      const grad = ctx.createRadialGradient(
        cx - TILE * 0.12, cy - TILE * 0.14, TILE * 0.04,
        cx, cy, bodyR
      );
      grad.addColorStop(0, '#fee2e2');
      grad.addColorStop(0.18, '#ef4444');
      grad.addColorStop(0.72, '#7f1d1d');
      grad.addColorStop(1, '#111827');

      ctx.shadowBlur = 16 + urgency * 10;
      ctx.shadowColor = b.countdown === 1 ? '#ef4444' : '#fb923c';
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy + TILE * 0.04, bodyR, 0, Math.PI * 2);
      ctx.fill();

      // top cap
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(15,23,42,0.8)';
      ctx.fillStyle = '#0f172a';
      rr(cx - TILE * 0.13, cy - TILE * 0.39, TILE * 0.26, TILE * 0.14, 5);
      ctx.fill();

      // fuse
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#facc15';
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx + TILE * 0.07, cy - TILE * 0.36);
      ctx.quadraticCurveTo(cx + TILE * 0.22, cy - TILE * 0.55, cx + TILE * 0.40, cy - TILE * 0.42);
      ctx.stroke();

      // spark
      const sx = cx + TILE * 0.40;
      const sy = cy - TILE * 0.42;
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#facc15';
      ctx.fillStyle = pulse > 0.5 ? '#fff7ed' : '#facc15';
      ctx.beginPath();
      ctx.arc(sx, sy, TILE * (0.055 + pulse * 0.035), 0, Math.PI * 2);
      ctx.fill();

      // countdown text
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#000';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(b.countdown), cx, cy + TILE * 0.06);

      // urgent tiny warning mark
      if(b.countdown === 1){
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#facc15';
        ctx.fillStyle = '#fef3c7';
        ctx.font = '900 12px Arial';
        ctx.fillText('!', cx, cy - TILE * 0.23);
      }

      ctx.shadowBlur = 0;
    });

    if(Date.now() < state.magnetUntil && state.snake.length){
      const head = state.snake[0];
      const skipCells = state.snake.slice(1, 3);
      for(let dy = -2; dy <= 2; dy++){
        for(let dx = -2; dx <= 2; dx++){
          let mx = wrapX(head.x + dx);
          let my = wrapY(head.y + dy);

          if(skipCells.some(seg => seg && seg.x === mx && seg.y === my)) continue;
          if(state.snake.some(seg => seg.x === mx && seg.y === my)) continue;

          const x = mx * TILE + 6;
          const y = my * TILE + 6;
          const s = TILE - 12;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(34,197,94,0.35)';
          ctx.fillStyle = 'rgba(34,197,94,0.05)';
          rr(x, y, s, s, 8);
          ctx.fill();
        }
      }
    }

    const skin = currentSkin();
    drawEndlessComboAura();
    drawSkinEffectsBeforeSnake(skin);
    state.snake.forEach((seg, idx) => {
      drawSkinSegment(seg, idx, skin);
    });

    drawComboCoinPopups();
    drawCenterMessages();
    drawEndlessComboUI();
drawHazardGlow();
    drawUnifiedFlameVisuals();
    drawMagnetFieldVisual();
    drawPolishedFood();
    drawPolishedPowerup();
    drawHitFeedback();
    ctx.shadowBlur = 0;
    ctx.restore();
  }


  // ============================================================
  // 18. INPUTS + EVENT LISTENERS
  // ============================================================
  document.addEventListener('keydown', (e) => {
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
    if(e.key === 'ArrowUp') setDir({x:0,y:-1});
    if(e.key === 'ArrowDown') setDir({x:0,y:1});
    if(e.key === 'ArrowLeft') setDir({x:-1,y:0});
    if(e.key === 'ArrowRight') setDir({x:1,y:0});
    if(e.key === ' ') toggleGame();
    if(e.key.toLowerCase() === 'r') {
      e.preventDefault();
      retryLevel();
    }
  });

  document.querySelectorAll('[data-dir]').forEach(btn => {
    const go = () => {
      const d = btn.dataset.dir;
      if(d === 'up') setDir({x:0,y:-1});
      if(d === 'down') setDir({x:0,y:1});
      if(d === 'left') setDir({x:-1,y:0});
      if(d === 'right') setDir({x:1,y:0});
    };
    btn.addEventListener('click', go);
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); go(); }, {passive:false});
  });

  if($('touchPauseBtn')){
    $('touchPauseBtn').addEventListener('click', toggleGame);
    $('touchPauseBtn').addEventListener('touchstart', (e) => { e.preventDefault(); toggleGame(); }, {passive:false});
  }

  let touchStartX = 0;
  let touchStartY = 0;

  canvas.addEventListener('touchstart', (e) => {
    if(!e.touches || !e.touches.length) return;
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, {passive:false});

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, {passive:false});

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const touch = e.changedTouches && e.changedTouches[0];
    if(!touch) return;
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    const threshold = 24;
    if(Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;
    if(Math.abs(dx) > Math.abs(dy)){
      setDir(dx > 0 ? {x:1,y:0} : {x:-1,y:0});
    } else {
      setDir(dy > 0 ? {x:0,y:1} : {x:0,y:-1});
    }
  }, {passive:false});

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  $('startBtn').addEventListener('click', startGame);
  $('toggleBtn').addEventListener('click', toggleGame);
  $('resetBtn').addEventListener('click', resetGame);
  $('menuBtn').addEventListener('click', showMenu);
  if($('soundBtn')) $('soundBtn').addEventListener('click', toggleSound);
  $('restartBtn').addEventListener('click', retryLevel);
  $('gameOverMenuBtn').addEventListener('click', showMenu);

  $('trophyBtn').addEventListener('click', () => {
    checkTrophies();
    renderTrophies();
    $('trophyModal').classList.remove('hidden');
  });

  $('closeTrophyBtn').addEventListener('click', () => {
    $('trophyModal').classList.add('hidden');
  });

  resetGame();
  renderDifficultyMenu();
  renderLevelMenu();
  renderShop();
    renderSelectedSkinNameClean();
  updateSoundButton();

  // ============================================================
  // ADDICTIVE UX PATCH: instant restart + tap anywhere on Game over
  // ============================================================

  function resetRunScoreForFreshStart(){
    state.score = 0;
    state.progress = 0;
    state.endlessPoints = 0;
    resetEndlessCombo();
    state.doublePointsThisRun = 0;
    state.magnetPointsThisRun = 0;
    state.slowmoPointsThisRun = 0;
    updateUI();
  }

  function instantRetryFromGameOver(){
    if(!state.gameOver) return;
    const lvl = state.level || state.selectedLevel || 1;

    if(typeof stopAllTimers === 'function') stopAllTimers();
    if(state.loop){
      clearInterval(state.loop);
      state.loop = null;
    }

    state.running = false;
    state.gameOver = false;
    resetRunScoreForFreshStart();

    setupLevel(lvl);
    $('startOverlay').classList.add('hidden');
    $('gameOverOverlay').classList.add('hidden');
    state.running = true;
    startPowerupFlow();
    startLoop();
  }

  const gameOverOverlayInstantRetry = $('gameOverOverlay');
  if(gameOverOverlayInstantRetry){
    gameOverOverlayInstantRetry.addEventListener('pointerdown', (e) => {
      if(!state.gameOver) return;
      if(e.target && e.target.closest && e.target.closest('#gameOverMenuBtn')) return;
      e.preventDefault();
      instantRetryFromGameOver();
    });
  }

  window.addEventListener('keydown', (e) => {
    if((e.key === 'r' || e.key === 'R') && state.gameOver){
      e.preventDefault();
      instantRetryFromGameOver();
    }
  }, true);

  window.addEventListener('pointerdown', () => {
    resumeAudio();
  }, {passive:true});

  window.addEventListener('keydown', () => {
    resumeAudio();
  }, true);


  // ============================================================
  // 20. ELECTRIC SNAKE PLUS PATCH — GAME FEEL / JUICE
  // ============================================================
  // This patch keeps your original mechanics, but adds more life:
  // particles, food pulses, moving trail glow, combo flash and a cleaner menu signal.
  state.plusParticles = [];
  state.plusFoodPulse = 0;
  state.plusLastScore = state.score || 0;
  state.plusLastCombo = state.endlessCombo || 0;

  function plusAddParticles(cell, color, count, power){
    if(!cell) return;
    if(!state.plusParticles) state.plusParticles = [];
    const cx = cell.x * TILE + TILE / 2;
    const cy = cell.y * TILE + TILE / 2;
    for(let i = 0; i < count; i++){
      const a = Math.random() * Math.PI * 2;
      const sp = (Math.random() * 1.8 + 0.8) * (power || 1);
      state.plusParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 360 + Math.random() * 260,
        born: Date.now(),
        color,
        size: 2 + Math.random() * 3
      });
    }
    if(state.plusParticles.length > 140){
      state.plusParticles.splice(0, state.plusParticles.length - 140);
    }
  }

  function plusDrawParticles(){
    if(!state.plusParticles || !state.plusParticles.length) return;
    const now = Date.now();
    state.plusParticles = state.plusParticles.filter(p => now - p.born < p.life);
    state.plusParticles.forEach(p => {
      const age = now - p.born;
      const t = age / p.life;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.985;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - t);
      ctx.shadowBlur = 16;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - t * 0.45), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function plusDrawBoardVignette(){
    const combo = state.endlessCombo || 0;
    const boost = Math.min(1, combo / 20);
    ctx.save();
    const g = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.width*0.18, canvas.width/2, canvas.height/2, canvas.width*0.72);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(2,6,23,' + (0.24 + boost * 0.16) + ')');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(combo >= 10){
      ctx.globalAlpha = 0.18 + Math.sin(Date.now()/90) * 0.04;
      ctx.strokeStyle = combo >= 20 ? '#facc15' : '#22d3ee';
      ctx.lineWidth = 8;
      ctx.shadowBlur = 28;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.strokeRect(8,8,canvas.width-16,canvas.height-16);
    }
    ctx.restore();
  }

  function plusDrawFoodPulse(){
    if(!state.food) return;
    const pulse = (Math.sin(Date.now()/120)+1)/2;
    const x = state.food.x * TILE + TILE / 2;
    const y = state.food.y * TILE + TILE / 2;
    ctx.save();
    ctx.globalAlpha = 0.28 + pulse * 0.18;
    ctx.strokeStyle = '#facc15';
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, TILE * (0.34 + pulse * 0.16), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function plusWatchScoreAndCombo(){
    const scoreNow = state.score || 0;
    const comboNow = state.endlessCombo || 0;
    if(scoreNow > (state.plusLastScore || 0)){
      const head = state.snake && state.snake[0] ? state.snake[0] : state.food;
      plusAddParticles(head, comboNow >= 10 ? '#facc15' : '#22d3ee', comboNow >= 10 ? 22 : 14, comboNow >= 10 ? 1.45 : 1);
    }
    if(comboNow > (state.plusLastCombo || 0) && comboNow >= 5){
      const head = state.snake && state.snake[0] ? state.snake[0] : state.food;
      plusAddParticles(head, comboNow >= 20 ? '#facc15' : '#d946ef', 28, 1.7);
    }
    state.plusLastScore = scoreNow;
    state.plusLastCombo = comboNow;
  }

  const plusOriginalTick = tick;
  tick = function(){
    plusOriginalTick();
    plusWatchScoreAndCombo();
  };

  const plusOriginalDraw = draw;
  draw = function(){
    plusOriginalDraw();
    plusDrawFoodPulse();
    plusDrawParticles();
    plusDrawBoardVignette();
  };

  const plusOriginalAddCenterMessage = addCenterMessage;
  addCenterMessage = function(text, color, life){
    plusOriginalAddCenterMessage(text, color, life);
    if(state.snake && state.snake[0]) plusAddParticles(state.snake[0], color || '#22d3ee', 18, 1.25);
  };

  const plusOriginalSetupLevel = setupLevel;
  setupLevel = function(level){
    state.plusParticles = [];
    state.plusLastScore = state.score || 0;
    state.plusLastCombo = 0;
    plusOriginalSetupLevel(level);
    addCenterMessage(level >= ENDLESS_LEVEL ? 'ENDLESS STORM ⚡' : 'LEVEL ' + level, '#22d3ee', 900);
  };

  // Add a tiny animated title accent without changing your core HTML structure.
  const plusTitle = document.querySelector('h1');
  if(plusTitle && !plusTitle.dataset.plusReady){
    plusTitle.dataset.plusReady = '1';
    plusTitle.innerHTML = '⚡ Electric Snake <span style="font-size:14px;color:#94a3b8"></span>';
  }


  // FINAL STABLE MENU + DAILY V3 CHALLENGES
  const FINAL_SAVE_KEYS = [
    'electric-snake-v3-best','electric-snake-endless-best','electric-snake-best-endless-combo','electric-snake-best-shield-hold','electric-snake-best-double-points','electric-snake-best-magnet-points','electric-snake-best-slowmo-points','electric-snake-half-removed-total','electric-snake-powerups-collected','electric-snake-coins','electric-snake-skin-coins','electric-snake-trophies','electric-snake-owned-skins','electric-snake-equipped-skin','electric-snake-difficulty','electric-snake-unlocked-normal','electric-snake-unlocked-hard','electric-snake-v8-unlocked'
  ];

  const FINAL_DAILY_POOL = [
    {id:'score25', text:'Score 25 point', target:25, reward:25, type:'score'},
    {id:'score50', text:'Score 50 point', target:50, reward:50, type:'score'},
    {id:'endless75', text:'Score 75 point i Endless Storm', target:75, reward:125, type:'endless'},
    {id:'combo5', text:'Nå 5x combo', target:5, reward:40, type:'combo'},
    {id:'combo10', text:'Nå 10x combo', target:10, reward:75, type:'combo'},
    {id:'combo20', text:'Nå 20x combo', target:20, reward:150, type:'combo'},
    {id:'survive60', text:'Overlev 60 sekunder', target:60, reward:50, type:'survive'},
    {id:'powerups5', text:'Saml 5 powerups', target:5, reward:50, type:'powerups'},
    {id:'coins50', text:'Saml 50 coins', target:50, reward:75, type:'coins'},
    {id:'games3', text:'Spil 3 runder', target:3, reward:40, type:'games'},
    {id:'x2points20', text:'Få 20 point mens X2 er aktiv', target:20, reward:100, type:'x2'},
    {id:'endlessSurvive60', text:'Overlev 60 sekunder in Endless Storm', target:60, reward:100, type:'endlessSurvive'},
    {id:'shield3', text:'Brug skjold 3 gange', target:3, reward:60, type:'shield'},
    {id:'magnet8', text:'Få 8 point mens magnet er aktiv', target:8, reward:80, type:'magnet'},
    {id:'endless125', text:'Score 125 point i Endless Storm', target:125, reward:180, type:'endless'}
  ];

  function finalDateKey(){
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
  }

  function finalGenerateDailies(){
    const pool = FINAL_DAILY_POOL.slice();
    const items = [];
    while(items.length < 3 && pool.length){
      const i = Math.floor(Math.random() * pool.length);
      items.push({...pool.splice(i,1)[0], progress:0, completed:false});
    }
    return {date:finalDateKey(), items};
  }

  function finalLoadDailies(){
    try{
      const saved = JSON.parse(window.__ES_STORAGE__.getItem('electric-snake-dailies-stable-v1') || 'null');
      if(saved && saved.date === finalDateKey() && Array.isArray(saved.items)) return saved;
    }catch(e){}
    const fresh = finalGenerateDailies();
    window.__ES_STORAGE__.setItem('electric-snake-dailies-stable-v1', JSON.stringify(fresh));
    window.__ES_STORAGE__.setItem('electric-snake-daily-games-stable-v1', '0');
    return fresh;
  }

  let finalDailyState = finalLoadDailies();

  function finalSaveDailies(){
    window.__ES_STORAGE__.setItem('electric-snake-dailies-stable-v1', JSON.stringify(finalDailyState));
  }


  function danskDailyText(text){
    const map = {
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
    };
    return map[text] || text;
  }

  function finalRenderDailies(){
    const list = $('finalDailyList');
    if(!list) return;
    list.innerHTML = '';
    finalDailyState.items.forEach(item => {
      const current = Math.min(item.progress || 0, item.target);
      const pct = Math.max(0, Math.min(100, (current / item.target) * 100));
      const card = document.createElement('div');
      card.className = 'final-daily-card';
      card.innerHTML = '<div class="final-daily-top"><span>' + danskDailyText(item.text) + '</span><span>' + item.reward + ' 🪙</span></div>' +
        '<div class="final-daily-bar"><div class="final-daily-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="final-daily-meta"><span>' + current + ' / ' + item.target + '</span><span class="' + (item.completed ? 'final-daily-complete' : '') + '">' + (item.completed ? '✅ Fuldført' : 'I gang') + '</span></div>';
      list.appendChild(card);
    });
  }

  function finalDailyUpdate(type, value){
    let changed = false;
    finalDailyState.items.forEach(item => {
      if(item.completed || item.type !== type) return;
      item.progress = Math.max(item.progress || 0, value || 0);
      if(item.progress >= item.target){
        item.completed = true;
        state.coins = (state.coins || 0) + item.reward;
        showDailyPopup(danskDailyText(item.text), item.reward);
        saveCoins();
        updateUI();
      }
      changed = true;
    });
    if(changed){ finalSaveDailies(); finalRenderDailies(); }
  }

  function finalTrackDailyRunEnd(){
    try{
      finalDailyUpdate('score', state.score || 0);
      finalDailyUpdate('combo', Math.max(state.bestEndlessCombo || 0, state.endlessCombo || 0));
      finalDailyUpdate('endless', state.endlessPoints || 0);
      finalDailyUpdate('level', state.level || 1);
      finalDailyUpdate('powerups', state.totalPowerupsCollected || 0);
      finalDailyUpdate('x2', state.doublePointsThisRun || 0);
      finalDailyUpdate('magnet', state.magnetPointsThisRun || 0);
      if(state.runStartTime) finalDailyUpdate('survive', Math.floor((Date.now() - state.runStartTime) / 1000));
      const games = Number(window.__ES_STORAGE__.getItem('electric-snake-daily-games-stable-v1') || 0) + 1;
      window.__ES_STORAGE__.setItem('electric-snake-daily-games-stable-v1', String(games));
      finalDailyUpdate('games', games);
      finalDailyUpdate('coins', Number(window.__ES_STORAGE__.getItem('electric-snake-coins') || state.coins || 0));
    }catch(e){}
  }

  const finalOldSetGameOver = setGameOver;
  setGameOver = function(){
    finalTrackDailyRunEnd();
    return finalOldSetGameOver.apply(this, arguments);
  };

  function finalOpenMenu(id){
    document.querySelectorAll('.final-menu-screen').forEach(screen => {
      screen.classList.toggle('active', screen.id === id);
    });
    if(id === 'finalPlay'){
      renderDifficultyMenu(); renderLevelMenu(); renderShop(); renderSelectedSkinNameClean(); updateUI();
    }
    if(id === 'finalDaily') finalRenderDailies();
    if(id === 'finalTrophies'){
      checkTrophies(); renderTrophies();
      const src = $('trophyList');
      const dst = $('finalTrophyList');
      if(src && dst) dst.innerHTML = src.innerHTML;
    }
    if(id === 'finalSave') finalSetSaveStatus('');
  }

  function finalSetSaveStatus(msg){
    const el = $('finalSaveStatus');
    if(el) el.textContent = msg || '';
  }

  function finalExportSave(){
    const payload = {game:'Electric Snake', version:'final-stable-v1', exportedAt:new Date().toISOString(), data:{}};
    FINAL_SAVE_KEYS.forEach(key => {
      const val = window.__ES_STORAGE__.getItem(key);
      if(val !== null) payload.data[key] = val;
    });
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    $('finalSaveBox').value = code;
    $('finalSaveBox').focus();
    $('finalSaveBox').select();
    finalSetSaveStatus('Save-kode vist. Kopiér den eller tryk Kopiér.');
  }

  function finalImportSave(){
    try{
      const code = ($('finalSaveBox').value || '').trim();
      if(!code){ finalSetSaveStatus('Indsæt en save-kode først.'); return; }
      const payload = JSON.parse(decodeURIComponent(escape(atob(code))));
      if(!payload || !payload.data) throw new Error('Invalid save');
      Object.entries(payload.data).forEach(([key,val]) => {
        if(FINAL_SAVE_KEYS.includes(key)) window.__ES_STORAGE__.setItem(key, val);
      });
      finalSetSaveStatus('Save importeret. Genindlæser...');
      setTimeout(() => location.reload(), 600);
    }catch(e){ finalSetSaveStatus('Koden kunne ikke læses. Tjek at hele koden er kopieret.'); }
  }

  function finalInitMenu(){
    document.querySelectorAll('[data-final-open]').forEach(btn => {
      btn.onclick = (e) => { e.preventDefault(); finalOpenMenu(btn.getAttribute('data-final-open')); return false; };
    });
    const start = $('startBtn');
    if(start) start.type = 'button';
    const mute = $('finalMuteBtn');
    if(mute){
      mute.onclick = () => { toggleSound(); mute.textContent = state.audioMuted ? 'Unmute' : 'Mute'; };
    }
    const vol = $('finalMasterVolume');
    const lab = $('finalMasterLabel');
    if(vol){
      const saved = window.__ES_STORAGE__.getItem('electric-snake-audio-volume-ui');
      if(saved !== null) vol.value = saved;
      const sync = () => {
        window.__ES_STORAGE__.setItem('electric-snake-audio-volume-ui', vol.value);
        if(lab) lab.textContent = vol.value + '%';
        state.audioMasterVolume = Number(vol.value) / 100;
        if(state.audioMaster && state.audioCtx) state.audioMaster.gain.setTargetAtTime(state.audioMasterVolume, state.audioCtx.currentTime, 0.03);
      };
      vol.oninput = sync; sync();
    }
    const show = $('finalShowSave'); if(show) show.onclick = finalExportSave;
    const copy = $('finalCopySave'); if(copy) copy.onclick = async () => { if(!$('finalSaveBox').value) finalExportSave(); try{ await navigator.clipboard.writeText($('finalSaveBox').value); finalSetSaveStatus('Save-kode kopieret ✅'); }catch(e){ $('finalSaveBox').select(); finalSetSaveStatus('Kopiér manuelt fra boksen.'); } };
    const imp = $('finalImportSave'); if(imp) imp.onclick = finalImportSave;
    finalRenderDailies();
    finalOpenMenu('finalHome');
  }

  finalInitMenu();
  window.addEventListener('load', finalInitMenu);
// SHIELD DAILY COUNTER DATE RESET V2
  try{
    const shieldDateKey = 'electric-snake-daily-shields-date';
    const todayForShield = (new Date()).getFullYear() + '-' + ((new Date()).getMonth()+1) + '-' + (new Date()).getDate();
    if(window.__ES_STORAGE__.getItem(shieldDateKey) !== todayForShield){
      window.__ES_STORAGE__.setItem(shieldDateKey, todayForShield);
      window.__ES_STORAGE__.setItem('electric-snake-daily-shields-used', '0');
    }
  }catch(e){}


  
  
  // ============================================================
  // SOUND SYSTEM V2
  // ============================================================

  function getAudioContext(){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!state.audioCtx){
      state.audioCtx = new AC();
    }

    if(state.audioCtx.state === 'suspended'){
      state.audioCtx.resume().catch(() => {});
    }

    return state.audioCtx;
  }

  function getSoundVolume(type='effects'){
    const master = Number(window.__ES_STORAGE__.getItem('electric-snake-volume-master') || 70) / 100;

    const map = {
      effects: Number(window.__ES_STORAGE__.getItem('electric-snake-volume-effects') || 80) / 100,
      hazard: Number(window.__ES_STORAGE__.getItem('electric-snake-volume-hazard') || 70) / 100,
      voice: Number(window.__ES_STORAGE__.getItem('electric-snake-volume-voice') || 85) / 100,
      reward: Number(window.__ES_STORAGE__.getItem('electric-snake-volume-reward') || 100) / 100,
    };

    return master * (map[type] || map.effects);
  }

  function quickEnvelope(gain, start, peak, attack, release){
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, start + release);
  }

  function playFoodPickupSound(combo=1){
    try{
      if(state.audioMuted) return;

      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const pitch = combo >= 10 ? 980 :
                    combo >= 7 ? 820 :
                    combo >= 5 ? 720 :
                    combo >= 3 ? 620 : 520;

      osc.type = combo >= 7 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.16, now + 0.08);

      quickEnvelope(gain, now, 0.08 * getSoundVolume('effects'), 0.01, 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    }catch(e){}
  }

  function playComboTierSound(combo){
    try{
      if(state.audioMuted) return;
      if(combo < 3) return;

      const ctx = getAudioContext();
      const now = ctx.currentTime;

      let notes = [523,659];
      let volume = 0.10;

      if(combo >= 10){
        notes = [523,659,784,1046];
        volume = 0.20;
      }else if(combo >= 7){
        notes = [523,659,784];
        volume = 0.16;
      }else if(combo >= 5){
        notes = [523,659,784];
        volume = 0.13;
      }

      notes.forEach((freq,i)=>{
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = combo >= 10 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        quickEnvelope(
          gain,
          now + i * 0.05,
          volume * getSoundVolume('reward'),
          0.01,
          0.22
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.25);
      });

    }catch(e){}
  }

  function playPowerupSound(type='generic'){
    try{
      if(state.audioMuted) return;

      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const volume = getSoundVolume('reward');

      function tone(freqStart, freqEnd, startOffset, duration, typeOsc='triangle', gainPeak=0.12){
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = typeOsc;
        osc.frequency.setValueAtTime(freqStart, now + startOffset);
        osc.frequency.exponentialRampToValueAtTime(freqEnd, now + startOffset + duration);

        gain.gain.setValueAtTime(0.0001, now + startOffset);
        gain.gain.linearRampToValueAtTime(gainPeak * volume, now + startOffset + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration + 0.02);
      }

      // MAGNET - energetic rising arcade pull
      if(type === '🧲'){
        tone(180, 520, 0.00, 0.20, 'triangle', 0.13);
        tone(520, 920, 0.05, 0.18, 'triangle', 0.10);
        tone(920, 1220, 0.11, 0.15, 'sine', 0.07);
      }

      // SHIELD - protective crystal shimmer
      else if(type === '🛡'){
        tone(420, 700, 0.00, 0.24, 'sine', 0.12);
        tone(700, 980, 0.06, 0.22, 'triangle', 0.10);
        tone(1180, 980, 0.12, 0.18, 'sine', 0.06);
      }

      // FREEZE / SLOW - icy digital sweep
      else if(type === '❄'){
        tone(1200, 500, 0.00, 0.28, 'triangle', 0.11);
        tone(880, 240, 0.03, 0.26, 'sine', 0.08);
      }

      // X2 - jackpot / reward style
      else if(type === 'X2'){
        [523,659,784,1046].forEach((freq,i)=>{
          tone(freq, freq*1.03, i*0.045, 0.20, i >= 2 ? 'sawtooth' : 'triangle', 0.13);
        });

        // sparkle layer
        tone(1600, 2200, 0.16, 0.14, 'square', 0.05);
      }

      // COMBO EXTENDER
      else if(type === '⏱'){
        tone(340, 780, 0.00, 0.16, 'triangle', 0.10);
        tone(780, 1180, 0.05, 0.15, 'triangle', 0.08);
      }

      // Generic fallback
      else{
        tone(400, 900, 0.00, 0.20, 'triangle', 0.10);
      }

    }catch(e){}
  }

  function playDamageSound(){
    try{
      if(state.audioMuted) return;

      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.24);

      quickEnvelope(
        gain,
        now,
        0.22 * getSoundVolume('hazard'),
        0.01,
        0.28
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.30);
    }catch(e){}
  }


function playDailyCompleteSound(){
    try{
      if(state.audioMuted) return;

      const AC = window.AudioContext || window.webkitAudioContext;
      const audioCtx = state.audioCtx || new AC();
      state.audioCtx = audioCtx;

      if(audioCtx.state === 'suspended'){
        audioCtx.resume().catch(() => {});
      }

      const now = audioCtx.currentTime;

      const master = audioCtx.createGain();
      master.gain.setValueAtTime(0.34, now);
      master.gain.exponentialRampToValueAtTime(0.001, now + 1.05);
      master.connect(audioCtx.destination);

      // Big bright arcade arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = i < 3 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.075);

        gain.gain.setValueAtTime(0.0001, now + i * 0.075);
        gain.gain.linearRampToValueAtTime(0.22, now + i * 0.075 + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.075 + 0.34);

        osc.connect(gain);
        gain.connect(master);
        osc.start(now + i * 0.075);
        osc.stop(now + i * 0.075 + 0.38);
      });

      // Reward "coin sparkle" layer
      for(let i = 0; i < 4; i++){
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const t = now + 0.18 + i * 0.055;

        osc.type = 'square';
        osc.frequency.setValueAtTime(1400 + i * 180, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.055, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + 0.14);
      }

      // Low soft impact so it feels bigger
      const bass = audioCtx.createOscillator();
      const bassGain = audioCtx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(130.81, now);
      bass.frequency.exponentialRampToValueAtTime(196.0, now + 0.22);
      bassGain.gain.setValueAtTime(0.0001, now);
      bassGain.gain.linearRampToValueAtTime(0.14, now + 0.03);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      bass.connect(bassGain);
      bassGain.connect(master);
      bass.start(now);
      bass.stop(now + 0.45);
    }catch(e){
      console.log('Daily reward sound failed', e);
    }
  }


function showDailyPopup(text, reward){
    const popup = document.getElementById('dailyPopup');
    const desc = document.getElementById('dailyPopupText');

    playDailyCompleteSound();

    if(!popup || !desc) return;

    desc.textContent = text + '  +' + reward + ' coins 🪙';
    popup.classList.remove('hidden');

    clearTimeout(window.__dailyPopupTimer);
    window.__dailyPopupTimer = setTimeout(() => {
      popup.classList.add('hidden');
    }, 3600);
  }


  // SMALL INTERNAL DEBUG HELPERS
  window.ElectricSnakeTools = {
    testDailySound(){ showDailyPopup('Test daglig mission', 100); },
    resetDailies(){
      Object.keys(localStorage).forEach(k => {
        if(k.includes('electric-snake-dailies') || k.includes('electric-snake-daily-games') || k.includes('electric-snake-daily-shields')) window.__ES_STORAGE__.removeItem(k);
      });
      location.reload();
    },
    exportSave(){
      const data = {};
      Object.keys(localStorage).forEach(k => {
        if(k.startsWith('electric-snake')) data[k] = window.__ES_STORAGE__.getItem(k);
      });
      return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    }
  };


  // DAILY COMBO FALSE-COMPLETE GUARD V1
  function fixFalseCompletedComboDailies(){
    try{
      const stableKey = 'electric-snake-dailies-stable-v1';
      const saved = JSON.parse(window.__ES_STORAGE__.getItem(stableKey) || 'null');
      if(!saved || !Array.isArray(saved.items)) return;

      let changed = false;
      saved.items.forEach(item => {
        if(item.type === 'combo' && item.completed && (state.currentRunBestCombo || 0) < item.target){
          // Only undo if it was clearly completed before this run by old tracking logic.
          item.completed = false;
          item.progress = 0;
          changed = true;
        }
      });

      if(changed){
        window.__ES_STORAGE__.setItem(stableKey, JSON.stringify(saved));
        if(typeof dailyFinalState !== 'undefined') dailyFinalState = saved;
        if(typeof dailyV5State !== 'undefined') dailyV5State = saved;
        if(typeof dailyFixedState !== 'undefined') dailyFixedState = saved;
        if(typeof renderDailies === 'function') renderDailies();
        if(typeof dailyFinalRender === 'function') dailyFinalRender();
        if(typeof dailyV5Render === 'function') dailyV5Render();
        if(typeof dailyFixedRender === 'function') dailyFixedRender();
      }
    }catch(e){}
  }
  window.addEventListener('load', fixFalseCompletedComboDailies);


  const originalCheckTrophiesForSync = checkTrophies;
  checkTrophies = function(){
    const result = originalCheckTrophiesForSync.apply(this, arguments);
    syncCompletedTrophyProgress();
    return result;
  };



  window.ElectricSnakeStable = {
    stableMasterVersion: 'STABLE_MASTER_V1',
    dailyKey: 'electric-snake-dailies-stable-v1',
    comboRewardTiers: 'x1-x2=1, x3-x4=2, x5-x6=3, x7-x9=4, x10+=5',
    note: 'Use this as the base file for future updates.'
  };



  // NO CONTINUOUS PROXIMITY AUDIO V3 CLEAN
  function killContinuousHazardAudio(){
    try{
      if(state.hazardGain && state.audioCtx){
        state.hazardGain.gain.setTargetAtTime(0, state.audioCtx.currentTime, 0.03);
      }
    }catch(e){}
  }
  setInterval(killContinuousHazardAudio, 500);
  window.addEventListener('load', killContinuousHazardAudio);


  // MENU CLICK SAFETY FIX
  function ensureMenuButtonsClickable(){
    try{
      const startBtn = document.getElementById('startBtn');
      if(startBtn){
        startBtn.type = 'button';
        startBtn.style.pointerEvents = 'auto';
      }

      document.querySelectorAll('button').forEach(btn => {
        btn.style.pointerEvents = 'auto';
      });

      const overlay = document.getElementById('startOverlay');
      if(overlay){
        overlay.style.pointerEvents = 'auto';
      }
    }catch(e){}
  }
  ensureMenuButtonsClickable();
  window.addEventListener('load', ensureMenuButtonsClickable);


  // NETLIFY REAL MUSIC INTEGRATION V1
  function getBgMusic(){ return document.getElementById('bgMusic'); }

  function getNetlifyMusicVolume(){
    const master = Number(window.__ES_STORAGE__.getItem('electric-snake-volume-master') || 70) / 100;
    const music = Number(window.__ES_STORAGE__.getItem('electric-snake-volume-music') || 55) / 100;
    return Math.min(1, master * music * 0.8);
  }

  function setNetlifyMusicVolume(){
    try{
      const a = getBgMusic();
      if(!a) return;
      a.muted = !!state.audioMuted;
      if(!state.musicFadeActive) a.volume = getNetlifyMusicVolume();
    }catch(e){}
  }

  function fadeBgMusicTo(target, duration=800, after=null){
    try{
      const a = getBgMusic();
      if(!a) return;
      state.musicFadeActive = true;
      const start = Number.isFinite(a.volume) ? a.volume : 0;
      const startTime = performance.now();
      function step(now){
        const p = Math.min(1, (now - startTime) / duration);
        const eased = p < 0.5 ? 2*p*p : 1 - Math.pow(-2*p+2,2)/2;
        a.volume = start + (target - start) * eased;
        if(p < 1) requestAnimationFrame(step);
        else{
          a.volume = target;
          state.musicFadeActive = false;
          if(after) after();
        }
      }
      requestAnimationFrame(step);
    }catch(e){
      state.musicFadeActive = false;
      if(after) after();
    }
  }

  async function startBgMusic(){
    try{
      const a = getBgMusic();
      if(!a) return false;
      a.loop = true;
      a.muted = !!state.audioMuted;
      if(a.paused){
        a.volume = 0;
        await a.play();
      }
      fadeBgMusicTo(getNetlifyMusicVolume(), 900);
      return true;
    }catch(e){
      console.warn('Music could not start yet.', e);
      return false;
    }
  }

  function stopBgMusicFade(){
    try{
      const a = getBgMusic();
      if(!a) return;
      fadeBgMusicTo(0, 900, () => {
        try{ a.pause(); }catch(e){}
      });
    }catch(e){}
  }

  function patchMusicStartButton(){
    try{
      const startBtn = document.getElementById('startBtn');
      if(startBtn && !startBtn.__musicPatched){
        startBtn.__musicPatched = true;
        startBtn.addEventListener('click', () => startBgMusic(), true);
      }
    }catch(e){}
  }

  window.addEventListener('load', () => {
    patchMusicStartButton();
    setNetlifyMusicVolume();
  });
  setInterval(() => {
    patchMusicStartButton();
    setNetlifyMusicVolume();
  }, 1000);
  document.addEventListener('keydown', () => {
    if(state.running && !state.gameOver) startBgMusic();
  });


  if(typeof setGameOver === 'function' && !window.__netlifyMusicGameOverHooked){
    window.__netlifyMusicGameOverHooked = true;
    const originalSetGameOverForMusic = setGameOver;
    setGameOver = function(){
      stopBgMusicFade();
      return originalSetGameOverForMusic.apply(this, arguments);
    };
  }


  setInterval(saveSkinEconomyV3, 2000);
  window.addEventListener('beforeunload', saveSkinEconomyV3);


  setInterval(saveCoinsV10, 1500);
  window.addEventListener('beforeunload', saveCoinsV10);
  window.addEventListener('pagehide', saveCoinsV10);
  window.addEventListener('load', () => {
    loadCoinsV10();
    if(typeof updateUI === 'function') updateUI();
  });

})();

    // RESET BUTTON FIX OVERRIDE
    try{
      const resetBtn = $('resetBtn');
      if(resetBtn){
        const newBtn = resetBtn.cloneNode(true);
        resetBtn.parentNode.replaceChild(newBtn, resetBtn);

        newBtn.addEventListener('click', () => {
          clearHazardTimers();
          clearPowerupTimer();

          const restartLevel = state.level || state.selectedLevel || 1;

          if(isEndlessLevel()){
            state.endlessPoints = 0;
            resetEndlessCombo();
          }

  initLevelUnlockV1();
          setupLevel(restartLevel);
          state.running = true;
          startLoop();

          $('startOverlay').classList.add('hidden');
          $('gameOverOverlay').classList.add('hidden');

          updateUI();
          draw();
        });
      }
    }catch(e){
      console.log('Reset override failed', e);
    }