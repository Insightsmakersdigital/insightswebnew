import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RevealHeading from "../../components/RevealHeading";
import WorkGrid from "../../components/WorkGrid";
import DriftWall from "../../components/DriftWall";
import { WORK_ITEMS, seededImage } from "../../data/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Real work, for real clients: a handful of case studies, not a gap-filled grid of empty categories.",
};

const driftItems = WORK_ITEMS.map((w) => ({
  image: seededImage(w.slug, w.category),
  title: w.project,
}));

// Only items explicitly placed in one of these 3 buckets (WorkItem.category)
// show on /work -- the rest of WORK_ITEMS stays in the data file, unlisted,
// until it's deliberately categorized.
const workSections = [
  { index: "01", heading: "Social Media Marketing", items: WORK_ITEMS.filter((w) => w.category === "smm") },
  { index: "02", heading: "Branding", items: WORK_ITEMS.filter((w) => w.category === "branding"), pendingNote: "More on the way" },
  { index: "03", heading: "Web + App Development", items: WORK_ITEMS.filter((w) => w.category === "web-app") },
].filter((section) => section.items.length > 0 || section.pendingNote);

export default function WorkPage() {
  return (
    <>
      <Header />

      <main id="main">
        <section className="work-hero">
          <div className="work-hero-wall">
            <DriftWall
              items={driftItems}
              columns={5}
              tileWidth={170}
              tileHeight={112}
              gap={14}
              tilt={16}
              turn={-14}
              perspective={1200}
              depth={120}
              speed={30}
              direction="up"
              variance={0.45}
              parallax={0.5}
              lift={48}
              fade={0.6}
              dim={0.5}
              overlayColor="#0f0f0f"
            />
          </div>
          <div className="work-hero-content wrap">
            <div className="work-hero-left">
              <p className="eyebrow reveal">Selected work</p>
              <RevealHeading as="h1" text="See the work, not the pitch." className="work-hero-heading" />
            </div>
            <p className="work-hero-sub reveal">A handful of real case studies. Click any of them for the full story.</p>
          </div>
        </section>

        <WorkGrid sections={workSections} />
      </main>

      <Footer />
    </>
  );
}
