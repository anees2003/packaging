/* Paramount Packages — site behaviour
   Requires GSAP 3 + ScrollTrigger (loaded from CDN in each page). */
(function () {
"use strict";

var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
var G = window.gsap, ST = window.ScrollTrigger;
if (G && ST) G.registerPlugin(ST);

var PAGE = document.body.getAttribute("data-page") || "home";
var inkSegs = [].slice.call(document.querySelectorAll(".inkbar span"));

/* ------------------------------------------------ active nav link */
(function () {
  var here = location.pathname.split("/").pop() || "index.html";
  [].forEach.call(document.querySelectorAll('.nav__links a, .sheet a'), function (a) {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
  });
})();

/* ------------------------------------------------ mobile menu */
var sheet = document.getElementById("sheet"),
    burger = document.getElementById("burger"),
    sClose = document.getElementById("sheetClose");
function openSheet() {
  sheet.hidden = false;
  burger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  if (G && !reduced) G.from(sheet.querySelectorAll("a"), { y: 28, opacity: 0, duration: .5, stagger: .045, ease: "power3.out" });
}
function closeSheet() {
  sheet.hidden = true;
  burger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
if (burger) burger.addEventListener("click", function () { sheet.hidden ? openSheet() : closeSheet(); });
if (sClose) sClose.addEventListener("click", closeSheet);
if (sheet) sheet.addEventListener("click", function (e) { if (e.target.tagName === "A") closeSheet(); });
addEventListener("keydown", function (e) { if (e.key === "Escape" && sheet && !sheet.hidden) closeSheet(); });

/* ------------------------------------------------ cursor */
var cur = document.getElementById("cur");
if (cur && !reduced && G && matchMedia("(hover:hover) and (pointer:fine)").matches) {
  var qx = G.quickTo(cur, "x", { duration: .35, ease: "power3" }),
      qy = G.quickTo(cur, "y", { duration: .35, ease: "power3" });
  addEventListener("mousemove", function (e) { G.to(cur, { opacity: 1, duration: .3 }); qx(e.clientX); qy(e.clientY); });
  addEventListener("mouseleave", function () { G.to(cur, { opacity: 0, duration: .2 }); });
  document.addEventListener("mouseover", function (e) {
    var t = e.target.closest("a,button,input,select,textarea,.shot,.route,.plate");
    G.to(cur, { scale: t ? 2.1 : 1, duration: .35, ease: "power3" });
  });
}

/* ------------------------------------------------ nav hide / ink bar / back to top */
var navEl = document.getElementById("nav"), toTop = document.getElementById("totop"), lastY = 0;
function paintInk() {
  var h = document.documentElement.scrollHeight - innerHeight;
  var p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0;
  for (var i = 0; i < inkSegs.length; i++) {
    inkSegs[i].style.transform = "scaleY(" + Math.min(1, Math.max(0, (p - i * .25) / .25)) + ")";
  }
}
addEventListener("scroll", function () {
  var y = scrollY;
  if (navEl) navEl.classList.toggle("is-hidden", y > 220 && y > lastY);
  lastY = y;
  if (toTop) toTop.classList.toggle("on", y > 700);
  paintInk();
}, { passive: true });
addEventListener("resize", function () { paintInk(); if (ST) ST.refresh(); });
if (toTop) toTop.addEventListener("click", function () {
  scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
});

/* ------------------------------------------------ counters */
function fmt(n) { return Math.round(n).toLocaleString("en-US"); }
function counters(scope) {
  [].forEach.call(scope.querySelectorAll("[data-count]"), function (el) {
    var end = parseFloat(el.getAttribute("data-count")),
        sfx = el.getAttribute("data-suffix") || "",
        plain = el.hasAttribute("data-plain"),
        fin = plain ? String(end) : fmt(end) + sfx;
    if (!G || reduced) { el.textContent = fin; return; }
    var o = { v: 0 };
    G.to(o, {
      v: end, duration: 2, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: function () { el.textContent = plain ? String(Math.round(o.v)) : fmt(o.v) + sfx; },
      onComplete: function () { el.textContent = fin; }
    });
  });
}

/* ------------------------------------------------ scroll animation */
function common(scope) {
  if (!G || reduced) return;

  [].forEach.call(scope.querySelectorAll("h1, h2"), function (h) {
    G.fromTo(h, { clipPath: "inset(0 100% 0 0)", y: 16 },
      { clipPath: "inset(0 0% 0 0)", y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: h, start: "top 88%", once: true } });
  });

  [].forEach.call(scope.querySelectorAll(".tag"), function (t) {
    G.fromTo(t, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: .55,
      scrollTrigger: { trigger: t, start: "top 92%", once: true } });
  });

  [].forEach.call(scope.querySelectorAll(".lead, .measure > p, .band .btn"), function (p) {
    G.fromTo(p, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7, ease: "power2.out",
      scrollTrigger: { trigger: p, start: "top 92%", once: true } });
  });

  [".steps li", ".plate", ".certs article", ".marks span", ".speclist li", ".route", ".tl li", ".stats div"]
  .forEach(function (sel) {
    var groups = {};
    [].forEach.call(scope.querySelectorAll(sel), function (r) {
      var k = r.parentNode, id = k.__g || (k.__g = "g" + Math.random().toString(36).slice(2));
      (groups[id] = groups[id] || { p: k, i: [] }).i.push(r);
    });
    Object.keys(groups).forEach(function (k) {
      var g = groups[k];
      G.fromTo(g.i, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .65, ease: "power2.out", stagger: .05,
        scrollTrigger: { trigger: g.p, start: "top 88%", once: true } });
    });
  });

  [].forEach.call(scope.querySelectorAll(".shot"), function (s) {
    var im = s.querySelector("img"); if (!im) return;
    G.fromTo(s, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: s, start: "top 90%", once: true } });
    G.fromTo(im, { scale: 1.25 }, { scale: 1, duration: 1.3, ease: "power3.out",
      scrollTrigger: { trigger: s, start: "top 90%", once: true } });
    if (s.classList.contains("reveal-img")) {
      G.fromTo(im, { yPercent: -7 }, { yPercent: 7, ease: "none",
        scrollTrigger: { trigger: s, start: "top bottom", end: "bottom top", scrub: true } });
    }
  });

  [].forEach.call(scope.querySelectorAll(".phead__bg img, .band--art .hero__bg img"), function (im) {
    G.fromTo(im, { yPercent: -8 }, { yPercent: 8, ease: "none",
      scrollTrigger: { trigger: im.closest("section"), start: "top bottom", end: "bottom top", scrub: true } });
  });
}

