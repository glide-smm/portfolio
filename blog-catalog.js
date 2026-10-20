/* Filtering and pagination for the static, SEO-visible Glide SMM article cards. */
(function(){
  'use strict';
  const root=document.getElementById('blogCatalog');
  const search=document.getElementById('blogSearch');
  const sort=document.getElementById('blogSort');
  const more=document.getElementById('blogMore');
  const empty=document.getElementById('blogNoResults');
  const status=document.getElementById('blogStatus');
  if(!root||!search||!sort||!more||!empty||!status)return;
  const cards=Array.from(root.querySelectorAll('.post-card'));
  const featured=document.getElementById('latestPosts');
  const allPage=document.body.getAttribute('data-blog-page')==='all';
  let limit=9;
  function normalize(value){
    return String(value||'').toLocaleLowerCase('uk-UA').replace(/[\u2019\u2018\u02bc']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  }
  function render(){
    const terms=normalize(search.value).split(/\s+/).filter(Boolean);
    const oldest=sort.value==='oldest';
    const showFeaturedInCatalog=terms.length>0||oldest;
    if(featured)featured.hidden=terms.length>0;
    const matches=cards.filter(card=>{
      if(allPage&&!showFeaturedInCatalog&&card.dataset.featured==='true')return false;
      const indexed=normalize(card.textContent+' '+(card.dataset.keywords||''));
      return terms.every(term=>indexed.includes(term));
    }).sort((a,b)=>{
      const dateA=a.dataset.published||'',dateB=b.dataset.published||'';
      return oldest?dateA.localeCompare(dateB):dateB.localeCompare(dateA);
    });
    matches.forEach(card=>root.appendChild(card));
    const shown=new Set(matches.slice(0,limit));
    cards.forEach(card=>{card.hidden=!shown.has(card)});
    const count=matches.length;
    status.textContent=allPage&&!showFeaturedInCatalog&&!terms.length?'Інші публікації: '+count:'Знайдено публікацій: '+count;
    empty.hidden=count!==0;
    more.hidden=count<=limit;
  }
  search.addEventListener('input',function(){limit=9;render()});
  sort.addEventListener('change',function(){limit=9;render()});
  more.addEventListener('click',function(){limit+=9;render()});
  render();
})();
