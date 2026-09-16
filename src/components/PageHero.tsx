import Link from "next/link";
import RevealHeading from "./RevealHeading";

interface Props {
  eyebrow: string;
  heading: string;
  subhead?: string;
  light?: boolean;
  // Explicit "go back to the listing page" link -- not the browser back
  // button (which can land somewhere unrelated if this page was opened
  // directly), always the actual parent page for this route.
  backHref?: string;
  backLabel?: string;
}

export default function PageHero({ eyebrow, heading, subhead, light = true, backHref, backLabel }: Props) {
  return (
    <section className={["page-hero", light && "panel-light"].filter(Boolean).join(" ")}>
      <div className="wrap">
        {backHref && (
          <Link href={backHref} className="page-back-link reveal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {backLabel}
          </Link>
        )}
        <p className="eyebrow reveal">{eyebrow}</p>
        <RevealHeading as="h1" text={heading} className="page-hero-heading" />
        {subhead && <p className="hero-sub reveal">{subhead}</p>}
      </div>
    </section>
  );
}
