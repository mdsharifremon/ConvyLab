# Design tokens

All values are taken from the live convylab.com so the redesign stays the
same brand.

## Colours

| Name      | Hex     | Used for |
| --------- | ------- | -------- |
| primary   | #341948 | Headlines, button, numbers |
| secondary | #170B3B | Form panel |
| text      | #0E050F | Body text |
| muted     | #9388A2 | Labels, small text |
| tint      | #F6F0FF | Section backgrounds |
| white     | #FFFFFF | Page background |
| accent    | #7A00FF | Eyebrow, hover, the "+" and the counter line |
| line      | #E7DFF3 | Thin borders (added; a light step of the tint) |

Accent is used sparingly: one or two places per screen.

## Fonts

| Role      | Font | Weight |
| --------- | ---- | ------ |
| Headlines | PT Sans | 700 |
| Everything else | Figtree | 400 to 700 |

## Motion rules

1. **Buttery, not busy.** Long, soft landings: `power4.out` and `expo.out`
   for movement, `back.out` for small pops.
2. **Stagger everything that arrives as a group**, 0.035s between letters,
   0.12 to 0.15s between larger parts.
3. **Each animation runs once.** Only the logo rows respond to scroll
   position continuously.
4. **Nothing moves for visitors who turn motion off** (`prefers-reduced-motion`).
   They see the finished page immediately.
5. **Content is never created by the animation.** Text and numbers are in
   the HTML. Scripts only move them.
6. **No hover effects on things that cannot be clicked.**
7. **One movement at a time.** Two things should not travel across the
   screen together. If they would, one of them waits or simply fades in.

## Space

- Content sits in the same boxed container as the live site: 1290px wide,
  centred.
- Wide spacing is part of the look. Sections get 140 to 200px of vertical
  room on a laptop. When in doubt, add space rather than remove it.

## Build rules

- Plain HTML, CSS and JavaScript. No npm, no build step.
- GSAP 3.13 with ScrollTrigger and Flip, loaded with script tags. In
  WordPress these become `wp_enqueue_script` calls.

## Units and colour (rules for every section)
- **Sizes in rem** (1rem = 16px) so the whole site scales from one place. Only 1px and 2px hairlines (borders, outlines, thin lines) stay in px. Breakpoints are in rem too (68.75rem = 1100px, 56.25rem = 900px).
- **Colours in OKLCH**, as tokens in :root (--primary, --secondary, --text, --muted, --tint, --white, --accent, --line, --track, --text-soft). Why OKLCH: equal lightness steps look equal to the eye, so tints, hover states and shadows can be made by changing one number (L for lightness, C for colour strength, H for hue), and the vivid purple accent is not clipped like it is in plain sRGB. Transparent versions use `oklch(L C H / alpha)`. Never write a loose hex value in a section: add or reuse a token.
- JS reads tokens through `token()` in main.js, which returns rgb() because GSAP blends rgb values.

## Counters (section 2)
- Desktop: 4 columns. Tablet and phone: 2 columns. Number always on top, label below, at every size. Only padding, gap and number size shrink.
