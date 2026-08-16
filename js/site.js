// Listing IQ — shared site behavior

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
        'Hi Listing IQ,\n\nI want to purchase: ' + (btn.getAttribute('data-label') || sku) +
        '\nProperty: ' + propName +
        '\n\nName:\nBrokerage:\nPhone:\n');
      btn.setAttribute('href', 'mailto:julianogfantone@gmail.com?subject=' + subject + '&body=' + body);
    }
  });
})();
