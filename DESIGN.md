---
name: Insights Marketers
description: Digital marketing, branding, and web development studio — quiet monochrome system with one deliberate accent.
colors:
  ink: "#0f0f0f"
  paper: "#f6f6f6"
  graphite: "#666666"
  slate: "#6b6b6b"
  ash: "#757575"
  fog: "#969696"
  mist: "#bfbfbf"
  accent-lime: "#b3ff00"
  surface-dark: "#1a1a1a"
  surface-light: "#ececec"
  domino-teal: "#20807b"
typography:
  display:
    fontFamily: "Inter Display, Inter, sans-serif"
    fontSize: "clamp(3rem, 13vw, 8.125rem)"
    fontWeight: 800
    lineHeight: "clamp(2.4rem, 10.4vw, 6.5rem)"
    letterSpacing: "normal"
  headline:
    fontFamily: "Inter Display, Inter, sans-serif"
    fontSize: "clamp(3.625rem, 1.83rem + 7.62vw, 7.5rem)"
    fontWeight: 600
    lineHeight: "clamp(3.625rem, 1.83rem + 7.62vw, 7.5rem)"
    letterSpacing: "normal"
  title:
    fontFamily: "Inter Display, Inter, sans-serif"
    fontSize: "clamp(2.75rem, 1.79rem + 4.05vw, 5.625rem)"
    fontWeight: 600
    lineHeight: "clamp(2.475rem, 1.61rem + 3.65vw, 5.0625rem)"
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.2rem"
  label:
    fontFamily: "Inter Display, Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: "1.05rem"
rounded:
  sm: "8px"
  md: "8px"
  lg: "0px"
  xl: "0px"
  pill: "100px"
spacing:
  1: "4px"
  2: "8px"
  3: "10px"
  4: "16px"
  5: "20px"
  6: "24px"
  7: "30px"
  8: "40px"
  10: "60px"
  12: "80px"
  14: "90px"
  16: "100px"
  20: "120px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "20px 24px"
  button-primary-hover:
    backgroundColor: "#262626"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "20px 24px"
---

# Design System: Insights Marketers

## Overview

**Creative North Star: "The Open Ledger"**

Everything on this site is either black, white, or one of five measured grays between them — with exactly one exception, a lime-green status dot that means "available," and nowhere else. That restraint isn't decoration; it's the same claim the copy makes out loud: no layers, no filtering, direct access to the people doing the work. A visitor should be able to tell, just from how quiet the page is, that nothing is being dressed up to look bigger than it is.

The recurring structural pattern — work items, founder bios, pillar groups, FAQ rows, process steps — is a flush row separated by a hairline, not a boxed card with a shadow and a border-radius. That's the "ledger" half of the name: content is entered into the page like line items, not packaged into little product-shot tiles. Coverage is shown the same honest way — a discipline with a real case study looks different from one that doesn't have one yet ("Open now, no case study yet"), never silently omitted or faked to look complete.

One page, the homepage's process visualization (a domino chain, "The model" section), deliberately breaks the one-accent rule with a confirmed teal gradient run across its tiles. That's a logged, one-off exception — not a precedent for introducing color elsewhere without asking first.

**Key Characteristics:**
- Monochrome ink/paper base; exactly one accent color (lime), reserved for a single "available" status meaning
- Flush hairline-divided rows instead of boxed/shadowed cards — square corners everywhere except pills and circles
- Confident, oversized Inter Display headings at every major heading tier; plain Inter for body copy
- Motion is a slow, deliberate fade-and-rise on scroll-in (0.8s), never idle/ambient, never louder than the content it reveals
- Honesty over completeness: gaps in real content (missing case studies) are named plainly, not hidden

## Colors

Nearly monochrome by design — the palette's whole character is that there is almost no palette.

### Primary
- **Ink** (`#0f0f0f`): the default text/background anchor. Body background and text color in the dark-panel default theme; text color in the light-panel theme. Also the fixed, section-independent fill for primary buttons.
- **Paper** (`#f6f6f6`): ink's inverse — background in the light-panel theme, text in the dark-panel theme, and the fixed text color on primary buttons.

### Secondary
- **Accent Lime** (`#b3ff00`): used in exactly one place — the 6px "available for projects" status dot in the nav and the matching dot in the contact form's status line. Not a general-purpose accent; do not reach for it to add "pop" to an unrelated element.

