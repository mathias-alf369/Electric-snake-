<!-- ELECTRIC_SNAKE_CLEAN_MASTER_V2: stable base after coin save fix -->
<!--
ELECTRIC_SNAKE_MODULAR_CLEAN_FINAL_V1

New file structure:
- index.html = layout only
- css/style.css = visuals
- js/boot-fixes.js = storage/bootstrap safety
- js/core.js = main game logic
- js/language.js = language/header text
- js/shop.js = coins/shop/skin ownership save system

Do future edits from this modular folder.
-->
<!--
ELECTRIC_SNAKE_REN_MASTER_V1_PLAYABLE_FIXED
Base: REN_MASTER_V1.
Fixes:
- Safe storage object used instead of direct localStorage so boot does not crash in restricted views.
- Bomber HUD badge removed and updateUI guards missing bombCount.
-->
<!--
ELECTRIC_SNAKE_REN_MASTER_V1

This is the new clean base.
Rules from now on:
1) Build only from this file.
2) One system change per version.
3) Shop/coins authority: one final REN_MASTER_V1 guard only.
4) Old duplicate V2 guard removed.
5) Old header-language interval/localStorage monkey patch removed.
6) Bomber HUD badge removed.
7) Coin source fix kept: gameplay/header/shop mirror the same balance.

