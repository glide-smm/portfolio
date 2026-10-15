(function(){
  'use strict';
  if(document.getElementById('glOverlay')) return;
  document.body.insertAdjacentHTML('beforeend', "<div class=\"gl-overlay\" id=\"glOverlay\">\n  <div class=\"gl-modal\">\n    <button class=\"gl-close\" id=\"glClose\" aria-label=\"Закрити\">&times;</button>\n\n    <!-- форма -->\n    <div id=\"glFormWrap\">\n      <span class=\"gl-tag\">Залишити заявку</span>\n      <h3>Обговоримо <em>проєкт</em></h3>\n      <p class=\"gl-sub\">Залиште контакти і ми зв'яжемося з вами, щоб обговорити ваш проєкт. Зазвичай відповідаємо протягом робочого дня.</p>\n\n      <div class=\"gl-field\">\n        <label class=\"gl-label\" for=\"glName\">Ваше ім'я<span class=\"gl-star\">*</span></label>\n        <input type=\"text\" id=\"glName\" placeholder=\"Як до вас звертатися\" autocomplete=\"name\">\n      </div>\n      <div class=\"gl-field\">\n        <label class=\"gl-label\" for=\"glNiche\">Ніша бізнесу або запит<span class=\"gl-star\">*</span></label>\n        <textarea id=\"glNiche\" placeholder=\"Коротко про ваш бізнес або задачу\"></textarea>\n      </div>\n      <div class=\"gl-field\">\n        <label class=\"gl-label\" for=\"glPhone\">Номер телефону<span class=\"gl-star\">*</span></label>\n        <div class=\"gl-phone\" id=\"glPhoneWrap\">\n          <select id=\"glCode\" aria-label=\"Код країни\">\n            <option value=\"+380\" selected>🇺🇦 +380</option>\n            <option value=\"+48\">🇵🇱 +48</option>\n            <option value=\"+49\">🇩🇪 +49</option>\n            <option value=\"+44\">🇬🇧 +44</option>\n            <option value=\"+1\">🇺🇸 +1</option>\n            <option value=\"+34\">🇪🇸 +34</option>\n            <option value=\"+39\">🇮🇹 +39</option>\n            <option value=\"+33\">🇫🇷 +33</option>\n            <option value=\"+420\">🇨🇿 +420</option>\n            <option value=\"+40\">🇷🇴 +40</option>\n            <option value=\"+995\">🇬🇪 +995</option>\n            <option value=\"+971\">🇦🇪 +971</option>\n            <option value=\"+90\">🇹🇷 +90</option>\n            <option value=\"+7\">🇰🇿 +7</option>\n          </select>\n          <input type=\"tel\" id=\"glPhone\" placeholder=\"00 000 00 00\" autocomplete=\"tel\">\n        </div>\n      </div>\n      <div class=\"gl-field\">\n        <label class=\"gl-label\" for=\"glTg\">Нік у Telegram<span class=\"gl-star\">*</span></label>\n        <input type=\"text\" id=\"glTg\" placeholder=\"напр. @glide\" autocomplete=\"off\">\n      </div>\n      <!-- приховане поле-пастка для ботів -->\n      <input type=\"text\" class=\"gl-hp\" id=\"glHp\" tabindex=\"-1\" autocomplete=\"off\">\n\n      <button class=\"gl-submit\" id=\"glSubmit\">Надіслати заявку</button>\n      <div class=\"gl-err\" id=\"glErr\">Заповніть, будь ласка, всі поля.</div>\n    </div>\n\n    <!-- екран подяки -->\n    <div class=\"gl-thanks\" id=\"glThanks\">\n      <div class=\"gl-check\"><svg viewBox=\"0 0 52 52\"><path d=\"M14 27 l8 8 l16 -18\" fill=\"none\" stroke=\"#fff\" stroke-width=\"3.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></div>\n      <h3>Дякуємо за <em>заявку</em></h3>\n      <p>Ми вже отримали ваше повідомлення і скоро зв'яжемося, щоб обговорити проєкт.</p>\n    </div>\n\n  </div>\n</div>");
  var WORKER_URL = "https://tight-pine-1340glide-leads.vncreative-agency.workers.dev/";
  var overlay = document.getElementById('glOverlay');
  var closeBtn = document.getElementById('glClose');
  var submitBtn = document.getElementById('glSubmit');
  var errBox = document.getElementById('glErr');
  var formWrap = document.getElementById('glFormWrap');
  var thanks = document.getElementById('glThanks');

  function openForm(trigger){
    // Подія зацікавленості: лише фактичне відкриття форми.
    if(overlay.classList.contains('open')) return;
    overlay.classList.add('open');
    var location = trigger && trigger.closest('.glide-site-header') ? 'header'
      : trigger && trigger.closest('.glide-site-menu') ? 'mobile_menu' : 'content';
    if(typeof window.gtag === 'function'){
      window.gtag('event', 'lead_form_open', {
        form_id: 'glide_lead_form',
        cta_location: location
      });
    }
  }
  function closeForm(){
    overlay.classList.remove('open');
    // повертаємо форму у вихідний стан після закриття
    setTimeout(function(){ formWrap.style.display='block'; thanks.style.display='none'; errBox.style.display='none'; }, 250);
  }

  // Перехоплюємо усі CTA, включно з кнопками на кейсах і в блозі.
  document.addEventListener('click', function(e){
    var target = e.target && e.target.closest ? e.target.closest('a,button') : null;
    if(!target) return;
    var label = (target.textContent || '').replace(/\s+/g, ' ').trim();
    if(target.classList.contains('js-open-form') || /^(Обговорити проєкт|Написати нам)$/i.test(label)){
      e.preventDefault();
      openForm(target);
    }
  });
  closeBtn.addEventListener('click', closeForm);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) closeForm(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && overlay.classList.contains('open')) closeForm(); });

  submitBtn.addEventListener('click', function(){
    var nameEl = document.getElementById('glName');
    var nicheEl = document.getElementById('glNiche');
    var phoneEl = document.getElementById('glPhone');
    var tgEl = document.getElementById('glTg');
    var phoneWrap = document.getElementById('glPhoneWrap');
    var code = document.getElementById('glCode').value;

    var name = nameEl.value.trim();
    var niche = nicheEl.value.trim();
    var phoneRaw = phoneEl.value.trim();
    var tg = tgEl.value.trim();
    var hp = document.getElementById('glHp').value.trim();

    // скидаємо підсвітку
    [nameEl, nicheEl, tgEl].forEach(function(el){ el.classList.remove('gl-invalid'); });
    phoneWrap.classList.remove('gl-invalid');

    // перевірка обов'язкових полів — підсвічуємо порожні
    var ok = true;
    if(!name){ nameEl.classList.add('gl-invalid'); ok=false; }
    if(!niche){ nicheEl.classList.add('gl-invalid'); ok=false; }
    if(!phoneRaw){ phoneWrap.classList.add('gl-invalid'); ok=false; }
    if(!tg){ tgEl.classList.add('gl-invalid'); ok=false; }
    if(!ok){ errBox.textContent='Заповніть, будь ласка, всі поля.'; errBox.style.display='block'; return; }

    var phone = code + ' ' + phoneRaw;
    errBox.style.display='none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Надсилаємо...';

    fetch(WORKER_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name:name, niche:niche, phone:phone, telegram:tg, website:hp })
    })
    .then(function(r){
      // Фіксуємо лише HTTP-статус, без персональних даних клієнта.
      if(!r.ok) console.warn('Glide lead endpoint returned HTTP', r.status);
      return r.json();
    })
    .then(function(d){
      if(d && d.ok){
        formWrap.style.display='none';
        thanks.style.display='block';
        // GA4: рахуємо лише заявку, яку сервер підтвердив як отриману.
        // Не передаємо ім'я, телефон чи Telegram-контакт в аналітику.
        if(typeof window.gtag === 'function'){
          window.gtag('event', 'generate_lead', {form_id: 'glide_lead_form'});
        }
      } else { throw new Error('fail'); }
    })
    .catch(function(error){
      // Діагностика без імені, телефону, Telegram-ніка та вмісту форми.
      console.warn('Glide lead form: no success confirmation', error.message);
      errBox.innerHTML = 'Не вдалося підтвердити надсилання заявки. <a href="https://www.instagram.com/glide.smm/" target="_blank" rel="noopener noreferrer">Напишіть нам в Instagram</a>, щоб ми могли допомогти.';
      errBox.style.display='block';
    })
    .finally(function(){
      submitBtn.disabled = false;
      submitBtn.textContent = 'Надіслати заявку';
    });
  });
})();