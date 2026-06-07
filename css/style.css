/* CLEAN MASTER CSS: layout, shop, trophies, touch controls */
    :root{
      --bg:#07111f; --panel:#0f172a; --panel2:#020617; --text:#e5eefc; --muted:#94a3b8;
      --cyan:#22d3ee; --pink:#d946ef; --red:#ef4444; --yellow:#fde047; --border:#1e293b;
    }
    *{box-sizing:border-box}
    body{margin:0;font-family:Arial,Helvetica,sans-serif;background:radial-gradient(circle at top,#12335a,#07111f 55%);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:18px}
    .app{width:100%;max-width:1100px;background:rgba(15,23,42,.95);border:1px solid var(--border);border-radius:26px;overflow:hidden;box-shadow:0 28px 70px rgba(0,0,0,.45)}
    .header{padding:22px;border-bottom:1px solid var(--border);background:linear-gradient(90deg,#020617,#082f49,#020617)}
    .header-top{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
    h1{margin:0;font-size:34px}
    .sub{margin:8px 0 0;color:var(--muted);max-width:760px;line-height:1.45}
    .badges{display:flex;gap:10px;flex-wrap:wrap}
    .badge{padding:10px 14px;border-radius:14px;font-weight:700;background:#111827;border:1px solid rgba(255,255,255,.08)}
    .main{display:grid;grid-template-columns:1fr 290px;gap:20px;padding:22px}
    @media (max-width:900px){.main{grid-template-columns:1fr}}
    .boardWrap{position:relative;background:#000;border:1px solid #164e63;border-radius:24px;padding:14px}
    canvas{width:100%;max-width:700px;aspect-ratio:1/1;display:block;margin:auto;background:#020617;border-radius:16px}
    .overlay{position:absolute;inset:14px;background:rgba(0,0,0,.7);border-radius:18px;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
    .hidden{display:none}
    .panel{background:var(--panel2);border:1px solid var(--border);border-radius:20px;padding:16px;margin-bottom:14px}
    .row{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}
    button{border:none;border-radius:14px;padding:12px 14px;font-size:16px;font-weight:700;cursor:pointer}
    .primary{background:var(--cyan);color:#052739}
    .secondary{background:#1e293b;color:var(--text)}
    .danger{background:var(--red);color:#fff}
    .progress{height:16px;background:#1e293b;border-radius:999px;overflow:hidden;margin-top:12px}

    .powerup-progress{height:10px;background:#0f172a;border:1px solid rgba(56,189,248,.25);border-radius:999px;overflow:hidden;margin-top:8px}
    .powerup-fill{height:100%;background:linear-gradient(90deg,#38bdf8,#22d3ee);width:0%;box-shadow:0 0 12px rgba(56,189,248,.55)}
    .fill{height:100%;background:linear-gradient(90deg,var(--cyan),var(--pink));width:0%}
    .tips{font-size:14px;color:var(--muted);line-height:1.55}
    .touch{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:250px;margin:12px auto 0;touch-action:manipulation;user-select:none}
    .touch button{background:#1e293b;color:#fff;min-height:56px;font-size:24px;line-height:1;touch-action:manipulation}
    .touch .touch-empty{visibility:hidden}
    .touch .touch-pause{background:#334155;color:#e5eefc;font-size:18px}
    #game{touch-action:none}
    @media (max-width:900px){
      body{align-items:flex-start;padding:8px;overscroll-behavior:none}
      .app{border-radius:18px}
      .header{padding:14px}
      h1{font-size:26px}
      .sub{font-size:13px}
      .badges{gap:7px}
      .badge{padding:8px 10px;font-size:13px}
      .main{grid-template-columns:1fr;padding:12px;gap:12px}
      .boardWrap{padding:8px;border-radius:18px}
      .overlay{inset:8px;border-radius:14px;padding:14px}
      canvas{max-width:94vw}
      button{min-height:44px}
      .touch{max-width:280px;gap:12px}
      .touch button{min-height:64px;font-size:28px;border-radius:18px}
      .panel{padding:12px;margin-bottom:10px}
      #shopMenu{justify-content:flex-start !important;overflow-x:auto !important;flex-wrap:nowrap !important}
    }
  
    /* FORCE SHOP SKINS TO BE HORIZONTAL UNDER SHOP */
    #shopMenu{
      display:flex !important;
      flex-direction:row !important;
      justify-content:center !important;
      align-items:stretch !important;
      gap:8px !important;
      flex-wrap:wrap !important;
      max-width:720px !important;
      width:100% !important;
      margin:12px auto 0 !important;
      overflow-x:visible !important;
      padding-bottom:6px !important;
    }
    #shopMenu .shop-card{
      flex:0 0 112px !important;
      width:112px !important;
      min-width:112px !important;
      max-width:112px !important;
      min-height:128px !important;
      padding:8px !important;
    }
    #shopMenu .skin-preview{
      width:60px !important;
      height:14px !important;
    }
    #shopMenu button{
      font-size:12px !important;
      padding:7px 8px !important;
    }


    /* FULL SKIN PREVIEW FIX - all 10 shop skins are visible */
    .shop-card{background:#0f172a;border:1px solid #334155;border-radius:14px;padding:10px;text-align:center;color:var(--text)}
    .shop-card.equipped{border-color:var(--cyan);box-shadow:0 0 14px rgba(34,211,238,.25)}
    .shop-card.owned{border-color:#475569}
    .level-grid,.difficulty-grid{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:10px}
    .level-btn,.difficulty-btn{background:#1e293b;color:var(--text);border:1px solid #334155}
    .level-btn.locked{opacity:.38;cursor:not-allowed}
    .skin-preview{margin:0 auto 8px;border:1px solid rgba(255,255,255,.22)}
    .skin-neon{background:linear-gradient(90deg,#c084fc,#22d3ee,#a855f7,#67e8f9) !important;box-shadow:0 0 14px rgba(34,211,238,.7),0 0 24px rgba(168,85,247,.38);border-radius:999px;}
    .skin-fire{background:linear-gradient(90deg,#facc15,#fb923c,#f97316,#ef4444) !important;box-shadow:0 0 14px rgba(249,115,22,.75),0 0 24px rgba(250,204,21,.35);border-radius:999px;}
    .skin-gold{background:linear-gradient(90deg,#fff7ad,#facc15,#ca8a04,#fde68a) !important;box-shadow:0 0 14px rgba(250,204,21,.75),0 0 24px rgba(255,247,173,.35);border-radius:999px;}
    .skin-military{background:linear-gradient(90deg,#111827,#5b4636,#3f4f2f,#8a6a43,#0f172a) !important;box-shadow:0 0 14px rgba(214,179,106,.45);border-radius:999px;}
    .skin-arctic{background:linear-gradient(90deg,#f8fafc,#020617,#cbd5e1,#64748b,#ffffff) !important;box-shadow:0 0 14px rgba(191,219,254,.65);border-radius:999px;}
    .skin-toxic{background:linear-gradient(90deg,#bef264,#22c55e,#166534,#a3e635) !important;box-shadow:0 0 14px rgba(163,230,53,.65);border-radius:999px;}
    .skin-galaxy{background:linear-gradient(90deg,#0f172a,#312e81,#8b5cf6,#38bdf8,#020617) !important;box-shadow:0 0 14px rgba(139,92,246,.65),0 0 24px rgba(56,189,248,.25);border-radius:999px;}

    .skin-rainbow{
      background:linear-gradient(90deg,#ef4444,#f97316,#facc15,#22c55e,#06b6d4,#3b82f6,#8b5cf6,#ec4899) !important;
      box-shadow:0 0 14px rgba(236,72,153,.55),0 0 22px rgba(34,211,238,.35);
      border-radius:999px;
    }
    .skin-shadow{background:linear-gradient(90deg,#05000d,#581c87,#111827,#7e22ce) !important;box-shadow:0 0 14px rgba(126,34,206,.65),0 0 22px rgba(15,23,42,.55);border-radius:999px;}
    .skin-cyber{background:linear-gradient(90deg,#e5e7eb,#38bdf8,#64748b,#f8fafc) !important;box-shadow:0 0 14px rgba(56,189,248,.65),0 0 24px rgba(226,232,240,.35);border-radius:999px;}

  
    .trophy-menu-btn{
      position:absolute;
      top:14px;
      right:14px;
      background:#1e293b;
      color:#facc15;
      border:1px solid #facc15;
      border-radius:14px;
      padding:9px 12px;
      font-size:14px;
      z-index:5;
      width:auto;
    }
    .trophy-modal{
      position:absolute;
      inset:14px;
      background:rgba(2,6,23,.94);
      border:1px solid #334155;
      border-radius:18px;
      padding:18px;
      z-index:20;
      overflow:auto;
      text-align:left;
    }
    .trophy-modal.hidden{display:none}
    .trophy-header{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}
    .trophy-list{display:grid;grid-template-columns:1fr;gap:10px}
    .trophy-card{background:#0f172a;border:1px solid #334155;border-radius:14px;padding:12px;display:flex;gap:12px;align-items:center}
    .trophy-icon{font-size:24px;width:34px;text-align:center}
    .trophy-title{font-weight:700}
    .trophy-desc{font-size:13px;color:#94a3b8;margin-top:2px}
    .trophy-bronze{color:#cd7f32}
    .trophy-silver{color:#c0c0c0}
    .trophy-gold{color:#facc15}
    .trophy-platinum{color:#e0f2fe;text-shadow:0 0 8px rgba(125,211,252,.7)}
    .trophy-card.locked{opacity:.42;filter:grayscale(1)}
    .trophy-card.unlocked{border-color:#22c55e;box-shadow:0 0 10px rgba(34,197,94,.18)}
    .trophy-status{margin-left:auto;font-size:12px;color:#94a3b8}
    .trophy-stats-box{background:linear-gradient(135deg,#0f172a,#020617);border:1px solid #334155;border-radius:16px;padding:12px;margin-bottom:12px;box-shadow:0 8px 20px rgba(0,0,0,.22)}
    .trophy-stats-main{font-weight:800;font-size:15px;margin-bottom:8px;color:#e5eefc}
    .trophy-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
    .trophy-stat-pill{background:#111827;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:8px;text-align:center;font-size:12px;color:#cbd5e1}
    .trophy-stat-pill strong{display:block;font-size:14px;color:#e5eefc}
    .trophy-progress-wrap{margin-top:7px}
    .trophy-progress-text{font-size:12px;color:#cbd5e1;margin-bottom:4px}
    .trophy-progress-bar{height:7px;background:#1e293b;border-radius:999px;overflow:hidden;border:1px solid rgba(255,255,255,.05)}
    .trophy-progress-fill{height:100%;background:linear-gradient(90deg,#22d3ee,#d946ef);width:0%}
    .trophy-popup{position:fixed;top:18px;right:18px;background:#0f172a;border:1px solid #facc15;color:#e5eefc;border-radius:16px;padding:12px 14px;box-shadow:0 12px 30px rgba(0,0,0,.45);z-index:9999;min-width:240px;animation:trophyIn .25s ease-out}
    .trophy-popup.hidden{display:none}
    .trophy-popup.bronze{border-color:#cd7f32}
    .trophy-popup.bronze .trophy-popup-title{color:#cd7f32}
    .trophy-popup.silver{border-color:#c0c0c0}
    .trophy-popup.silver .trophy-popup-title{color:#c0c0c0}
    .trophy-popup.gold{border-color:#facc15}
    .trophy-popup.gold .trophy-popup-title{color:#facc15}
    .trophy-popup-title{font-weight:800;color:#facc15}
    .trophy-popup.bronze{border-color:#cd7f32 !important}
    .trophy-popup.bronze .trophy-popup-title{color:#cd7f32 !important}
    .trophy-popup.silver{border-color:#c0c0c0 !important}
    .trophy-popup.silver .trophy-popup-title{color:#c0c0c0 !important}
    .trophy-popup.gold{border-color:#facc15 !important}
    .trophy-popup.gold .trophy-popup-title{color:#facc15 !important}
    .trophy-popup.platinum{border-color:#e0f2fe !important}
    .trophy-popup.platinum .trophy-popup-title{color:#e0f2fe !important}
    .trophy-popup-desc{font-size:13px;color:#cbd5e1;margin-top:3px}
    @keyframes trophyIn{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}
  

    /* ELECTRIC SNAKE PLUS PATCH: feel/juice + cleaner playable build */
    .app{position:relative}
    .header{position:relative;overflow:hidden}
    .header:after{content:"";position:absolute;inset:-80px;background:radial-gradient(circle at 78% 20%,rgba(34,211,238,.22),transparent 34%),radial-gradient(circle at 24% 80%,rgba(217,70,239,.16),transparent 32%);pointer-events:none;animation:plusHeaderPulse 5s ease-in-out infinite alternate}
    @keyframes plusHeaderPulse{from{opacity:.45;transform:scale(1)}to{opacity:1;transform:scale(1.08)}}
    .badge{box-shadow:inset 0 0 0 1px rgba(255,255,255,.04),0 8px 22px rgba(0,0,0,.16)}
    .boardWrap{box-shadow:0 0 0 1px rgba(34,211,238,.18),0 0 40px rgba(34,211,238,.08),inset 0 0 22px rgba(34,211,238,.05)}
    canvas{box-shadow:inset 0 0 28px rgba(34,211,238,.10),0 0 30px rgba(0,0,0,.35)}
    .primary{box-shadow:0 0 18px rgba(34,211,238,.22);transition:transform .12s ease,filter .12s ease,box-shadow .12s ease}
    .secondary,.danger,.level-btn,.difficulty-btn,.touch button{transition:transform .12s ease,filter .12s ease,box-shadow .12s ease}
    button:hover{filter:brightness(1.08);transform:translateY(-1px)}
    button:active{transform:translateY(1px) scale(.98)}
    .level-btn[style*="--cyan"],.difficulty-btn[style*="--cyan"]{box-shadow:0 0 18px rgba(34,211,238,.35)}
    .plus-ribbon{margin:12px auto 0;display:inline-flex;gap:8px;align-items:center;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.22);color:#cffafe;padding:8px 12px;border-radius:999px;font-size:13px;font-weight:700}
    .plus-mini{font-size:12px;color:#94a3b8;margin-top:8px}
    .touch button{box-shadow:0 8px 22px rgba(0,0,0,.22)}
    .shop-card{transition:transform .12s ease,box-shadow .12s ease,border-color .12s ease}
    .shop-card:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.25)}

  
/* FINAL STABLE MAIN MENU + DAILY CHALLENGES */
.trophy-menu-btn{display:none !important;}
.final-menu-shell{width:min(780px,100%);margin:auto;background:linear-gradient(180deg,rgba(15,23,42,.97),rgba(2,6,23,.98));border:1px solid rgba(34,211,238,.28);border-radius:26px;padding:22px;box-shadow:0 24px 70px rgba(0,0,0,.55);max-height:92%;overflow:auto}
.final-menu-screen{display:none}.final-menu-screen.active{display:block}
.final-title{text-align:center;font-size:34px;font-weight:900;margin:0 0 6px;text-shadow:0 0 18px rgba(34,211,238,.35)}
.final-sub{text-align:center;color:#94a3b8;font-size:14px;margin:0 0 18px}
.final-menu-buttons{display:flex;flex-direction:column;gap:12px;max-width:370px;margin:0 auto}
.final-menu-btn{width:100%;padding:16px 18px;border-radius:18px;font-size:18px;font-weight:900;background:#111827;color:#e5eefc;border:1px solid #334155;text-align:left;cursor:pointer}
.final-menu-btn:hover{box-shadow:0 0 20px rgba(34,211,238,.20);transform:translateY(-1px)}
.final-back{background:#1e293b;color:#e5eefc;border:1px solid #334155;margin-bottom:12px;width:auto}
.final-card{background:rgba(2,6,23,.74);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:14px;margin-top:10px}
.final-card h3{margin:0 0 10px;font-size:18px}.final-start-action{text-align:center;margin-top:16px}.final-start-action button{min-width:220px;font-size:18px}
.final-daily-list{display:flex;flex-direction:column;gap:10px;margin-top:10px}.final-daily-card{background:#020617;border:1px solid #1e293b;border-radius:14px;padding:10px;text-align:left}.final-daily-top{display:flex;justify-content:space-between;gap:8px;font-size:14px;font-weight:800}.final-daily-bar{height:10px;background:#111827;border-radius:999px;overflow:hidden;margin-top:8px}.final-daily-fill{height:100%;background:linear-gradient(90deg,#22d3ee,#38bdf8);width:0%}.final-daily-meta{display:flex;justify-content:space-between;font-size:12px;color:#94a3b8;margin-top:6px}.final-daily-complete{color:#22c55e;font-weight:900}
.final-sound-row{display:grid;grid-template-columns:90px 1fr 48px;gap:10px;align-items:center;margin:12px 0;color:#cbd5e1;font-size:14px}.final-sound-row input{width:100%}
.final-save-text{width:100%;min-height:92px;background:#020617;color:#e5eefc;border:1px solid #334155;border-radius:12px;padding:10px;font-size:12px;resize:vertical}.final-save-status{font-size:13px;color:#38bdf8;text-align:center;margin-top:8px;min-height:18px}
@media(max-width:700px){.final-menu-shell{padding:16px}.final-title{font-size:28px}.final-menu-btn{font-size:17px;padding:14px}.final-sound-row{grid-template-columns:1fr}.final-start-action button{width:100%}}


/* DAILY COMPLETE POPUP V1 */
.daily-popup{
  position:fixed;
  top:72px;
  left:50%;
  right:auto;
  transform:translateX(-50%);
  background:#0f172a;
  border:1px solid #22d3ee;
  color:#e5eefc;
  border-radius:18px;
  padding:14px 18px;
  box-shadow:0 14px 36px rgba(0,0,0,.48),0 0 24px rgba(34,211,238,.22);
  z-index:9998;
  min-width:280px;
  max-width:min(92vw,460px);
  text-align:center;
  animation:dailyPopupIn .25s ease-out;
}
.daily-popup.hidden{display:none}
.daily-popup-title{font-weight:900;color:#38bdf8}
.daily-popup-desc{font-size:13px;color:#cbd5e1;margin-top:4px}
@keyframes dailyPopupIn{from{transform:translate(-50%,-12px);opacity:0}to{transform:translate(-50%,0);opacity:1}}to{transform:translateX(0);opacity:1}}


@media(max-width:700px){
  .daily-popup{top:64px;min-width:0;width:calc(100vw - 28px);padding:12px 14px}
}


/* VISUAL POLISH V1 */
body{
  background:
    radial-gradient(circle at 20% 10%, rgba(34,211,238,.18), transparent 28%),
    radial-gradient(circle at 80% 0%, rgba(217,70,239,.14), transparent 30%),
    radial-gradient(circle at bottom, #020617, #07111f 60%);
}
.app{
  border-color:rgba(34,211,238,.25);
  box-shadow:
    0 30px 80px rgba(0,0,0,.55),
    0 0 40px rgba(34,211,238,.08),
    inset 0 0 40px rgba(255,255,255,.02);
}
.header{
  background:
    linear-gradient(90deg,rgba(2,6,23,1),rgba(8,47,73,.95),rgba(2,6,23,1)),
    radial-gradient(circle at 30% 0%, rgba(34,211,238,.2), transparent 40%);
}
.boardWrap{
  box-shadow:
    inset 0 0 28px rgba(34,211,238,.10),
    0 0 34px rgba(34,211,238,.12);
}
canvas{
  background:
    radial-gradient(circle at center, rgba(15,23,42,.95), #020617 70%);
  box-shadow: inset 0 0 36px rgba(34,211,238,.10);
}
.overlay{
  backdrop-filter: blur(6px);
}
.badge{
  box-shadow: inset 0 0 12px rgba(34,211,238,.06), 0 0 14px rgba(0,0,0,.22);
}
button{
  transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
}
button:hover{
  transform: translateY(-1px);
  filter: brightness(1.06);
}
.primary{
  box-shadow:0 0 18px rgba(34,211,238,.22);
}
.secondary{
  border:1px solid rgba(255,255,255,.08);
}



/* SKIN SHOP V5 COMPACT COOL */
#shopMenu{
  display:block !important;
}
.skin-preview-v3{
  background:linear-gradient(180deg,rgba(2,6,23,.84),rgba(15,23,42,.64));
  border:1px solid rgba(34,211,238,.22);
  border-radius:14px;
  padding:8px;
  margin:6px 0 8px;
  box-shadow:inset 0 0 18px rgba(34,211,238,.05);
}
.skin-preview-v3-info{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  color:#e5eefc;
  font-size:12px;
  margin-bottom:5px;
}
#skinPreviewV3Title{
  font-size:14px;
}
#skinPreviewV3Meta{
  color:#facc15;
  font-size:11px;
  font-weight:900;
  white-space:nowrap;
}
#skinPreviewV3Canvas{
  width:100%;
  max-width:260px;
  height:78px;
  display:block;
  margin:0 auto;
  border-radius:11px;
  background:radial-gradient(circle at center,rgba(34,211,238,.08),rgba(2,6,23,.90));
  border:1px solid rgba(255,255,255,.06);
  pointer-events:none;
}
.skin-list-v3.compact{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:5px;
}
.skin-row-v3.compact{
  min-width:0;
  width:100%;
  min-height:34px;
  border-radius:10px !important;
  padding:6px 7px !important;
  display:flex !important;
  align-items:center !important;
  justify-content:space-between !important;
  gap:5px !important;
  background:rgba(15,23,42,.92) !important;
  border:1px solid rgba(148,163,184,.16) !important;
  color:#e5eefc !important;
  text-align:left !important;
  box-shadow:none !important;
}
.skin-row-v3.compact:hover,
.skin-row-v3.compact:focus{
  border-color:rgba(34,211,238,.45) !important;
  background:rgba(8,47,73,.65) !important;
  transform:none !important;
}
.skin-row-v3.compact span{
  font-weight:900;
  font-size:11.5px;
  line-height:1.05;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.skin-row-v3.compact em{
  font-style:normal;
  color:#facc15;
  font-size:10.5px;
  font-weight:900;
  white-space:nowrap;
}
.skin-row-v3.compact.equipped{
  border-color:rgba(34,197,94,.50) !important;
  background:rgba(20,83,45,.38) !important;
}
.skin-row-v3.compact.equipped em{
  color:#22c55e;
}
@media(max-width:520px){
  .skin-list-v3.compact{
    grid-template-columns:1fr;
  }
}

/* ---- extracted style block ---- */

.simple-shop-card {
    border: 1px solid rgba(148,163,184,.25);
    background: rgba(15,23,42,.72);
    border-radius: 14px;
    padding: 10px;
    margin: 8px 0;
  }
  .simple-shop-top {
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    margin-bottom:10px;
    color:#e5e7eb;
    font-size:13px;
  }
.skin-row-v3.simple-owned em { color:#86efac !important; }
  .skin-row-v3.simple-locked { opacity:.7; }
  .skin-row-v3.simple-locked em { color:#facc15 !important; }
  .skin-row-v3.simple-equipped {
    outline: 1px solid rgba(34,211,238,.75);
    box-shadow: 0 0 16px rgba(34,211,238,.18);
  }

/* ---- extracted style block ---- */

.skin-row-v3.ms-v3-locked { opacity: .72; }
  .skin-row-v3.ms-v3-locked em { color:#facc15 !important; }
  .skin-row-v3.ms-v3-owned em { color:#86efac !important; }
  .skin-row-v3.ms-v3-equipped { outline:1px solid rgba(34,211,238,.8); box-shadow:0 0 16px rgba(34,211,238,.18); }
  .ms-v3-shop-note { font-size:11px; color:#94a3b8; line-height:1.35; margin-top:4px; }

/* NO_SHOP_RESET_SAFE_PLAYABLE_V4
   Hide shop reset UI without deleting game/menu containers.
*/
#resetSkinOwnershipBtn,
#resetFullShopBtn,
#simpleResetShop,
.simple-shop-reset,
.shop-reset-row,
.reset-shop-row {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

/* Hide the old reset warning bubble if it exists as its own row/card */
.no-shop-reset-hidden {
  display: none !important;
}
