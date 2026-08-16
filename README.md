# Listing IQ — SITE
Static site, zero dependencies. Built 2026-08-14. Open `index.html` in a browser to preview.

## Structure
- `index.html` — home: hero, gallery, how-it-works, pricing, compliance, contact
- `p/*.html` — one page per project; THIS is what the buy link in a pitch email points to
- `assets/` — web-weight JPEGs (all watermarked/watered-down versions ONLY — clean finals NEVER go in here)
- `css/site.css`, `js/site.js` — shared

## Wire up payments (the one thing left)
1. Create a Stripe account → Payment Links (no code needed): one link for "Sign Render $149", one for "Full Listing Pack $299" (or per-property links if you want cleaner bookkeeping).
2. In each `p/*.html`, paste the links into the `CHECKOUT` block at the top:
   `const CHECKOUT = { sign: 'https://buy.stripe.com/xxx', pack: 'https://buy.stripe.com/yyy' };`
3. Until then, buy buttons automatically fall back to a prefilled order email — the site works TODAY.
4. Delivery stays MANUAL (per THE ONE RULE): payment notification → email the clean files. Same-day promise, automate later.

## Deploy — LIVE since 2026-08-15
- **URL: https://julianofantone-creator.github.io/listingiq/** — GitHub Pages, repo `julianofantone-creator/listingiq` (renamed from flipvision 2026-08-15; public — only watermarked previews live here, so that's fine).
- Redeploy after any edit: `git add -A ; git commit -m "..." ; git push` from this folder. git.exe is NOT on PATH — use `C:\Users\julia\AppData\Local\GitHubDesktop\app-3.5.5\resources\app\git\cmd\git.exe` or add that dir to PATH first.
- Buy a domain (e.g. flipvision.co) and attach in repo Settings → Pages → Custom domain. Do this BEFORE the 25 pitches go out.

## Adding a new project (per pitch)
1. Make web assets from the WATERMARKED files only: resize to ~1600px JPEG (script: scratchpad `make_web_assets.ps1` pattern).
2. Copy an existing `p/*.html`, swap title/images/PROPERTY string, set `CHECKOUT` links.
3. Add a card in `index.html#work` (or don't — pitch pages can stay unlisted, see legal note).
4. Redeploy (drag folder again).

## Rules baked into this site
- **Previews = watermarked + reduced only.** The paid product (clean full-res) never touches the site. That's the real copy protection; the right-click/drag blocking in site.js is just a deterrent — no site can stop OS screenshots.
- **No testimonials section until we have a real one.** Placeholder comment marks the spot in index.html. Never fabricate.
- **Legal:** listing photos are copyrighted (photographer/broker). Pitching an agent their own listing = low risk. A PUBLIC gallery of client-photo-derived renders needs a usage-permission line in the paid deliverable — get it signed from customer #1 onward, and be ready to pull a project page if an owner objects. `p/` pages are noindex'd for this reason.
- Every image shown carries the ARTIST'S CONCEPT label (compliance is the selling point — it's in the copy).
