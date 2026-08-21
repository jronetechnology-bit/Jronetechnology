(function(){
  var css = "#jrbot-btn{position:fixed;bottom:20px;right:20px;z-index:999;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#4FD1C5,#2E9C90);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,0.35);cursor:pointer;border:none;font-size:1.4rem;}#jrbot-panel{position:fixed;bottom:88px;right:20px;z-index:999;width:min(340px,calc(100vw - 40px));height:min(460px,calc(100vh - 140px));background:#16233A;border:1px solid rgba(241,239,234,0.12);border-radius:14px;display:none;flex-direction:column;overflow:hidden;font-family:'Inter',system-ui,sans-serif;box-shadow:0 12px 32px rgba(0,0,0,0.4);}#jrbot-panel.open{display:flex;}#jrbot-head{background:#0F1B2D;color:#F1EFEA;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(241,239,234,0.1);}#jrbot-head strong{font-size:0.95rem;}#jrbot-head span{display:block;font-size:0.72rem;color:#8A93A6;}#jrbot-close{background:none;border:none;color:#8A93A6;font-size:1.2rem;cursor:pointer;}#jrbot-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#0F1B2D;}.jrbot-msg{max-width:85%;padding:9px 12px;border-radius:10px;font-size:0.87rem;line-height:1.4;}.jrbot-msg.bot{background:#16233A;color:#F1EFEA;align-self:flex-start;border:1px solid rgba(241,239,234,0.08);}.jrbot-msg.user{background:#4FD1C5;color:#0F1B2D;align-self:flex-end;font-weight:500;}#jrbot-quick{display:flex;gap:6px;flex-wrap:wrap;padding:0 14px 10px;background:#0F1B2D;}.jrbot-chip{font-size:0.72rem;padding:5px 10px;border-radius:999px;background:rgba(79,209,197,0.12);color:#4FD1C5;border:1px solid rgba(79,209,197,0.3);cursor:pointer;white-space:nowrap;}#jrbot-input-row{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(241,239,234,0.1);background:#16233A;}#jrbot-input{flex:1;background:#0F1B2D;border:1px solid rgba(241,239,234,0.15);border-radius:8px;padding:9px 12px;color:#F1EFEA;font-size:0.85rem;outline:none;}#jrbot-send{background:#F2A65A;border:none;border-radius:8px;padding:0 14px;font-weight:700;color:#0F1B2D;cursor:pointer;font-size:0.85rem;}";
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var html = '<button id="jrbot-btn" aria-label="Fungua chatbot">\uD83D\uDCAC</button>' +
    '<div id="jrbot-panel">' +
      '<div id="jrbot-head"><div><strong>JrOne Msaidizi</strong><span>Kawaida hujibu papo hapo</span></div>' +
      '<button id="jrbot-close" aria-label="Funga">\u2715</button></div>' +
      '<div id="jrbot-msgs"></div>' +
      '<div id="jrbot-quick">' +
        '<div class="jrbot-chip">Huduma zenu</div>' +
        '<div class="jrbot-chip">Bei</div>' +
        '<div class="jrbot-chip">Templates bure</div>' +
        '<div class="jrbot-chip">Wasiliana</div>' +
      '</div>' +
      '<div id="jrbot-input-row">' +
        '<input id="jrbot-input" type="text" placeholder="Andika swali lako...">' +
        '<button id="jrbot-send">Tuma</button>' +
      '</div>' +
    '</div>';
  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // ============ FAQ — BADILISHA HAPA KULINGANA NA BIASHARA YAKO ============
  var FAQ = [
    { keys:["huduma","mnafanya","mnatoa"], a:"Tunatoa huduma za tovuti (web design), template za bure, na mifumo maalum ya admin. Unahitaji nini hasa?" },
    { keys:["bei","gharama","malipo","pesa"], a:"Templates zetu za bure hazina malipo. Kwa huduma maalum (custom), bei hutegemea mahitaji - tuandikie kwenye WhatsApp kupata quotation." },
    { keys:["template","templates"], a:"Tuna templates za bure: Landing Page ya Biashara, Portfolio, Duka Dogo, na CV Mtandaoni. Zote zinapatikana kwenye ukurasa wa Templates." },
    { keys:["wasiliana","contact","namba","simu","whatsapp"], a:"Unaweza kutuwasiliana kupitia WhatsApp au simu - bofya kitufe cha 'Wasiliana Nasi' kwenye tovuti." },
    { keys:["saa","muda","fungua","kazi"], a:"Tunajibu ujumbe kila siku, mara nyingi ndani ya masaa machache." },
    { keys:["admin","kupakia","upload"], a:"Fomu ya admin inatumika kupakia maudhui mapya kwenye tovuti - kwa matumizi ya ndani ya timu yetu." }
  ];
  var FALLBACK = "Samahani, sijaelewa swali lako vizuri. Unaweza kutuwasiliana moja kwa moja kupitia WhatsApp kwa msaada zaidi.";
  var GREETING = "Habari! Mimi ni msaidizi wa JrOneTechnology. Niulize kuhusu huduma zetu, bei, au templates.";
  // ==========================================================================

  var btn = document.getElementById('jrbot-btn');
  var panel = document.getElementById('jrbot-panel');
  var closeBtn = document.getElementById('jrbot-close');
  var msgs = document.getElementById('jrbot-msgs');
  var input = document.getElementById('jrbot-input');
  var send = document.getElementById('jrbot-send');
  var opened = false;

  function addMsg(text, who){
    var d = document.createElement('div');
    d.className = 'jrbot-msg ' + who;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function answer(q){
    var lower = q.toLowerCase();
    for (var i=0;i<FAQ.length;i++){
      for (var j=0;j<FAQ[i].keys.length;j++){
        if (lower.indexOf(FAQ[i].keys[j]) !== -1){ return FAQ[i].a; }
      }
    }
    return FALLBACK;
  }

  function handleSend(text){
    text = text.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    setTimeout(function(){ addMsg(answer(text), 'bot'); }, 350);
  }

  btn.addEventListener('click', function(){
    opened = !opened;
    panel.classList.toggle('open', opened);
    if (opened && msgs.children.length === 0){ addMsg(GREETING, 'bot'); }
  });
  closeBtn.addEventListener('click', function(){ opened=false; panel.classList.remove('open'); });
  send.addEventListener('click', function(){ handleSend(input.value); });
  input.addEventListener('keydown', function(e){ if(e.key==='Enter'){ handleSend(input.value); } });

  document.querySelectorAll('.jrbot-chip').forEach(function(chip){
    chip.addEventListener('click', function(){ handleSend(chip.textContent); });
  });
})();
