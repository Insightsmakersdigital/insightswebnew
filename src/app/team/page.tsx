import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RevealHeading from "../../components/RevealHeading";
import InfiniteMenu from "../../components/InfiniteMenu";
import TeamHero from "../../components/TeamHero";
import { FOUNDERS, ROSTER } from "../../data/site";
import styles from "./team.module.css";

export const metadata: Metadata = {
  title: "Team",
  description: "The people at Insights Marketers: founders and specialists you work with directly, no account manager in between.",
};

const teamStats = [
  { label: "Studio founded", value: "2024" },
  { label: "Founders, no managers", value: "2" },
  { label: "Core disciplines", value: "9" },
];

// Photo seeds are presentation-only, so they stay local here rather than
// living in the shared ROSTER data (see data/site.ts) -- one seed per seat,
// in the same order.
const PHOTO_SEEDS = [
  "wall-nived", "wall-nuhman", "wall-arjun", "wall-seat-04", "wall-seat-05", "wall-seat-06",
  "wall-seat-07", "wall-seat-08", "wall-seat-09", "wall-seat-10", "wall-seat-11", "wall-seat-12", "wall-seat-13",
];
const roster = ROSTER.map((seat, i) => ({
  ...seat,
  photo: `https://picsum.photos/seed/${PHOTO_SEEDS[i]}/600/600?grayscale`,
}));

// The Roster Wall -- a draggable photo sphere (InfiniteMenu, from React
// Bits), per direct founder feedback that the roster read as "text, not a
// team." Every seat -- filled or still open -- carries its own seeded
// picsum placeholder run through picsum's own `grayscale` param to match
// the site's monochrome palette. Swap `photo` for real headshots once
// people exist.
const funLines = [
  "Answers his own phone. Wild, right?",
  "Has opinions about your logo.",
  "Fixes it before you notice it broke.",
  "Still workshopping the pun in this bio.",
  "Sees a brand where you see a business card.",
  "Center it. No, the other way.",
  "Cuts on the beat, judges your playlist.",
  "Sends the friendly reminder. And the next one.",
  "Knows the algorithm's mood before you do.",
  "Turns \"maybe\" into a signed contract.",
  "Optimizes everything, including this bio.",
  "Replies faster than you can finish typing.",
  "Genuinely still being figured out.",
];
let openSeatCount = 0;
const menuItems = roster.map((r, i) => ({
  image: r.photo,
  link: r.filled ? "/contact" : "",
  title: r.filled ? r.name! : `Name ${++openSeatCount}`,
  role: r.role ?? "Not confirmed yet",
  description: funLines[i],
}));

// The Open Roster (section 03's dot ledger): reuses the site's existing
// "some of this is done, some is honestly not yet" mechanic (the coverage
// dots on /work) for people instead of case studies. Derived from `roster`
// above rather than kept as a second hardcoded list.
const rosterSeats = roster.map((seat) => ({
  filled: seat.filled,
  name: seat.filled ? seat.name! : seat.role ?? "Unnamed",
  sub: seat.filled ? seat.role! : seat.role ? "Role to be added" : "Not confirmed yet",
}));

export default function TeamPage() {
  return (
    <>
      <Header />

      <main id="main">
        <TeamHero />

        <section className="founders" id="founders">
          <div className="wrap">
            <div className="eyebrow-row">
              <span className="section-index">01</span>
              <p className="eyebrow">Leadership</p>
            </div>
            <RevealHeading as="h2" text="Founder-led, from the first call." />
            <div className="founder-grid">
              {FOUNDERS.map((founder) => (
                <div className="founder-card reveal" key={founder.name}>
                  <span className="founder-avatar" aria-hidden="true"></span>
                  <h3>{founder.name}</h3>
                  <p>{founder.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="roster-wall" id="roster-wall">
          <div className="wrap">
            <div className="eyebrow-row">
              <span className="section-index">02</span>
              <p className="eyebrow">The full roster</p>
            </div>
            <h2 className="sr-only">The full roster</h2>
            <div className={styles.wallStage}>
              <InfiniteMenu items={menuItems} scale={2.6} />
            </div>
          </div>
        </section>

        <section className="team panel-light">
          <div className="wrap">
            <div className="eyebrow-row">
              <span className="section-index">03</span>
              <p className="eyebrow">In numbers</p>
            </div>
            <div className="team-stats">
              {teamStats.map((stat, i) => (
                <div className="team-stat-row reveal" key={stat.label}>
                  <div className="team-stat-dots" aria-hidden="true">
                    {[0, 1, 2].map((d) => (
                      <span className={d === i ? "active" : ""} key={d}></span>
                    ))}
                  </div>
                  <p className="team-stat-label">{stat.label}</p>
                  <p className="team-stat-number">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="roster-ledger reveal">
              <p className="roster-ledger-label">
                {rosterSeats.filter((s) => s.filled).length} of {rosterSeats.length} seats named publicly
              </p>
              <ul className="roster-seats">
                {rosterSeats.map((seat, i) => (
                  <li className="roster-seat" key={i}>
                    <span className={["roster-dot", seat.filled && "is-filled"].filter(Boolean).join(" ")} aria-hidden="true"></span>
                    <span className="roster-seat-name">{seat.name}</span>
                    <span className="roster-seat-sub">{seat.sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
