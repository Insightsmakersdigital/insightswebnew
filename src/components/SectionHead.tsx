import RevealHeading from "./RevealHeading";

interface Props {
  eyebrow: string;
  heading: string;
  index?: string;
}

export default function SectionHead({ eyebrow, heading, index }: Props) {
  return (
    <div className="section-head">
      <div className="section-head-meta reveal">
        {index && <span className="section-index">{index}</span>}
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <RevealHeading as="h2" text={heading} />
    </div>
  );
}
