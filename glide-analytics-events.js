/* Glide SMM GA4 events.
   Count each internal navigation click once. Lead CTA buttons are counted only
   on actual form opening by glide-lead-form.js; GA4 page_view covers page loads. */
(function () {
  'use strict';

  function trackEvent(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
  }

  function pageName(url) {
    return (url.pathname.split('/').pop() || 'index.html').toLowerCase();
  }

  function linkArea(link) {
    if (link.closest('.glide-site-header')) return 'header';
    if (link.closest('.glide-site-menu')) return 'mobile_menu';
    if (link.closest('footer')) return 'footer';
    return 'content';
  }

  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest
      ? event.target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download')) return;

    var label = (link.textContent || link.getAttribute('aria-label') || '')
      .replace(/\s+/g, ' ').trim().slice(0, 120);

    // This click will be tracked as lead_form_open by the shared form script.
    if (link.classList.contains('js-open-form') ||
        /^(Обговорити проєкт|Написати нам)$/i.test(label)) return;

    var destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch (error) {
      return;
    }
    if (!/^https?:$/.test(destination.protocol) ||
        destination.origin !== window.location.origin) return;

    var filename = pageName(destination);
    var params = {
      source_page: pageName(window.location),
      destination_page: filename,
      link_url: destination.href,
      link_text: label,
      navigation_area: linkArea(link)
    };
    if (destination.hash) {
      params.destination_section = destination.hash.slice(1, 100);
    }

    if (/^case-[a-z0-9-]+\.html$/.test(filename)) {
      trackEvent('case_open', params);
    } else if (filename === 'portfolio-design.html' ||
               filename === 'portfolio-montage.html') {
      trackEvent('portfolio_open', params);
    } else if (/^blog-[a-z0-9-]+\.html$/.test(filename)) {
      trackEvent('article_open', params);
    } else {
      trackEvent('navigation_click', params);
    }
  }, true);
})();
