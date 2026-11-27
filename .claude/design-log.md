# Design log

## /work/web-app showcase (Nov 2026)
Decided:
- Websites first, then Apps.
- Websites: light browser start page (Insights logo, real search, one shortcut per client). Opening fills the screen; page tabs; phone Back closes. Signature move: the site grows out of its shortcut.
- Apps: phone home screen, swipe through screenshots.
- New projects are images plus one entry in src/data/site.ts (reusable template, like the Instagram case study).

Rejected, with reason:
- Desktop monitor mockup: boring on phones, screenshot too small.
- Shrinking the monitor to fit the screen: screenshot became too small.
- Live demos, self-playing taps, QR, synced screens: too heavy / unnecessary.
- Loan-specific timeline ideas: not reusable for future projects.
- Search-results layout: could imply search rankings.

Standing rules:
- Keep it light: no new libraries, load images only when needed.

## Navbar (Nov 2026)
Decided (user):
- Apple-style floating glass island, centred. Rejected: full-width frosted bar (the first version).
Built:
- Logo, tabs and Start a project are separate bubbles at page top; they merge into one island on scroll (logo + menu button on mobile).
- One pill slides between desktop tabs, also across page changes. Services opens as a floating card.
- Mobile menu: glass card growing down from the island; Services expands by pillar; WhatsApp, Call, Email.
- .nav-underlay keeps the glass white at page top (body is dark).
