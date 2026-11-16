# Home 02: Proof design

**Status:** Draft, waiting for approval
**Content:** `content/home/02-proof.md`
**Built in:** `website/index.html`, section 2

## Part A: logo rows

- "Trusted by" centred above, 17px, uppercase, muted, with 64px below it.
- Two rows across the full width of the screen. Both edges fade out.
- Logos in their own colours, about 44px tall, 128px apart, with 64px
  between the two rows. They turn grey on hover.
- **Motion:** row one slides left and row two slides right, about 15% of
  their width, while the section crosses the screen. They move only while
  the visitor scrolls, with slight smoothing.

## Part B: counters

- Four equal boxes across the full container, 40px apart, 180px below the
  logos. Two by two on tablets.
- Each box: white, 20px corners, no border, lifted by a soft shadow.
- Number in PT Sans Bold, about 96px. The "+" in accent purple, slightly
  smaller. Label under it at about 19px.
- On phones the boxes stack, with the number left and the label right.

**Motion, once, when the row is three-quarters of the way down the screen:**

- Boxes rise 40px and fade in, 0.15s apart, left to right.
- Each number counts from 0 in 1.2s, starting as its own box appears.
- The "+" pops in as the number lands.

## Why

- **Scroll-driven rows instead of an endless marquee.** A strip that runs
  on its own pulls the eye away from the counters. One that answers the
  scroll feels calm.
- **Shadow instead of a border or a tinted background.** The cards stay
  the page colour and are separated by depth, which is calmer than lines.
- **Wide gaps between logos and between the rows.** Crowded logos compete
  with each other; space lets each one be read.
- **Full-colour logos.** They are recognised faster in their own colours.
- **Equal-width digits and a fixed number width** so the box does not wobble
  while counting.
- **No hover effect on the boxes.** They are not clickable.

## Open items

- The logo images currently load from the live convylab.com. Save them
  into `website/assets/logos/` and change the paths before the old site is
  replaced.
- Logos should be redrawn or exported in one colour for a cleaner row.
