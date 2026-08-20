// Divine Listings — shared site behavior

// ---------- image deterrents ----------
// Honest note: nothing can stop an OS-level screenshot. These deterrents plus
// the baked-in watermark + watered-down resolution are the real protection —
// the paid product is the clean full-res file, which never touches this site.
document.addEventListener('contextmenu', function (e) {
  if (e.target.closest('.frame, .ba-pair, .thumb, .hero')) e.preventDefault();
});
document.addEventListener('dragstart', function (e) {
  if (e.target.tagName === 'IMG') e.preventDefault();
});
document.addEventListener('keydown', function (e) {
  // block trivial "save page" grabs; determined people will get past this, watermark won't let them
  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) e.preventDefault();
});

// ---------- responsive nav (2026-08-19) ----------
// Small screens: non-CTA links collapse behind a hamburger; the gold CTA pill
// stays visible in the header row at every width. Menu markup is built here so
// every page gets it from its existing <nav class="main"> with no HTML changes.
(function () {
  var header = document.querySelector('header.site');
  var nav = header && header.querySelector('nav.main');
  if (!nav) return;
  var links = Array.prototype.filter.call(nav.querySelectorAll('a'), function (a) {
    return !a.classList.contains('cta');
  });
  if (!links.length) return;
  var menu = document.createElement('div');
  menu.className = 'mobile-menu';
  links.forEach(function (a) { menu.appendChild(a.cloneNode(true)); });
  header.appendChild(menu);
  var btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-label', 'Menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(btn);
  btn.addEventListener('click', function () {
    var open = header.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') header.classList.remove('menu-open');
  });
})();

// ---------- buy buttons ----------
// Each property page defines: const CHECKOUT = { sign: 'https://buy.stripe.com/…', pack: '…' };
// Empty string = checkout link not wired yet -> falls back to a prefilled email order.
(function () {
  var cfg = (typeof CHECKOUT !== 'undefined') ? CHECKOUT : {};
  var propName = (typeof PROPERTY !== 'undefined') ? PROPERTY : document.title;
  document.querySelectorAll('[data-buy]').forEach(function (btn) {
    var sku = btn.getAttribute('data-buy');
    var link = cfg[sku];
    if (link) {
      btn.setAttribute('href', link);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener');
    } else {
      var subject = encodeURIComponent('ORDER — ' + propName + ' — ' + (btn.getAttribute('data-label') || sku));
      var body = encodeURIComponent(
        'Hi Divine Listings,\n\nI want to purchase: ' + (btn.getAttribute('data-label') || sku) +
        '\nProperty: ' + propName +
        '\n\nName:\nBrokerage:\nPhone:\n');
      btn.setAttribute('href', 'mailto:julianogfantone@gmail.com?subject=' + subject + '&body=' + body);
    }
  });
})();

// ---------- before/after drag slider (2026-08-19) ----------
(function () {
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var dragging = false;
    function setPos(clientX) {
      var r = slider.getBoundingClientRect();
      var pct = ((clientX - r.left) / r.width) * 100;
      slider.style.setProperty('--pos', Math.max(2, Math.min(98, pct)) + '%');
    }
    slider.addEventListener('pointerdown', function (e) {
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    slider.addEventListener('pointermove', function (e) {
      if (dragging) setPos(e.clientX);
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      slider.addEventListener(ev, function () { dragging = false; });
    });
    // little intro sweep so visitors notice it's draggable
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      var nudged = false;
      new IntersectionObserver(function (entries, io) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || nudged) return;
          nudged = true; io.disconnect();
          var start = null, dur = 1400;
          function frame(t) {
            if (dragging) return; // hands off once the visitor grabs it
            if (!start) start = t;
            var p = Math.min(1, (t - start) / dur);
            var eased = 0.5 - Math.cos(p * Math.PI) / 2;
            // 50 -> 58 -> 50: one gentle out-and-back sweep
            var pos = 50 + Math.sin(eased * Math.PI) * 8;
            slider.style.setProperty('--pos', pos + '%');
            if (p < 1) requestAnimationFrame(frame);
          }
          setTimeout(function () { requestAnimationFrame(frame); }, 400);
        });
      }, { threshold: 0.5 }).observe(slider);
    }
  });
})();

// ---------- sticky mobile CTA: show after scrolling past the hero ----------
(function () {
  var shown = false;
  function check() {
    var want = window.scrollY > 600;
    if (want !== shown) {
      shown = want;
      document.body.classList.toggle('show-sticky', want);
    }
  }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();

// ---------- scroll reveal: images & cards rise into view ----------
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.frame, .ba-pair figure, .gal .shot, .card, .twin, .price, .step');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.animationDelay = ((i % 3) * 110) + 'ms'; // light stagger so rows cascade
    io.observe(el);
  });
})();
