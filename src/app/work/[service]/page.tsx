import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import RevealHeading from "../../../components/RevealHeading";
import WorkGrid from "../../../components/WorkGrid";
import DriftWall from "../../../components/DriftWall";
import { WORK_ITEMS, WORK_CATEGORIES, seededImage } from "../../../data/site";

export function generateStaticParams() {
  return WORK_CATEGORIES.map((category) => ({ service: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  const category = WORK_CATEGORIES.find((c) => c.slug === service);
  if (!category) return {};
  return {
    title: category.label,
    description: `Real ${category.label.toLowerCase()} case studies, from real client engagements.`,
  };
}

export default async function WorkServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const category = WORK_CATEGORIES.find((c) => c.slug === service);
  if (!category) notFound();

  const items = WORK_ITEMS.filter((w) => w.category === category.slug);
  const driftItems = items.map((w) => ({
    image: seededImage(w.slug, w.category),
    fallbackImage: w.gallery?.[0],
    title: w.project,
  }));

  const workSections = [
    {
      index: category.index,
      heading: category.label,
      items,
      pendingNote: items.length === 0 ? "More on the way" : undefined,
    },
  ];

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
              <Link href="/work" className="page-back-link reveal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Work
              </Link>
              <p className="eyebrow reveal">Case studies</p>
              <RevealHeading as="h1" text={category.label} className="work-hero-heading" />
            </div>
            <p className="work-hero-sub reveal">Real case studies from this discipline. Click any of them for the full story.</p>
          </div>
        </section>

        <WorkGrid sections={workSections} />
      </main>

      <Footer />
    </>
  );
}
