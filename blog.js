(function(){
  const toggle=document.querySelector('[data-menu-toggle]');
  const menu=document.getElementById('mobileNav');
  if(!toggle||!menu)return;
  function close(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}
  toggle.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
})();