Next planned feature can be language button, but as a separate V2 change.
-->
<!--
MASTER_STABLE_V3 — 2026-05-30
Base: MASTER_STABLE_V2/index.html
Rules from now on:
1) This file is the master base. Do not patch older builds.
2) One system change per version.
3) Shop source of truth: electric-snake-simple-* keys.
4) Reset shop buttons removed from UI.
5) Header text + Danish/English header switch preserved.
6) V2: final shop/coin authority script replaces older override/guard scripts.
7) V2: validates save-data on every shop render/purchase.
-->
<!DOCTYPE html>
<html lang="da">
<head>
  <!-- ELECTRIC_SNAKE_STABLE_MASTER_V2
       Stable base for future edits.
       Change one system at a time.
       Keep localStorage keys stable.
  -->

  <!-- REM_MASTER_V2_STABLE_BASE: v80-based master file. Future edits should build from this file. -->
  <!-- Electric Snake CLEAN MASTER BUILD | Stable base with Endless Combo + Touch + All Levels -->
  <!-- Future edits: change one system at a time. Main systems are marked in JS sections. -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electric Snake - MAA Productions | MASTER_STABLE_V2</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="app">
  <div class="header">
    <div class="header-top">
      <div>
        <h1>⚡ Electric Snake</h1>
        <p class="sub" id="dynamicHeaderText">🎮 af MAA Productions 💀 Overlev dødelige hazards 🪙 Saml coins 🎨 Lås sjældne skins op 🏆 Fuldfør daglige challenges ⚡ Mestre Endless Storm</p>
      </div>
      <div class="badges">
        <div class="badge">Level <span id="level">1</span></div>
        <div class="badge">Score <span id="score" style="color:#facc15">0</span></div>
        <div class="badge">Bedste <span id="best">0</span></div>
        <div class="badge">Endless <span id="endlessBest" style="color:#38bdf8">0</span></div>
          <div class="badge">Coins <span id="coins" style="color:#facc15">0</span> 🪙</div>
      </div>
    </div>
  </div>

  <div class="main">
    <div class="boardWrap">
      <canvas id="game" width="640" height="640"></canvas>

      <button id="trophyBtn" class="trophy-menu-btn">🏆 Trofæer</button>
        <div id="trophyModal" class="trophy-modal hidden">
          <div class="trophy-header">
            <h2 style="margin:0">Trofæer</h2>
            <button id="closeTrophyBtn" class="btn-outline" style="width:auto">Luk</button>
          </div>
          <div id="trophyList" class="trophy-list"></div></div>
        </div>

        <div id="startOverlay" class="overlay">
        <div class="final-menu-shell">
          <div class="final-menu-screen active" id="finalHome">
            <h2 class="final-title">⚡ Electric Snake</h2>
            <p class="final-sub">Hovedmenu</p>
            <div class="final-menu-buttons">
              <button type="button" class="final-menu-btn" data-final-open="finalPlay">▶ Start spil</button>
              <button type="button" class="final-menu-btn" data-final-open="finalDaily">📅 Daglige challenges</button>
              <button type="button" class="final-menu-btn" data-final-open="finalTrofæer">🏆 Trofæer</button>
              <button type="button" class="final-menu-btn" data-final-open="finalSound">🔊 Lyd</button>
              <button type="button" class="final-menu-btn" data-final-open="finalGem">💾 Gem</button>
              <button type="button" class="final-menu-btn" id="languageToggleBtn" data-no-translate="1">
                <span class="lang-btn-inner">
                  <img id="langFlagIcon" src="https://flagcdn.com/w40/dk.png" alt="DK" style="width:24px;height:16px;border-radius:3px;object-fit:cover">
                  <span id="langFlagText">Dansk / English</span>
                </span>
              </button>
            </div>
          </div>

          <div class="final-menu-screen" id="finalPlay">
            <button type="button" class="final-back" data-final-open="finalHome">← Tilbage</button>
            <div class="final-card">
              <h3>▶ Start spil</h3>
              <div class="final-menu-stats">
                <div class="final-menu-stat">Coins <strong><span id="menuCoins" style="color:#facc15">0</span> 🪙</strong></div>
                <div class="final-menu-stat">Skin <strong id="selectedSkinNameClean">Neon</strong></div>
                <div class="final-menu-stat">Level <strong id="unlockedLevelLabel">1</strong></div>
              </div>
              <h3 style="margin-top:16px">Difficulty</h3>
              <div class="difficulty-grid" id="difficultyMenu"></div>
              <h3 style="margin-top:16px">Vælg bane</h3>
              <div id="levelMenu" class="level-grid"></div>
              <h3 style="margin-top:16px">Shop / Skins</h3>
              <div id="shopMenu" class="shop-grid"></div>
              <div class="final-start-action"><button type="button" id="startBtn" class="primary">Start valgt level</button></div>
            </div>
          </div>

          <div class="final-menu-screen" id="finalDaily">
            <button type="button" class="final-back" data-final-open="finalHome">← Tilbage</button>
            <div class="final-card">
              <h3>📅 Daglige challenges</h3>
              <p class="tips">3 missioner hver dag. De giver coins og skifter automatisk.</p>
              <div id="finalDailyList" class="final-daily-list"></div>
            </div>
          </div>

          <div class="final-menu-screen" id="finalTrofæer">
            <button type="button" class="final-back" data-final-open="finalHome">← Tilbage</button>
            <div class="final-card">
              <h3>🏆 Trofæer</h3>
              <div id="finalTrophyList" class="trophy-list"></div>
            </div>
          </div>

          <div class="final-menu-screen" id="finalSound">
            <button type="button" class="final-back" data-final-open="finalHome">← Tilbage</button>
            <div class="final-card">
              <h3>🔊 Lyd</h3>
              <div class="final-sound-row"><span>Master</span><input id="finalMasterVolume" type="range" min="0" max="100" value="70"><span id="finalMasterLabel">70%</span></div>
              <button type="button" id="finalMuteBtn" class="secondary">Mute / Unmute</button>
              <p class="tips">Master slider styrer spillets lyd. Den gemmes lokalt.</p>
            </div>
          </div>

          <div class="final-menu-screen" id="finalGem">
            <button type="button" class="final-back" data-final-open="finalHome">← Tilbage</button>
            <div class="final-card">
              <h3>💾 Gem</h3>
              <p class="tips">Brug dette til at flytte coins, skins, trofæer og highscores mellem versioner.</p>
              <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px">
                <button type="button" id="finalShowGem" class="secondary" style="font-size:13px;padding:8px 10px">Vis save-kode</button>
                <button type="button" id="finalCopyGem" class="secondary" style="font-size:13px;padding:8px 10px">Kopiér</button>
                <button type="button" id="finalImportGem" class="primary" style="font-size:13px;padding:8px 10px">Importer</button>
              </div>
              <textarea id="finalGemBox" class="final-save-text" placeholder="Tryk Vis save-kode for at eksportere, eller indsæt en kode her og tryk Importer."></textarea>
              <div id="finalGemStatus" class="final-save-status"></div>
