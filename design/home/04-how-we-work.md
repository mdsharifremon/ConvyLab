# Design: Home section 4, How we work

Pattern taken from good-fella.com's process section (structure and behaviour only; colours, type, copy, photos and icons are ours).

## Desktop (900px and wider, motion allowed)
- The section pins for 320vh of scrolling. Scroll progress picks one of four steps.
- Left: the four steps (number, heading, body). The active step is dark, the others are faded (heading in --muted, body at 45%).
- A rounded purple marker with an icon slides down the list to the active step (1s expo.out). The icon inside crossfades: pen (brief), speech bubble (conversation), layout (design and build), shield with check (care). Icons are inline SVG, drawn in one stroke style, no icon library.
- Right: a 4:5 photo window with rounded corners. Four photos sit in a strip that slides up one frame per step (1s power3.inOut).
- Clicking a step scrolls to the point where it becomes active.
- Header: heading left, outlined button "See how we work" right (links to the How we work page once it exists; points at #how for now).

## Phones, tablets and reduced motion
- No pinning. The steps stack, each with its own 4:5 photo under the text. Nothing animates.
- Built with gsap.matchMedia, so resizing across the breakpoint switches layouts cleanly.

## Short laptop screens (under 736px tall)
- Smaller type and gaps so all four steps still fit while pinned.

## Photos (Unsplash, free to use, hot-linked for now)
1. photo-1620275765334-4ed948bb4502  pen on a notebook (brief)
2. photo-1604881991405-b273c7a4386a  two people with coffee (conversation)
3. photo-1663524789630-b18292c8de6e  laptop and tablet on a table (design and build)
4. photo-1498050108023-c5249f4df085     performance charts on a laptop (care and insights)
- To do before WordPress: download the four files into src/assets/ (800x1000 WebP), change the src paths, and credit photographers if wanted. Replace with ConvyLab's own photos later (team photo is planned for section 10).

## Why
- Scroll-through steps give each step the full stage, so the section feels like a story instead of four more boxes. It also looks different from section 3 (a drawn path), which answers the repetition concern.
