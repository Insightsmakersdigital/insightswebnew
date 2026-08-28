import { seededImage } from "../data/site";

interface Props {
  title: string; // the project -- what was done, leads the card
  client: string; // who it was for -- byline, not headline
  services: string; // joined service titles, e.g. "Branding + Website Development"
  result: string; // the outcome
  tint: string;
}

export default function WorkCard({ title, client, services, result, tint }: Props) {
  return (
    <article className="work-card reveal" style={{ "--tint": tint } as React.CSSProperties}>
      <div className="work-col-name">
        <div className="work-name-block">
          <h3>{title}</h3>
          <p>{client}</p>
        </div>
        <p className="work-jump">Jump to project</p>
      </div>

      <div className="work-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="work-media-fill" src={seededImage(client)} alt={`${title} — ${client}`} loading="lazy" />
      </div>

      <div className="work-col-detail">
        <span className="work-arrow" aria-hidden="true">
          ↗
        </span>
        <div className="work-meta">
          <div className="work-meta-pair">
            <span className="work-meta-label">Result</span>
            <span className="work-meta-value">{result}</span>
          </div>
          <div className="work-meta-pair">
            <span className="work-meta-label">Discipline</span>
            <span className="work-meta-value">{services}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
