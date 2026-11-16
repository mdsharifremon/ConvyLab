# ConvyLab website redesign

Three folders, in the order the work happens.

```
content/   what the site says, one file per section, with the reasons
design/    how it looks and moves, one file per section, with the reasons
website/   the build: plain HTML, CSS and JavaScript (no npm)
```

## How to view the site

Open `website/index.html` in a browser. It needs an internet connection for
the fonts, GSAP and (for now) the client logos.

## Status

| Section            | Content | Design | Built |
| ------------------ | ------- | ------ | ----- |
| Home 01: Hero      | Locked  | Draft  | Yes   |
| Home 02: Proof     | Locked  | Draft  | Yes   |
| Home 03 onward     | Draft (in the content doc) | Not started | No |

## Rules that apply everywhere

- Write the content first, then the design, then the build.
- Every file says what was decided and why, so a later change is a choice, not a guess.
- No promise the business cannot keep. See `content/README.md`.
- The final site is WordPress. Nothing here may depend on npm or a build step.
