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
    var accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#7A00FF";
    var primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#341948";
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
})();
