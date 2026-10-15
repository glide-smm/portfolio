/* Menu controller used on blog and thank-you pages that did not have the legacy menu handler. */
(function(){
  var btn=document.getElementById('burgerBtn');
  var panel=document.getElementById('menuPanel');
  var overlay=document.getElementById('menuOverlay');
  var closeBtn=document.getElementById('menuClose');
  if(!btn||!panel||!overlay||!closeBtn)return;
  function setOpen(open){
    panel.classList.toggle('open',open);
    overlay.classList.toggle('open',open);
    btn.classList.toggle('open',open);
    btn.setAttribute('aria-expanded',String(open));
    document.body.style.overflow=open?'hidden':'';
  }
  btn.addEventListener('click',function(){setOpen(!panel.classList.contains('open'));});
  closeBtn.addEventListener('click',function(){setOpen(false);});
  overlay.addEventListener('click',function(){setOpen(false);});
  panel.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setOpen(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false);});
})();
