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
