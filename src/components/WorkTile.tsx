import { seededImage, type WorkItem } from "../data/site";

interface Props {
  slug: string; // the WorkItem's own slug -- keys the photo, since a client can have multiple entries
  category: WorkItem["category"]; // picks the /work section subfolder the photo lives in
  title: string;
  client: string;
  tint: string;
  onClick: () => void;
}

// Static grid card for the /work page's 3-column category grids. No hover
// transforms of any kind -- interaction is click-only, per spec. No
// services line either -- each card already sits under its section
// heading (Social Media Marketing / Branding / Web + App Development),
// so re-listing the service(s) here was just repeating that context.
export default function WorkTile({ slug, category, title, client, tint, onClick }: Props) {
  return (
    <article
      className="work-tile"
      style={{ "--tint": tint } as React.CSSProperties}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="work-tile-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={seededImage(slug, category)} alt={`${title} — ${client}`} loading="lazy" />
      </div>
      <div className="work-tile-info">
        <h3>{title}</h3>
        <p className="work-tile-client">{client}</p>
      </div>
    </article>
  );
}