### Neutral
- **Graphite** (`#666666`) / **Slate** (`#6b6b6b`) / **Ash** (`#757575`): the darker end of the measured muted-gray ramp — dim text (`--text-dim` in the dark-panel theme resolves to Fog; in the light-panel theme it resolves to Graphite), secondary labels.
- **Fog** (`#969696`) / **Mist** (`#bfbfbf`): the lighter end of the ramp — faint text (`--text-faint`), disabled-feeling or tertiary labels, hairline-adjacent captions.
- **Surface Dark** (`#1a1a1a`) / **Surface Light** (`#ececec`): the `--surface-2` step used for very subtle panel-on-panel distinction (e.g. skillset service grid cells) — never a card background with a border, just a slightly different flat fill.

### One-off exception
- **Domino Teal** (`#20807b`) and its 18-step gradient (light `#9fe3d6` to near-black `#04100e`): confirmed, logged exception used only on the homepage domino/process-chain component. See the Named Rule below.

### Named Rules
**The One Signal Rule.** The accent color appears in exactly one component family (status dots) and means exactly one thing ("available"). If you're reaching for lime to make something else stand out, the answer is contrast/size/weight in the existing grayscale, not a second use of the accent.

**The Confirmed Exception Rule.** The domino gradient on the homepage is real and intentional, not a violation to "fix" — but it's also not evidence that color is now open season elsewhere. New color anywhere else needs the same kind of explicit, deliberate sign-off it got.

## Typography

**Display Font:** Inter Display (self-hosted; not on Google Fonts as its own family), weights 400–900
**Body Font:** Inter (Google Fonts), weights 400–900

**Character:** Inter Display at display/headline/title sizes reads confident and oversized without needing tightened letter-spacing — headings use normal tracking at every size measured, which keeps the system from tipping into the "condensed premium SaaS" cliché. Inter for body keeps long-form copy plain and easy, with no display flourishes competing with it.

### Hierarchy
- **Display** (weight 800, `clamp(3rem, 13vw, 8.125rem)`, line-height `clamp(2.4rem, 10.4vw, 6.5rem)`): the hero brand wordmark only.
- **Headline** (weight 600, `clamp(3.625rem, 1.83rem + 7.62vw, 7.5rem)`): major section headings (Projects, Case Study, Contact).
- **Title** (weight 600, `clamp(2.75rem, 1.79rem + 4.05vw, 5.625rem)`): secondary section headings (Skillset, Pricing-tier-equivalent headings, Team).
- **Body** (weight 400, `1rem`/`1.2rem` line-height): paragraph copy, card/row descriptions.
- **Label** (weight 600, `0.875rem`/`1.05rem` line-height): stat labels, nav badge text, small captions — muted-gray by default, not the full-strength text color.

### Named Rules
**The Normal Tracking Rule.** Letter-spacing stays at `normal` even at display sizes. Don't tighten headings toward a "techy" condensed look — that reads as a different brand voice than this one.

## Layout

Content sits inside a real 4-column grid (`--grid-cols: 4`), max width 1400px, with visible column guides (`--grid-line-color`) on sections that use them — not just a max-width wrapper, components snap to actual column lines. Page gutter is 30px desktop / 20px mobile.

Section vertical rhythm uses the spacing scale's upper steps (`--space-14` 90px through `--space-20` 120px) for section padding, and a fluid `--space-cinematic` (`clamp(4.5rem, 2.5rem + 9vw, 9rem)`) for hero/section-head air that scales continuously with viewport instead of stepping at breakpoints. The page alternates full-bleed "panel" sections between a dark default theme and `.panel-light` — components read `var(--bg)`/`var(--text)`/etc. rather than hardcoding light or dark, so the same component looks correct in either panel.

## Elevation & Depth

Flat by default — there is no shadow vocabulary for surfaces. Depth is conveyed by the panel alternation (dark section directly against light section) and by the hairline dividers between ledger rows, not by lifting elements off the page. The two places `box-shadow` appears at all are both physical-object simulations, not UI elevation: the domino tiles' soft ground shadow (`0 14px 22px -14px rgb(0 0 0 / 40%)`) and a lime focus-ring pulse animation on one call-to-action. Neither is a reusable "card elevation" token — don't generalize either into a default card shadow.

