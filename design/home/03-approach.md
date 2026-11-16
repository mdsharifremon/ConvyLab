# Design: Home section 3, Our approach

## Layout
- Full-width tint (#F6F0FF) band, 180px top and 200px bottom padding, content in the 1290px container.
- Eyebrow (uppercase, accent), H2 "It starts with your audience." (PT Sans, up to 4.6rem, max 14ch).
- Four steps, 150px apart. Numbered circles (80px) alternate sides: 1 left, 2 right, 3 left, 4 right. Text sits beside each circle (title 2.2rem, body 1.2rem, max 460px).
- Closing line below in large PT Sans, last sentence in accent purple.

## Motion (one movement at a time)
- A dotted track joins the circles. A purple line is drawn along it as the visitor scrolls (ScrollTrigger scrub 0.6, stroke-dashoffset on pathLength 1, no plugin).
- When the line reaches a circle the circle fills purple and its text goes from 28% to full opacity. Nothing else moves.
- The curves are built in JS from the circles' real positions, rebuilt on resize and after fonts load.
- Reduced motion: lines fully drawn, all text full strength, no scroll animation.

## Mobile (under 900px)
- All circles on the left in one column (56px); the line becomes a straight vertical line.

## Why
- Alternating sides gives the path room to curve and reads as a journey. A straight list would read as a feature list.
- Dimming (not hiding) keeps the content in the page for SEO and for people without scripts.
