import RevealHeading from "./RevealHeading";

interface Props {
  eyebrow: string;
  heading: string;
  subhead?: string;
  light?: boolean;
}

export default function PageHero({ eyebrow, heading, subhead, light = true }: Props) {
  return (
    <section className={["page-hero", light && "panel-light"].filter(Boolean).join(" ")}>
      <div className="wrap">
        <p className="eyebrow reveal">{eyebrow}</p>
        <RevealHeading as="h1" text={heading} className="page-hero-heading" />
        {subhead && <p className="hero-sub reveal">{subhead}</p>}
      </div>
    </section>
  );
}
