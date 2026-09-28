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

## Documentation

Full documentation: https://nextjs.org/docs

Consult these guides before working on related tasks:

- [App Router routing, dynamic routes, layouts](https://nextjs.org/docs/app/building-your-application/routing)
- [Static exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Data fetching, `generateStaticParams`](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Styling (CSS Modules, global CSS)](https://nextjs.org/docs/app/building-your-application/styling)
- [Metadata and SEO](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
