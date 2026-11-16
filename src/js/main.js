/* =====================================================================
   ConvyLab: home page (hero + proof)
   Plain JavaScript. GSAP, ScrollTrigger and Flip come from the <script>
   tags in index.html, so they are already global here. No npm.

   1. Setup
   2. Hero entrance
   3. Contact button: pill -> corner icon -> form
   4. Logo rows that move on scroll
   5. Counters
   ===================================================================== */

(function () {
  "use strict";

  // ---------- 1. Setup ----------
  var root = document.documentElement;

  // If the GSAP files did not load, show everything and stop.
  if (!window.gsap || !window.ScrollTrigger || !window.Flip) {
    root.classList.remove("anim");
    return;
  }

  gsap.registerPlugin(ScrollTrigger, Flip);

  // true when the visitor asked their device for less motion
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Colours live in the CSS as OKLCH tokens. GSAP blends plain rgb() values,
  // so this reads a token and returns it as rgb() (the browser does the maths).
  var colorProbe = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  function token(name, fallback) {
    var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!value || !colorProbe) return fallback;
    colorProbe.clearRect(0, 0, 1, 1);
    colorProbe.fillStyle = "#000";
    colorProbe.fillStyle = value;
    colorProbe.fillRect(0, 0, 1, 1);
    var d = colorProbe.getImageData(0, 0, 1, 1).data;
    return "rgb(" + d[0] + "," + d[1] + "," + d[2] + ")";
  }

  var cta = document.querySelector("#cta");
  var openBtn = document.querySelector("#openBtn");
  var closeBtn = document.querySelector("#closeBtn");
  var doneBtn = document.querySelector("#doneBtn");
  var sendBtn = document.querySelector("#sendBtn");
  var form = document.querySelector("#form");
  var scrim = document.querySelector("#scrim");

  // ---------- 2. Hero entrance ----------
  if (!reduce) {
    // Split the eyebrow into letters so each one can move on its own.
    var eyebrow = document.querySelector(".eyebrow");
    var text = eyebrow.textContent;
    eyebrow.setAttribute("aria-label", text); // screen readers read the whole phrase
    eyebrow.textContent = "";

    var chars = text.split("").map(function (ch) {
      var span = document.createElement("span");
      span.textContent = ch;
      span.setAttribute("aria-hidden", "true");
      span.style.display = "inline-block"; // transforms need inline-block
      span.style.whiteSpace = "pre"; // keeps the spaces
      eyebrow.appendChild(span);
      return span;
    });

    // One timeline. The last value on each line is the start time in seconds.
    var intro = gsap.timeline({ defaults: { ease: "power4.out" } });

    intro
      // icon pops in
      .from(".hero__icon", { scale: 0.4, rotation: -25, opacity: 0, duration: 0.9, ease: "back.out(2.5)", clearProps: "all" }, 0.1)
      // eyebrow wave: each letter slides in from the right, goes slightly past
      // its place, then settles. The stagger makes the wave travel.
      .from(chars, { x: 70, y: 6, opacity: 0, duration: 1.1, ease: "back.out(2.2)", stagger: 0.035, clearProps: "transform,opacity" }, 0.2)
      // headline: each line rises out of its mask
      .from("h1 .line > span", { yPercent: 110, duration: 1.1, stagger: 0.12, clearProps: "transform" }, 0.35)
      // right-side text
      .from(".hero__lead", { y: 30, opacity: 0, duration: 1, clearProps: "all" }, 0.75)
      // The button's wrapper only fades. A transform on a parent would break
      // position: fixed on the button inside it.
      .from(".hero__actions", { opacity: 0, duration: 0.7, clearProps: "opacity" }, 0.9);

    // The tweens above have already put every part in its start position,
    // so the CSS that was hiding them can go.
    root.classList.remove("anim");
  }

  // ---------- 2b. Hover text effects ----------
  // Mouse only. Touch screens have no hover, so the button is complete without it.
  var canHover = matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce;

  function splitChars(el) {
    var text = el.textContent;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    var out = [];
    text.split("").forEach(function (ch) {
      var s = document.createElement("span");
      s.className = "char";
      s.setAttribute("aria-hidden", "true");
      s.textContent = ch;
      el.appendChild(s);
      out.push(s);
    });
    return out;
  }

  function retype(chars) {
    gsap.fromTo(chars, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.25, ease: "power3.out", stagger: 0.025, overwrite: true });
  }

  if (canHover) {
    var ctaIcon = openBtn.querySelector("svg");
    var ctaLabel = openBtn.querySelector(".cta__label");
    var ctaChars = splitChars(ctaLabel);

    // The icon stays in its place and turns like a globe: half a turn around
    // its vertical axis, slow and smooth, while the label writes itself again.
    // The chat tail swings to the other side; leaving turns it back.
    var ctaIcon = openBtn.querySelector("svg");
    function globe(deg) {
      gsap.to(ctaIcon, { rotationY: deg, transformPerspective: 900, duration: 1.3, ease: "power3.inOut", overwrite: true });
    }
    openBtn.addEventListener("mouseenter", function () {
      if (cta.classList.contains("docked") || cta.classList.contains("open")) return;
      globe(180);
      retype(ctaChars);
    });
    openBtn.addEventListener("mouseleave", function () {
      if (cta.classList.contains("docked") || cta.classList.contains("open")) return;
      globe(0);
    });
    // docking or opening: make sure no letter is left half-written
    new MutationObserver(function () {
      if (cta.classList.contains("docked") || cta.classList.contains("open")) {
        gsap.killTweensOf([ctaChars, ctaIcon]);
        gsap.set(ctaChars, { clearProps: "all" });
        gsap.set(ctaIcon, { clearProps: "transform" });
      }
    }).observe(cta, { attributes: true, attributeFilter: ["class"] });

    // Headline: letters light up purple as the cursor passes and fade back
    // slowly, like a trail. Colour only, so nothing moves or reflows and the
    // line masks never clip it.
    var h1Spans = document.querySelectorAll("h1 .line > span");
    h1Spans.forEach(function (line) {
      var text = line.textContent;
      line.textContent = "";
      text.split("").forEach(function (ch) {
        var s = document.createElement("span");
        s.className = "hc";
        s.textContent = ch;
        line.appendChild(s);
      });
    });
    var accent = token("--accent", "rgb(122,0,255)");
    var primary = token("--primary", "rgb(52,25,72)");
    document.querySelector("h1").addEventListener("mouseover", function (e) {
      var t = e.target;
      if (!t.classList || !t.classList.contains("hc")) return;
      gsap.killTweensOf(t);
      gsap.fromTo(t, { color: accent }, { color: primary, duration: 1.2, ease: "power2.out", clearProps: "color" });
    });

    var link = document.querySelector("[data-retype]");
    if (link) {
      var linkChars = splitChars(link);
      link.addEventListener("mouseenter", function () { retype(linkChars); });
    }
  }

  // "See our work" glides to the Selected work section
  var workLink = document.querySelector(".hero__link");
  if (workLink) {
    workLink.addEventListener("click", function (e) {
      var target = document.querySelector("#work");
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  }

  // ---------- 3. Contact button ----------
  // Three facts decide how the button looks.
  var scrolled = false; // has the visitor scrolled past the top?
  var open = false; // is the form open?
  var sent = false; // has the form been sent?
  var opener = openBtn; // the button that opened the form gets focus back

  // The one function that changes the button:
  // 1. remember how it looks now  2. change the classes  3. Flip animates the difference
  function update(ease, duration) {
    Flip.killFlipsOf(cta); // stop a move that is still running
    gsap.killTweensOf(cta); // and any dock pop
    gsap.set(cta, { clearProps: "transform,opacity" });
    var state = Flip.getState(cta);

    cta.classList.toggle("docked", scrolled || open);
    cta.classList.toggle("open", open);
    cta.classList.toggle("sent", sent);

    Flip.from(state, {
      duration: reduce ? 0 : duration,
      ease: ease,
      scale: false, // animate real width and height, so the text never stretches
    });
  }

  function showScrim(show) {
    gsap.to(scrim, { autoAlpha: show ? 1 : 0, duration: reduce ? 0 : 0.4 });
  }

  // The pill stays in the hero until it has scrolled off the top of the
  // screen. Only then does a round icon pop up in the corner. It does not
  // fly across the page, so it never competes with the logo rows.
  function dock() {
    scrolled = true;
    if (open) return;
    gsap.killTweensOf(cta);
    cta.classList.add("docked");
    gsap.fromTo(
      cta,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: reduce ? 0 : 0.5, ease: "back.out(2)", clearProps: "transform,opacity" }
    );
  }

  // Scrolling back up: the corner icon shrinks away and the pill is home again.
  function undock() {
    scrolled = false;
    if (open) return;
    gsap.killTweensOf(cta);
    gsap.to(cta, {
      scale: 0,
      opacity: 0,
      duration: reduce ? 0 : 0.2,
      ease: "power2.in",
      onComplete: function () {
        cta.classList.remove("docked");
        gsap.set(cta, { clearProps: "transform,opacity" });
      },
    });
  }

  ScrollTrigger.create({
    trigger: ".slot",
    start: "bottom top", // the moment the pill's home leaves the screen
    end: "max",
    onEnter: dock,
    onLeaveBack: undock,
  });

  function openForm(e) {
    if (open) return;
    opener = (e && e.currentTarget) || openBtn;
    open = true;
    update("expo.out", 0.9);
    showScrim(true);
    openBtn.setAttribute("aria-expanded", "true");

    // fields rise in one after another while the panel grows
    gsap.from(".cta__form .field", {
      y: 24,
      opacity: 0,
      stagger: 0.06,
      ease: "back.out(1.7)",
      duration: reduce ? 0 : 0.6,
      delay: reduce ? 0 : 0.2,
    });
    form.querySelector("#name").focus({ preventScroll: true });
  }

  function closeForm() {
    if (!open) return;
    open = false;
    sent = false;
    update("expo.out", 0.8);
    showScrim(false);
    openBtn.setAttribute("aria-expanded", "false");
    opener.focus({ preventScroll: true }); // keyboard users land back where they started
  }

  // Every "Let's talk" on the page opens the same form.
  openBtn.addEventListener("click", openForm);
  document.querySelectorAll("[data-open-form]").forEach(function (btn) {
    btn.addEventListener("click", openForm);
  });
  closeBtn.addEventListener("click", closeForm);
  doneBtn.addEventListener("click", closeForm);
  scrim.addEventListener("click", closeForm);

  // DEMO ONLY: nothing is sent yet. Replace the setTimeout with the real
  // request when the form is connected in WordPress.
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";

    setTimeout(function () {
      form.reset();
      sendBtn.disabled = false;
      sendBtn.textContent = "Send it";
      sent = true;
      update("expo.out", 0.7);
      gsap.from(".cta__done > *", {
        y: 16,
        opacity: 0,
        stagger: 0.08,
        ease: "back.out(1.7)",
        duration: reduce ? 0 : 0.5,
        delay: reduce ? 0 : 0.2,
      });
      doneBtn.focus({ preventScroll: true });
    }, 900);
  });

  // Escape closes the form. Tab stays inside it while it is open.
  document.addEventListener("keydown", function (e) {
    if (!open) return;
    if (e.key === "Escape") closeForm();

    if (e.key === "Tab") {
      var items = Array.prototype.filter.call(cta.querySelectorAll("button, input, textarea, select"), function (el) {
        return !el.disabled && el.offsetParent !== null;
      });
      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // ---------- 4. Logo rows ----------
  // If a logo image fails to load, show the client's name instead.
  function useName(img) {
    var span = document.createElement("span");
    span.className = "logos__name";
    span.textContent = img.alt;
    img.replaceWith(span);
  }

  document.querySelectorAll(".logos__row img").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) useName(img);
    else img.addEventListener("error", function () { useName(img); });
  });

  // Wait for the images, because the row widths are not known before that.
  window.addEventListener("load", function () {
    var rows = gsap.utils.toArray(".logos__row");

    // Repeat the logos until each row is clearly wider than the screen,
    // so no empty gap shows while it slides.
    rows.forEach(function (row) {
      var originals = Array.prototype.slice.call(row.children);
      var guard = 0;
      while (row.scrollWidth < window.innerWidth * 1.6 && guard < 8) {
        originals.forEach(function (el) {
          var copy = el.cloneNode(true);
          copy.setAttribute("aria-hidden", "true");
          if (copy.tagName === "IMG") copy.alt = "";
          row.appendChild(copy);
        });
        guard++;
      }
    });

    if (reduce) return; // rows stay still

    // The rows move only while the section crosses the screen.
    // scrub: 0.6 adds a little smoothing so the motion never jerks.
    var scroll = { trigger: ".logos", start: "top bottom", end: "bottom top", scrub: 0.6 };

    gsap.fromTo('.logos__row[data-dir="left"]', { xPercent: 0 }, { xPercent: -15, ease: "none", scrollTrigger: scroll });
    gsap.fromTo('.logos__row[data-dir="right"]', { xPercent: -15 }, { xPercent: 0, ease: "none", scrollTrigger: scroll });

    ScrollTrigger.refresh(); // positions changed after the images loaded
  });

  // ---------- 5. Counters ----------
  var stats = gsap.utils.toArray(".stat");

  // Lock each number's width to its final value so nothing shifts while it counts.
  stats.forEach(function (stat) {
    var val = stat.querySelector(".stat__val");
    val.style.minWidth = val.dataset.to.length + "ch";
  });

  if (!reduce) {
    // Runs once, when the top of the row is three-quarters of the way down the screen.
    var tl = gsap.timeline({
      scrollTrigger: { trigger: ".stats", start: "top 75%", once: true },
    });

    stats.forEach(function (stat, i) {
      var val = stat.querySelector(".stat__val");
      var target = Number(val.dataset.to);
      var count = { n: 0 };
      var at = i * 0.15; // each box starts slightly after the one before

      val.textContent = "0";

      tl
        // the box rises in
        .from(stat, { y: 40, opacity: 0, duration: 0.7, ease: "power3.out", clearProps: "transform,opacity" }, at)
        // the number counts up in whole steps
        .to(count, {
          n: target,
          duration: 1.2,
          ease: "power2.out",
          snap: { n: 1 },
          onUpdate: function () { val.textContent = count.n; },
        }, at)
        // the plus pops in as the number lands
        .from(stat.querySelector(".stat__plus"), { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(3)" }, at + 1.05);
    });
  }

  // ---------- 5. Our approach: the line that joins the steps ----------
  // One purple line is drawn from circle to circle as the visitor scrolls
  // (scrub). When the line reaches a circle, the circle fills and its text
  // brightens. Nothing else moves, so there is only one movement at a time.
  var stepEls = document.querySelectorAll(".step");
  var stepsWrap = document.querySelector("#stepsWrap");
  var stepsSvg = document.querySelector("#stepsSvg");

  if (stepEls.length && stepsWrap && stepsSvg) {
    var SVGNS = "http://www.w3.org/2000/svg";
    var cs = getComputedStyle(document.documentElement);
    var cPrimary = token("--primary", "rgb(52,25,72)");
    var cWhite = token("--white", "rgb(255,255,255)");
    var cLine = token("--line", "rgb(231,223,243)");
    var DIM = 0.28;
    var lit = []; // which steps are lit right now
    var stepTriggers = [];

    function setStep(i, on) {
      if (lit[i] === on) return;
      lit[i] = on;
      var node = stepEls[i].querySelector(".step__node");
      var body = stepEls[i].querySelector(".step__body");
      gsap.to(body, { opacity: on ? 1 : DIM, duration: 0.7, ease: "power2.out", overwrite: true });
      gsap.to(node, {
        backgroundColor: on ? cPrimary : cWhite,
        color: on ? cWhite : cPrimary,
        borderColor: on ? cPrimary : cLine,
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
      });
    }

    if (!reduce) {
      // everything starts dim; scripts brighten it, so without scripts it is all readable
      stepEls.forEach(function (s, i) {
        lit[i] = false;
        gsap.set(s.querySelector(".step__body"), { opacity: DIM });
      });
    }

    function buildLines() {
      stepTriggers.forEach(function (t) { t.kill(); });
      stepTriggers = [];
      stepsSvg.innerHTML = "";

      var box = stepsWrap.getBoundingClientRect();
      stepsSvg.setAttribute("viewBox", "0 0 " + box.width + " " + box.height);

      var pts = Array.prototype.map.call(stepEls, function (s) {
        var r = s.querySelector(".step__node").getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, r: r.height / 2 };
      });

      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i];
        var b = pts[i + 1];
        var y1 = a.y + a.r;
        var y2 = b.y - b.r;
        var mid = (y1 + y2) / 2;
        // leaves the circle going down, sweeps across, and arrives going down
        var d = "M" + a.x + " " + y1 + " C" + a.x + " " + mid + " " + b.x + " " + mid + " " + b.x + " " + y2;

        var base = document.createElementNS(SVGNS, "path");
        base.setAttribute("d", d);
        base.setAttribute("class", "steps__base");
        stepsSvg.appendChild(base);

        var draw = document.createElementNS(SVGNS, "path");
        draw.setAttribute("d", d);
        draw.setAttribute("class", "steps__draw");
        draw.setAttribute("pathLength", "1");
        draw.style.strokeDasharray = "1";
        draw.style.strokeDashoffset = reduce ? "0" : "1";
        stepsSvg.appendChild(draw);

        if (!reduce) {
          (function (idx, line) {
            stepTriggers.push(
              ScrollTrigger.create({
                trigger: stepEls[idx],
                start: "center 62%",
                endTrigger: stepEls[idx + 1],
                end: "center 62%",
                scrub: 0.6,
                animation: gsap.fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none" }),
                onUpdate: function (self) { setStep(idx + 1, self.progress > 0.97); },
              })
            );
          })(i, draw);
        }
      }

      if (!reduce) {
        stepTriggers.push(
          ScrollTrigger.create({
            trigger: stepEls[0],
            start: "top 75%",
            onEnter: function () { setStep(0, true); },
            onLeaveBack: function () { setStep(0, false); },
          })
        );
      }
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { buildLines(); ScrollTrigger.refresh(); }, 200);
    });
    window.addEventListener("load", function () { buildLines(); ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { buildLines(); ScrollTrigger.refresh(); });
  }

  // ---------- 6. How we work: pinned steps (desktop, motion allowed) ----------
  // The section pins while the visitor scrolls. Scroll progress picks one of
  // four steps: the marker slides to it, the heading darkens, the photos slide
  // up one frame. Phones and reduced motion keep the plain stacked layout.
  var how = document.querySelector("#how");
  if (how) {
    var howTrack = how.querySelector(".how__track");
    var howRows = Array.prototype.slice.call(how.querySelectorAll(".how__step"));
    var howMarker = how.querySelector(".how__marker");
    var howIcons = Array.prototype.slice.call(howMarker.querySelectorAll("svg"));
    var howStrip = how.querySelector(".how__strip");

    gsap.matchMedia().add("(min-width: 56.25rem) and (prefers-reduced-motion: no-preference)", function () {
      var current = -1;
      how.classList.add("is-pinned");

      // the marker lines up with the middle of a step's heading
      function markerY(i) {
        var title = howRows[i].querySelector("h3");
        var parent = howMarker.offsetParent || howMarker.parentNode;
        var top = title.getBoundingClientRect().top - parent.getBoundingClientRect().top;
        return top + (title.offsetHeight - howMarker.offsetHeight) / 2;
      }

      function go(i, instant) {
        if (i === current) return;
        current = i;
        var d = instant ? 0 : 1.1;
        // the active step moves a little to the right, next to the marker; the others rest
        var shift = 1.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
        howRows.forEach(function (row, k) {
          row.classList.toggle("is-active", k === i);
          gsap.to(row, { x: k === i ? shift : 0, duration: d, ease: "expo.out", overwrite: true });
        });
        gsap.to(howMarker, { y: markerY(i), duration: d, ease: "expo.out", overwrite: true });
        gsap.to(howStrip, { yPercent: -25 * i, duration: d, ease: "power3.inOut", overwrite: true });
        howIcons.forEach(function (icon, k) {
          gsap.to(icon, { opacity: k === i ? 1 : 0, duration: instant ? 0 : 0.5, overwrite: true });
        });
      }

      go(0, true);

      var trigger = ScrollTrigger.create({
        trigger: howTrack,
        start: "top top",
        end: "bottom bottom",
        onUpdate: function (self) { go(Math.min(3, Math.floor(self.progress * 4))); },
      });

      // clicking a step scrolls to the spot where that step is active
      var clickers = howRows.map(function (row, i) {
        var fn = function () {
          var span = howTrack.offsetHeight - window.innerHeight;
          var y = howTrack.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / 4) * span;
          window.scrollTo({ top: y, behavior: "smooth" });
        };
        row.addEventListener("click", fn);
        return fn;
      });

      var onRefresh = function () { gsap.set(howMarker, { y: markerY(Math.max(current, 0)) }); };
      ScrollTrigger.addEventListener("refresh", onRefresh);
      onRefresh();

      return function () {
        trigger.kill();
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        howRows.forEach(function (row, i) {
          row.removeEventListener("click", clickers[i]);
          row.classList.remove("is-active");
        });
        gsap.set([howMarker, howStrip].concat(howIcons).concat(howRows), { clearProps: "all" });
        how.classList.remove("is-pinned");
      };
    });
  }
  // ---------- 7. What we do: the three cards rise in one after another ----------
  var svcCards = gsap.utils.toArray(".svc__card");
  if (svcCards.length && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    gsap.set(svcCards, { y: 60, opacity: 0 });
    ScrollTrigger.batch(svcCards, {
      start: "top 85%",
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.15, clearProps: "opacity,transform" });
      },
    });
  }
})();