### Named Rules
**The Flat Ledger Rule.** Surfaces don't lift. If something needs to feel separated from its neighbor, that's a hairline border-top, not a shadow.

## Shapes

Two shape languages, deliberately not blended: **pill/circle** for anything interactive or human (buttons at `100px` radius, avatars as circles), and **square** for everything else (cards, images, work-grid rows — `0px` radius). The small `8px` radius (`--radius-sm`/`--radius-md`) shows up only on small incidental UI (skip-link, focus outline corner) — it isn't a general card-corner value.

### Named Rules
**The Pill-or-Square Rule.** There is no middle ground (no 4px/12px/16px "softly rounded" card). A shape is either a full pill/circle or perfectly square.

## Components

### Buttons
- **Shape:** full pill (`100px` radius)
- **Primary:** fixed `ink` background / `paper` text regardless of the section's own theme — verified on the light hero, light footer, and dark sections alike; primary buttons do not adapt to `--bg`/`--text`. Padding `20px 24px` (`20px 40px` at the `.btn-lg` size).
- **Hover / Focus:** primary darkens to `#262626`; all button variants share a fast (`200ms`) transform/background/color transition and a `scale(0.97)` press state.
- **Outline / Ghost:** `.btn-outline` uses a theme-relative border (`var(--border)`) and text (`var(--text)`) so it does adapt per panel, unlike primary; `.btn-ghost` is text-only, dimmed to `--text-dim` at rest.

### Ledger Rows (signature pattern)
The site's real "card" component isn't a card — `.work-card`, `.founder-card`, `.pillar-block`, `.faq-row`, `.process-step`, and the homepage's `.statement-stat` all share the same shape: full-width, flush with the section background, separated from the next row by a single `1px` hairline (`border-top`, using the theme-relative `--border` token). No radius, no shadow, no card padding-as-container — the row's own internal padding does the spacing work.

### Status Dot / Badge
The one place the accent color is allowed: a `6px` circle, `var(--accent-lime)`, paired with the word "available." Used in the nav badge and the contact form status line — nowhere else.

### Navigation
Fixed-height (`60px`) sticky bar, permanently solid and single-colored (paper background, ink text) — it deliberately does not invert or go transparent over dark sections underneath it (an earlier scroll-driven inversion behavior was removed for being unreliable). Desktop and mobile are two separate markup blocks, not one row with responsive hiding.

### Domino Chain (signature component, homepage only)
A row of pill-less, flat-topped rectangular tiles standing on a shared baseline, filled with the one confirmed teal gradient exception (18 steps, light to near-black, left to right). A handful are taller and carry a single-word label (the real process steps); the rest are shorter, unlabeled "connector" tiles that exist only to lengthen and pace the chain. Nothing animates until a cursor or tap actually touches a tile, at which point it and every tile after it topples in a staggered ripple; tiles stay fallen until a second, deliberate interaction resets them. This is the one component on the site that both breaks the monochrome rule and treats motion as meaningful rather than ambient — both are confirmed, intentional exceptions to the system's general rules, not the default to imitate elsewhere.

## Do's and Don'ts

### Do:
- **Do** keep new color usage to ink/paper/the five measured grays, with the accent lime reserved for "available" status meaning only.
- **Do** use flush, hairline-divided rows for any new list-like content (case studies, team members, FAQ items, steps) instead of a bordered/shadowed card.
- **Do** keep primary buttons a fixed ink/paper pill regardless of what section they sit in.
- **Do** use normal letter-spacing at display/headline sizes — don't tighten toward a condensed look.
- **Do** show real gaps honestly (an "open, no case study yet" state) rather than omitting or padding out incomplete content.

### Don't:
- **Don't** introduce generic SaaS gradient/glow treatments — no purple-blue hero gradients, no glassmorphism, no glow-on-hover "premium" effects. They contradict both the one-accent-color discipline and the plainspoken positioning.
- **Don't** add a second general-purpose accent color without the same explicit, logged sign-off the domino teal exception got.
- **Don't** give cards/rows a border-radius, drop shadow, or visible border-all-sides treatment — the system's "card" is a flush row with a top hairline, not a boxed container.
- **Don't** add idle/ambient motion. Reveals fire once on scroll-in or on direct interaction (hover/tap); nothing loops or plays on its own.