/* ------------------------------------------------ accordions & tabs */
function interactions(scope) {
  [].forEach.call(scope.querySelectorAll(".acc__h"), function (btn) {
    var panel = btn.nextElementSibling;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      if (!G || reduced) { panel.style.height = open ? "0px" : "auto"; return; }
      G.to(panel, {
        height: open ? 0 : panel.firstElementChild.offsetHeight,
        duration: .5, ease: "power3.inOut",
        onComplete: function () { if (!open) panel.style.height = "auto"; if (ST) ST.refresh(); }
      });
    });
  });

  var tabs = [].slice.call(scope.querySelectorAll(".tabs button"));
  tabs.forEach(function (b) {
    b.addEventListener("click", function () {
      tabs.forEach(function (x) { x.setAttribute("aria-selected", "false"); });
      b.setAttribute("aria-selected", "true");
      [].forEach.call(scope.querySelectorAll("[data-panel]"), function (p) {
        var on = p.getAttribute("data-panel") === b.getAttribute("data-tab");
        p.hidden = !on;
        if (on && G && !reduced) G.fromTo(p.querySelectorAll("li"), { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: .45, stagger: .05, ease: "power2.out" });
      });
    });
  });
}

/* ------------------------------------------------ page specific */
function initHome() {
  var c = document.querySelector(".reg__l--c"), m = document.querySelector(".reg__l--m"),
      y = document.querySelector(".reg__l--y"), k = document.querySelector(".reg__l--k");
  if (G && !reduced && c) {
    G.timeline({ defaults: { ease: "power4.out" } })
      .set([c, m, y], { opacity: 0 })
      .from("#heroBg", { scale: 1.22, duration: 2.2, ease: "power2.out" }, 0)
      .from(k, { opacity: 0, y: 30, duration: .8 }, .25)
      .to(c, { opacity: .55, duration: .3 }, "-=.4").to(m, { opacity: .55, duration: .3 }, "<").to(y, { opacity: .55, duration: .3 }, "<")
      .fromTo(c, { x: -30, y: -16 }, { x: 0, y: 0, duration: 1.6 }, "<")
      .fromTo(m, { x: 24, y: 14 }, { x: 0, y: 0, duration: 1.6 }, "<")
      .fromTo(y, { x: -10, y: 26 }, { x: 0, y: 0, duration: 1.6 }, "<")
      .from(".hero__meta", { opacity: 0, y: 14, duration: .5 }, "-=1.3")
      .from(".hero__sub", { opacity: 0, y: 18, duration: .6 }, "-=1.1")
      .from(".hero__cta .btn", { opacity: 0, y: 16, duration: .5, stagger: .08 }, "-=.9")
      .from(".cue", { opacity: 0, duration: .5 }, "-=.5")
      .to(".hero__rule i", { scaleX: 1, duration: .7, stagger: .1, ease: "power3.inOut" }, "-=.8");

    G.to("#heroBg", { yPercent: 16, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
    G.to(".hero .wrap", { yPercent: -12, opacity: .25, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
  }

  var rail = document.getElementById("rail"), track = document.getElementById("railTrack");
  if (G && !reduced && rail && track && innerWidth > 860) {
    var d = track.scrollWidth - rail.clientWidth;
    if (d > 0) G.to(track, { x: -d, ease: "none",
      scrollTrigger: { trigger: rail, start: "center center", end: "+=" + (d + 250),
        pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 } });
  }

  var tk = document.getElementById("ticker");
  if (G && !reduced && tk) {
    G.to(tk, { x: -tk.scrollWidth / 2, duration: 26, ease: "none", repeat: -1 });
    G.to(tk, { x: "-=160", ease: "none",
      scrollTrigger: { trigger: tk.parentNode, start: "top bottom", end: "bottom top", scrub: 1 } });
  }
}

function initAbout() {
  var fill = document.getElementById("tlFill"), tl = document.getElementById("tl");
  if (G && !reduced && fill && tl) {
    G.to(fill, { height: "100%", ease: "none",
      scrollTrigger: { trigger: tl, start: "top 72%", end: "bottom 75%", scrub: .5 } });
  }
}

function initQuote() {
  var f = document.getElementById("quoteForm"), done = document.getElementById("quoteDone");
  if (!f) return;
  f.addEventListener("submit", function (e) {
    /* No backend wired up yet. Point this at your own endpoint (PHP mail script,
       Formspree, Netlify Forms, etc.) before going live. */
    e.preventDefault();
    if (!f.checkValidity()) {
      f.reportValidity();
      if (G && !reduced) G.fromTo(f, { x: -7 }, { x: 0, duration: .5, ease: "elastic.out(1,.3)" });
      return;
    }
    f.hidden = true; done.hidden = false;
    if (G && !reduced) G.from(done, { opacity: 0, y: 18, duration: .55, ease: "power2.out" });
    done.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  });
}

/* ------------------------------------------------ page-in wipe */
(function () {
  var bars = [].slice.call(document.querySelectorAll("#wipe b"));
  if (!bars.length) return;
  if (!G || reduced) { bars.forEach(function (b) { b.style.transform = "scaleY(0)"; }); return; }
  G.set(bars, { scaleY: 1, transformOrigin: "top" });
  G.to(bars, { scaleY: 0, duration: .45, stagger: .06, ease: "power3.out", delay: .05 });
})();

/* ------------------------------------------------ go */
interactions(document);
common(document);
counters(document);
if (PAGE === "home") initHome();
if (PAGE === "about") initAbout();
if (PAGE === "quote") initQuote();
paintInk();
})();
