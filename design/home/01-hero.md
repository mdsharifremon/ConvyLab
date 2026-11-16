# Home 01: Hero design

**Status:** Draft, waiting for approval
**Content:** `content/home/01-hero.md`
**Built in:** `website/index.html`, section 1

## Layout

- Everything sits in the 1290px container, the same as the live site.
- Two columns, the left one wider (1.35 to 1), 96px apart.
- **Left:** the click icon and the eyebrow on one line, the headline in
  three lines, then the button.
- **Right:** the text, vertically centred, at about 26px. It is left-aligned
  and starts at the left edge of its column, not pushed to the screen edge.
- The hero fills the first screen, so it has room to breathe. The proof
  section starts below the fold.
- On phones: one column. Order is eyebrow, headline, button, text.

## Type and colour

- Headline: PT Sans Bold, about 78px on a laptop, primary purple, no
  underline.
- Eyebrow: 16px, uppercase, wide letter-spacing, accent purple, no
  background. It sits low, level with the foot of the icon.
- Text: body colour, with attention, connection, action and customers in
  bold primary purple.

## Motion, in order

| When  | What |
| ----- | ---- |
| 0.1s  | The icon pops in with a small rotation. |
| 0.2s  | The eyebrow arrives letter by letter: each letter slides in from the right, goes slightly past its place, and settles. |
| 0.35s | Each headline line rises out of a mask, 0.12s apart. |
| 0.75s | The text fades up. |
| 0.9s  | The button fades in. |

## The "Let's talk" button

One element with three looks:

1. **In the hero:** a dark purple pill. Turns accent purple on hover.
2. **Once the pill has scrolled off the top of the screen:** a round icon
   pops up in the bottom-right corner and stays there for the whole page.
   It does not fly across the page.
3. **On click:** it grows into the form in that corner. The page dims behind
   it. Fields rise in one after another.

The form closes with the X, the Escape key, or a click outside. After
sending, it shows "Got it."

## Why

- **No underline on the headline.** On the old site the underline made the
  headline look like a link.
- **Bigger right-side text.** On the old site it was 16px next to a huge
  headline and was easy to miss. It carries the whole approach, so it needs
  weight.
- **The eyebrow gets the richest animation** because it is the smallest
  text. Motion draws the eye to it first, then the headline lands.
- **The button follows the visitor.** A contact action that is always one
  click away removes the need for a button in every section.
- **The corner icon pops in instead of travelling.** In the first version
  the pill flew to the corner while the logo rows were also moving, and the
  two competed. Now only one thing moves at a time.
- **The form opens in place, not on a new page.** The visitor keeps their
  place and can close it and continue reading.

## Open items

- The logo file from the live site is only 102px wide. A vector (SVG) logo
  is needed.
- Text colour change on hover: parked for now.

## Update: button pattern (from good-fella.com, adapted)
- Shape: 14px radius (slightly rounded block, not a pill). Docked corner button is a 58px rounded square; open form is 20px radius. Pills read generic; a small radius reads calm and builds on the 20px cards below.
- Icon sits in a 58px cell at the left of the same element, same colour as the button (a darker box looked like two buttons); it never changes position. Hover (mouse only): the icon turns like a globe: 180 degrees around its vertical axis (perspective 900, 1.3s power3.inOut), the chat tail swings to the other side, and it turns back on mouse leave while the label retypes letter by letter (about 0.3s). Gap between icon and label is 10px. Too much movement made the button look distracted.
- Headline hover (mouse only): letters light up accent purple as the cursor passes and fade back over 1.2s, like a trail. Colour only, so nothing shifts and the line masks cannot clip it.
- "See our work": plain text, 2px bottom border (not text-decoration, because the letters are split), a purple line grows from the left over the faint base line on hover (0.7s) and leaves to the right, letters retype on hover. Click glides to #work.
- Both sit in .hero__actions (fades in as one piece, so the fixed corner button is not broken by a transform on a parent).