</div>
          </div>
        </div>
      </div>

      <div id="gameOverOverlay" class="overlay hidden">
        <div>
          <h2>Game over</h2>
          <p>Du nåede level <span id="finalLevel">1</span> og scorede <span id="finalScore">0</span>.</p>
          <button id="restartBtn" class="danger">Spil igen</button>
          <button id="gameOverMenuBtn" class="secondary" style="margin-top:10px">Tilbage til menu</button>

    <p style="margin-top:10px; font-size:13px; color:#94a3b8;">Tryk <strong>R</strong> eller tap på skærmen for hurtig restart ⚡</p>

        </div>
      </div>
    </div>

    <div>
      <div class="panel">
        <div class="row">
          <button id="toggleBtn" class="primary">Start / Pause</button>
          <button id="resetBtn" class="secondary">Reset</button>
          <button id="menuBtn" class="secondary">Menu</button>
          <button id="soundBtn" class="secondary">🔊 Lyd</button>
        </div>
        <div class="progress"><div id="progressFill" class="fill"></div></div>
        <div class="powerup-progress"><div id="powerupFill" class="powerup-fill"></div></div>
        <p class="tips"><span id="progressLabel">Level fremskridt</span>: <span id="progressText">0 / 25</span><br>
        <span id="powerupText" style="color:#38bdf8">Powerup: ingen aktiv</span></p>
      </div>

      <div class="panel">
        <strong>Kontrol</strong>
        <div class="touch" aria-label="Touch controls">
          <div class="touch-empty"></div><button data-dir="up" aria-label="Op">↑</button><div class="touch-empty"></div>
          <button data-dir="left" aria-label="Venstre">←</button><button id="touchPauseBtn" class="touch-pause" aria-label="Pause">⏯</button><button data-dir="right" aria-label="Højre">→</button>
          <div class="touch-empty"></div><button data-dir="down" aria-label="Ned">↓</button><div class="touch-empty"></div>
        </div>
      </div>

      <div class="panel tips">
        • Wrap-around vægge<br>
        • 25 prikker per level<br>
        • Magnetfeltet vises ikke oven på de første 2 blå kropsled<br>
        • Level 6 er bomber + flammer. Level 7 er laser + flammer. Level 9 har større bomberadius. Level 10 har hurtigere lasere og længere flammer<br>
        • Coins samles op 1:1 med point i menuen<br>
        • Hovedhit = game over<br>
        • Lyd reagerer diskret på hvor tæt du er på forhindringer
      </div>
    </div>
  </div>
</div>


<div id="dailyPopup" class="daily-popup hidden">
  <div class="daily-popup-title">📅 Daglig mission fuldført!</div>
  <div id="dailyPopupText" class="daily-popup-desc"></div>
</div>

<div id="trophyPopup" class="trophy-popup hidden">
  <div class="trophy-popup-title">🏆 Trofæ låst op!</div>
  <div id="trophyPopupText" class="trophy-popup-desc"></div>
</div>


<audio id="bgMusic" loop preload="auto" src="./slimeyfox-immortal-arcade-487328.mp3"></audio>
  <script src="js/core.js"></script>
  <script src="js/shop.js"></script>
  <script src="js/language.js"></script>
  <script src="js/no-shop-reset-safe.js"></script>
  <script src="js/coin-bridge.js"></script>
</body>

</html>