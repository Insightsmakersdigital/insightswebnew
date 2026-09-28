## Development

Start the dev server with:

```
npm run dev
```

Build the static export with `npm run build` (writes to `out/`, since
`next.config.mjs` sets `output: "export"`). Preview a production build with
`npm run start` (note: `next start` doesn't serve the static `out/`
export — use a static file server, e.g. `npx serve out`, to preview the
actual exported site).

## Architecture

- App Router (`src/app`), TypeScript, static export (`output: "export"` in
  `next.config.mjs`) — every route is prerendered at build time, including
  the dynamic `/services/[slug]` and `/work/[service]` routes via
  `generateStaticParams`.
- Shared UI in `src/components`; site content/copy lives in `src/data/site.ts`.
- Global styles are plain CSS in `src/app/globals.css` (+ `tokens.css`), not
  Tailwind — component-scoped one-offs use CSS Modules (e.g.
  `src/app/team/team.module.css`).
- Client-only behavior (scroll reveals, accordions, the intro loader, the
  GSAP team hero, the WebGL roster sphere) lives in `"use client"`
  components; everything else is a server component.

## Documentation

Full documentation: https://nextjs.org/docs

Consult these guides before working on related tasks:

- [App Router routing, dynamic routes, layouts](https://nextjs.org/docs/app/building-your-application/routing)
- [Static exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Data fetching, `generateStaticParams`](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Styling (CSS Modules, global CSS)](https://nextjs.org/docs/app/building-your-application/styling)
- [Metadata and SEO](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
