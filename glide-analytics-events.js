/* Site-wide GA4 engagement clicks. Not key events; successful leads are
   counted separately only after the server confirms receipt. */
(function () {
  'use strict';

  function trackEvent(eventName, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params);
  }

  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest
      ? event.target.closest('a[href]') : null;
    if (!link) return;

    var destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch (error) {
      return;
    }

    var filename = destination.pathname.split('/').pop().toLowerCase();
    var label = (link.textContent || '').replace(/\s+/g, ' ').trim();
    var source = window.location.pathname.split('/').pop() || 'index.html';
    var params = {
      source_page: source,
      destination_page: filename || 'index.html',
      link_url: destination.href
    };

    // Actual form opens are tracked separately as lead_form_open.
    // Clicking a CTA on a case/article page usually navigates home first.
    if (/обговорити проєкт|написати нам/i.test(label)) {
      params.cta_location = link.closest('.glide-site-header') ? 'header'
        : link.closest('.glide-site-menu') ? 'mobile_menu' : 'content';
      trackEvent('contact_cta_click', params);
    } else if (/^case-[a-z0-9-]+\.html$/.test(filename)) {
      trackEvent('case_open', params);
    } else if (filename === 'portfolio-design.html' || filename === 'portfolio-montage.html') {
      trackEvent('portfolio_open', params);
    } else if (/^blog-[a-z0-9-]+\.html$/.test(filename)) {
      trackEvent('article_open', params);
    }
  }, true);
})();
