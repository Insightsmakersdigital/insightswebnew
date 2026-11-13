import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RevealHeading from "../../components/RevealHeading";
import InfiniteMenu from "../../components/InfiniteMenu";
import TeamHero from "../../components/TeamHero";
import StatsCascade from "../../components/StatsCascade";
import { FOUNDERS, ROSTER } from "../../data/site";
import styles from "./team.module.css";

export const metadata: Metadata = {
  title: "Team",
  description: "The people at Insights Marketers: founders and specialists you work with directly, no account manager in between.",
};

const teamStats = [
  { label: "Studio founded", value: "2024", emoji: "🥳", from: 2000 },
  { label: "Projects done", value: "50+", emoji: "🏆" },
  { label: "Services", value: "12", emoji: "🧰" },
];

// Photo seeds are presentation-only, so they stay local here rather than
// living in the shared ROSTER data (see data/site.ts) -- one seed per seat,
// in the same order.
const PHOTO_SEEDS = [
  "wall-nived", "wall-nuhman", "wall-seat-04", "wall-seat-05", "wall-seat-06",
  "wall-seat-07", "wall-seat-08", "wall-seat-09", "wall-seat-10", "wall-seat-11", "wall-seat-12", "wall-seat-13",
];
// Real team photos in public/images/team/, one per seat index (the file name
// doubles as the display name). Seats 0-1 are the founders (names/roles come
// from ROSTER).
const TEAM_PHOTOS: Record<number, { photo: string; name?: string; role?: string }> = {
  0: { photo: "/images/team/nived.png" },
  1: { photo: "/images/team/nuhman.png" },
  2: { photo: "/images/team/lisni.png", name: "Lisni", role: "Video Presenter" },
  3: { photo: "/images/team/jibin.png", name: "Jibin", role: "Video Editor" },
  4: { photo: "/images/team/athul%20krishna.png", name: "Athul Krishna", role: "Tech Lead" },
  5: { photo: "/images/team/anupama.png", name: "Anupama", role: "Project Manager" },
  6: { photo: "/images/team/shafaf.png", name: "Shafaf", role: "Graphic Designer" },
  7: { photo: "/images/team/sethu.png", name: "Sethu", role: "Operation Manager" },
  8: { photo: "/images/team/ziya.png", name: "Ziya", role: "Content Writer" },
  9: { photo: "/images/team/athul.png", name: "Athul MR", role: "Creative Director" },
  10: { photo: "/images/team/anand.png", name: "Anand", role: "Business Development Head" },
};
const roster = ROSTER.map((seat, i) => {
  const t = TEAM_PHOTOS[i];
  return {
    ...seat,
    // A seat with a name here is a real hire: it overrides the ROSTER entry.
    ...(t?.name ? { name: t.name, role: t.role ?? seat.role, filled: true } : {}),
    photo: t?.photo ?? `https://picsum.photos/seed/${PHOTO_SEEDS[i]}/600/600?grayscale`,
  };
});

// The Roster Wall -- a draggable photo sphere (InfiniteMenu, from React
// Bits), per direct founder feedback that the roster read as "text, not a
// team." Every seat -- filled or still open -- carries its own seeded
// picsum placeholder run through picsum's own `grayscale` param to match
// the site's monochrome palette. Swap `photo` for real headshots once
// people exist.
// One line per seat, in ROSTER order, written to match each person's role.
const funLines = [
  "Sets the direction and answers for the result.", // Nived, CEO
  "Turns your story into a plan the market notices.", // Nuhman, CMO
  "The face and voice that put your brand on camera.", // Lisni, Video Presenter
  "Cuts raw footage into videos people watch to the end.", // Jibin, Video Editor
  "Builds the site and keeps it fast, secure and live.", // Athul Krishna, Tech Lead
  "Keeps every project on schedule and everyone in the loop.", // Anupama, Project Manager
  "Designs the visuals that make your brand look sharp.", // Shafaf, Graphic Designer
  "Runs the day-to-day so every delivery lands on time.", // Sethu, Operation Manager
  "Writes the words that make your audience act.", // Ziya, Content Writer
  "Shapes the big idea and the look behind every campaign.", // Athul MR, Creative Director
  "Finds new clients and grows partnerships for the studio.", // Anand, Business Development Head
];
let openSeatCount = 0;
const menuItems = roster.map((r, i) => ({
  image: r.photo,
  link: r.filled ? "/contact" : "",
  title: r.filled ? r.name! : `Name ${++openSeatCount}`,
  role: r.role ?? "Not confirmed yet",
  description: funLines[i],
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
                  <span className="founder-avatar founder-avatar--photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={founder.photo} alt={founder.name} />
                  </span>
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
            <StatsCascade stats={teamStats} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
