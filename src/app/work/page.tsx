import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RevealHeading from "../../components/RevealHeading";
import FlowingMenu from "../../components/FlowingMenu";
import DriftWall from "../../components/DriftWall";
import { WORK_ITEMS, WORK_CATEGORIES, seededImage } from "../../data/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Real work, for real clients, organized by discipline -- pick one to see the case studies.",
};

const driftItems = WORK_ITEMS.map((w) => ({
  image: seededImage(w.slug, w.category),
  fallbackImage: w.gallery?.[0],
  title: w.project,
}));

// Landing page is just the 4 discipline entry points (FlowingMenu), not
// every case study at once -- see /work/[service] for the actual grids.
// Each menu item's background is its own dedicated photo in
// public/images/work-menu/{category.slug}.jpg -- deliberately NOT reused
// from a WorkItem's own case-study photo, so this hover art can be picked
// independently (a wide establishing shot reads better here than a
// square case-study cover) and doesn't silently change if that WorkItem
// is edited or reordered later.
const menuItems = WORK_CATEGORIES.map((category) => ({
  link: `/work/${category.slug}`,
  text: category.label,
  image: `/images/work-menu/${category.slug}.jpg`,
}));

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
            <p className="work-hero-sub reveal">Pick a discipline. Every card behind it is a real, clickable case study.</p>
          </div>
        </section>

        <section className="work-menu-section">
          <FlowingMenu items={menuItems} bgColor="#0f0f0f" textColor="#ffffff" marqueeBgColor="#ffffff" marqueeTextColor="#0f0f0f" borderColor="rgb(255 255 255 / 18%)" />
        </section>
      </main>

      <Footer />
    </>
  );
}
