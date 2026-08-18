(function(){
  var STORAGE_KEY = 'jrone_lang';

  function getLang(){
    return localStorage.getItem(STORAGE_KEY) || 'sw';
  }

  function setLang(lang){
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
    updateToggleLabel(lang);
  }

  function applyLang(lang){
    document.querySelectorAll('[data-sw]').forEach(function(el){
      var val = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-sw');
      if(val === null){ return; }
      var tag = el.tagName;
      if(tag === 'INPUT' || tag === 'TEXTAREA'){
        el.setAttribute('placeholder', val);
      } else {
        el.innerHTML = val;
      }
    });
    document.documentElement.setAttribute('lang', lang);
  }

  function updateToggleLabel(lang){
    var btn = document.getElementById('langToggle');
    if(btn){
      btn.textContent = lang === 'en' ? 'SW' : 'EN';
      btn.setAttribute('aria-label', lang === 'en' ? 'Badili kwenda Kiswahili' : 'Switch to English');
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    var lang = getLang();
    applyLang(lang);
    updateToggleLabel(lang);
    var btn = document.getElementById('langToggle');
    if(btn){
      btn.addEventListener('click', function(){
        var current = getLang();
        setLang(current === 'en' ? 'sw' : 'en');
      });
    }
  });
})();
