import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_SHORT } from "../data/site";
import SiteChrome from "../components/SiteChrome";
import IntroLoader from "../components/IntroLoader";

const SITE_URL = "https://example.com";
const DEFAULT_OG_IMAGE = "/og-default.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: "/favicon.svg",
  },
  // Development-mode lockdown: remove this block before launch (see the SEO
  // indexing SOP) -- it keeps the unfinished site out of search results
  // alongside the disallow-all rule in robots.ts.
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500&display=swap"
          rel="stylesheet"
        />
        {/* Inter Display isn't on Google Fonts as its own family, so it's
            self-hosted -- see the @font-face block at the top of global.css
            and the woff2 files in public/fonts/. Preloading the weight the
            hero wordmark uses (800, the page's LCP element) avoids a flash
            of the fallback font on the very first paint. */}
        <link rel="preload" href="/fonts/InterDisplay-ExtraBold.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      {/* suppressHydrationWarning: some browser extensions (e.g. ColorZilla's
          `cz-shortcut-listen`) inject attributes onto <body> before React
          hydrates. That's a real, expected mismatch between server and
          client markup that we don't control and can't avoid -- the
          standard fix is to tell React not to warn about attributes on
          this specific node, not to "fix" a bug that isn't ours. */}
      <body suppressHydrationWarning>
        {/* See IntroLoader.tsx for the loader's full markup/animation rationale. */}
        <IntroLoader brand={SITE_SHORT} />

        <div className="noise-overlay" aria-hidden="true"></div>
        <div className="cta-glow" id="ctaGlow" aria-hidden="true"></div>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        {children}

        <SiteChrome />
      </body>
    </html>
  );
}
