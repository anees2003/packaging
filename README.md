# Paramount Packages — website

Static multi-page site. No build step, no framework, no server-side code.

## Structure

```
index.html            Home
about.html            About, sustainability, PPWR pathway
products.html         Five print routes with specifications
technologies.html     Departments, equipment, colour control
brands.html           Segments and how a trim programme works
certifications.html   Certificates with issuing body and scope
quality.html          Control points, testing, innovation
careers.html          Open roles
contact.html          Departments, hours, visiting
quote.html            Quote request form
privacy.html          Privacy policy
robots.txt
sitemap.xml
assets/
  css/style.css
  js/main.js
  img/      13 site images (WebP)
  logo/     5 logo variants (WebP with transparency)
```

## Running it

Open `index.html` in a browser, or upload the whole folder to any host
(cPanel, Netlify, Vercel, GitHub Pages, S3). Nothing else is required.

Two resources load from a CDN: GSAP (cdnjs) and Google Fonts. To run fully
offline, download `gsap.min.js`, `ScrollTrigger.min.js` and the two font
families into `assets/` and update the `<link>` and `<script>` tags in each
page.

## Before going live

1. **Quote form has no backend.** `assets/js/main.js` only shows a success
   message. Point the form at a real endpoint — a PHP mail script, Formspree,
   Netlify Forms or your CRM — and handle the file upload server-side.
2. **Replace `https://example.com`** in `robots.txt` and `sitemap.xml` with the
   real domain.
3. **Swap the images.** Every image in `assets/img/` is a placeholder
   illustration. Replace each file with a real photograph of the same name and
   nothing else needs to change — the reveal and parallax animations are
   attached to the container, not the file.
4. **Certificate numbers.** `certifications.html` lists scope but not numbers
   or expiry dates. Add them, or keep sending them with quotations as the page
   says.
5. **Add analytics** if wanted — and if you do, update the cookie section in
   `privacy.html` and add a consent banner for EU visitors.

## Editing

- Colours, type and spacing are CSS custom properties at the top of
  `assets/css/style.css`. `--brand` is the logo red; the CMYK values are the
  process colours used for the scroll bar and registration marks.
- Dark mode is automatic, driven by `prefers-color-scheme`. Every token has a
  dark counterpart in the same file.
- Navigation lives in each page's `<header class="nav">` and in the mobile
  `<div class="sheet">`. Adding a page means adding a link in both, in all
  eleven files.
- All motion respects `prefers-reduced-motion`.
