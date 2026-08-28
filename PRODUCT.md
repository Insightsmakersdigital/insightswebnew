# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Business owners and marketing decision-makers at growing brands who need marketing, branding, and/or web development — not limited to a specific vertical. The site's FAQ names education, hospitality, events, and adventure/travel as examples of industries served, but the confirmed scope is broader: almost any industry whose needs match the studio's services. The studio and its founders are Kerala-based; client industry is not restricted by geography in the copy, though the studio's own location and voice are distinctly Kerala/India-rooted.

## Product Purpose

Insights Marketers is a digital marketing, branding, and web development studio that helps businesses build a sharper identity and drive measurable growth, integrating what would otherwise be separate vendor relationships (marketing agency, branding studio, dev shop) into one studio.

## Positioning

The differentiator is transparent, direct access to the whole team actually doing the work — not a single named claim like "no account manager," which is one current instantiation of that idea and can be reworded, but the underlying quality (clients aren't funneled through a layer of go-betweens; they work with the founders and specialists directly) is durable and should be preserved even if specific copy changes. This is paired with the three-pillar integration claim (Marketing, Branding, Build — nine disciplines under one roof, chosen to work together) as the structural half of the same positioning.

## Operating Context

- Engagement follows a confirmed 4-step process (documented on the About page): understand real goals, plan strategy before design work starts, build identity/web platforms/campaigns, measure and optimize continuously.
- Contact channels: email, phone, WhatsApp — direct, not routed through a ticketing/support layer.
- Nine services grouped into three pillars: Marketing (Social Media Marketing, SEO, SEM, Content Marketing), Branding (Corporate Branding & Identity, Package Designing, Graphic Designing), Build (Website Development, Video Production).
- Work/case-study coverage is uneven by design and shown honestly: some disciplines have real case studies, others are explicitly marked open ("no case study yet") rather than hidden or faked.

## Capabilities and Constraints

- Founded 2024, led directly by two founders (Nived A. Sumithran — CEO, Nuhman Daris — CMO).
- Nine disciplines across three pillars (see Operating Context). Services and their detail pages, work/case-study pages, and pricing are not all uniformly proven out yet — the site is honest about which disciplines have shipped work and which don't.
- Astro-based static site (see `## Stack` equivalent: existing codebase, not greenfield — Astro, vanilla TS in component `<script>` blocks, no UI framework, hand-authored CSS design-token system in `src/styles/tokens.css`/`global.css`).

## Brand Commitments

- Tagline: "You work with us. Not an account manager." — the specific wording is negotiable per the Positioning section above, but the substance (direct, transparent access to the people doing the work) is not.
- Visual identity is a deliberately restrained monochrome system (ink/paper) with exactly one accent color (a small lime status dot, used only to mean "available") — this discipline has been enforced repeatedly through this session's design work and is a durable brand commitment, not an incidental choice. (One page — the homepage process visualization — has since deliberately introduced a teal gradient as an explicit, confirmed exception; it is not a precedent for introducing color elsewhere without asking.)
- Typography: Inter Display for headings/display, Inter for body.
- Voice: direct, plain-spoken, low on marketing-speak — matches the "no account manager" positioning (e.g., work pages admit openly which disciplines don't have case studies yet instead of glossing over it).

## Evidence on Hand

- Real testimonials: Rahul Menon (Arena Animation), Sarah Thomas (Beyond Borders), Vishnu Nair (Zica Calicut) — in `src/pages/index.astro`.
- Real case study: Arena Animation (3 campuses rebranded, 60% more enquiries, 4 months to launch) — homepage case-study section.
- Work items and their real/placeholder status are tracked per-discipline in `src/data/site.ts` (`WORK_ITEMS`, `workForService`); pages must not fabricate case studies for disciplines that don't have one — the "open, no case study yet" pattern exists specifically so this isn't necessary.

## Product Principles

- Transparency over polish-by-omission: show what's real (case studies that exist) and admit what isn't (disciplines without one yet) rather than hiding gaps.
- Direct access is the product, not just the marketing line: the whole team, not a filtered/managed layer, is the actual working model — copy can reflect this in different words, but the substance shouldn't be diluted into a generic "great service" claim.
- One studio, not stitched-together vendors: the three-pillar structure is a real operating claim (services are designed to work together), not just a navigation category scheme.
- Restraint is the visual brand: one accent color, monochrome base, confident but quiet typography — loud/generic "premium" styling (gradients-as-decoration, stock effects) contradicts the positioning as much as inflated copy would.

## Accessibility & Inclusion

No formally adopted standard (e.g. WCAG AA) is required. Baseline good practice — reduced-motion support, keyboard operability, focus-visible states, meaningful aria-labels on decorative/interactive elements — should continue to be held as the default floor, consistent with what's already been built.
