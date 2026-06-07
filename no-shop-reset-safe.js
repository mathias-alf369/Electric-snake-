/* NO_SHOP_RESET_SAFE_PLAYABLE_V4 - safe hide only */
(function(){
  'use strict';

  function hideResetOnly(){
    try{
      document.querySelectorAll('#resetSkinOwnershipBtn,#resetFullShopBtn,#simpleResetShop,.simple-shop-reset').forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
      });

      document.querySelectorAll('button').forEach(btn => {
        const t = (btn.textContent || '').trim().toLowerCase();
        if(t.includes('reset shop') || t.includes('reset skins') || t.includes('nulstil shop') || t.includes('nulstil skins')){
          btn.style.display = 'none';
          btn.style.visibility = 'hidden';
          btn.style.pointerEvents = 'none';
        }
      });

      // Hide only the specific text node's nearest small reset row, never the whole menu/screen.
      document.querySelectorAll('div, p, span').forEach(el => {
        const t = (el.textContent || '').trim().toLowerCase();
        const isResetText = t === 'shop reset' ||
                            t === 'shop reset' ||
                            t === 'shop reset';
        if(isResetText){
          el.classList.add('no-shop-reset-hidden');
        }
      });
    }catch(e){}
  }

  function wrap(name){
    const old = window[name];
    if(typeof old !== 'function' || old.__hideResetWrapped) return;
    const wrapped = function(){
      const result = old.apply(this, arguments);
      setTimeout(hideResetOnly, 0);
      setTimeout(hideResetOnly, 100);
      return result;
    };
    wrapped.__hideResetWrapped = true;
    window[name] = wrapped;
  }

  function init(){
    hideResetOnly();
    wrap('renderShop');
    wrap('finalOpenMenu');
    setTimeout(hideResetOnly, 250);
    setTimeout(hideResetOnly, 750);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
