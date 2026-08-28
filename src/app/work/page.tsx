import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RevealHeading from "../../components/RevealHeading";
import WorkCard from "../../components/WorkCard";
import DriftWall from "../../components/DriftWall";
import { PILLARS, SERVICES, servicesByPillar, workForService, WORK_ITEMS, seededImage } from "../../data/site";

export const metadata: Metadata = {
  title: "Work",
  description: "Real work, by discipline: where Insights Marketers has a track record, and where you'd be first.",
};

const pillarData = PILLARS.map((pillar) => {
  const services = servicesByPillar(pillar);
  const covered = services.filter((s) => workForService(s.slug).length > 0);

  const disciplines = services.map((service) => ({
    service,
    items: workForService(service.slug).map((w) => ({
      title: w.project,
      client: w.name,
      services: w.services.map((slug) => SERVICES.find((s) => s.slug === slug)?.title).filter(Boolean).join(" + "),
      result: w.result,
      tint: w.tint,
    })),
  }));

  return { pillar, services, covered, disciplines };
});

const driftItems = WORK_ITEMS.map((w) => ({
  image: seededImage(w.name),
  title: w.project,
  href: `/work/${w.services[0]}`,
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
            <p className="work-hero-sub reveal">
              A few disciplines already have case studies attached. The others don&apos;t have one yet.
            </p>
          </div>
        </section>

        <section>
          <div className="wrap">
            {pillarData.map(({ pillar, services, covered, disciplines }) => (
              <div className="pillar-block reveal" key={pillar}>
                <div className="pillar-head">
                  <h3>{pillar}</h3>
                  <div className="coverage" aria-label={`${covered.length} of ${services.length} disciplines have case studies`}>
                    <span className="coverage-dots" aria-hidden="true">
                      {services.map((s) => (
                        <span
                          className={["coverage-dot", workForService(s.slug).length > 0 && "is-filled"].filter(Boolean).join(" ")}
                          key={s.slug}
                        ></span>
                      ))}
                    </span>
                    <span className="coverage-label">
                      {covered.length}/{services.length} disciplines covered
                    </span>
                  </div>
                </div>

                {disciplines.map(({ service, items }) => (
                  <div className="discipline-block" key={service.slug}>
                    <div className="discipline-head">
                      <Link href={`/work/${service.slug}`} className="discipline-title">
                        {service.title}
                      </Link>
                      {items.length === 0 && <span className="discipline-open-tag">No case study yet</span>}
                    </div>

                    {items.length > 0 ? (
                      <div className="work-grid">
                        {items.map((item) => (
                          <WorkCard key={item.title} {...item} />
                        ))}
                      </div>
                    ) : (
                      <Link href="/contact" className="discipline-open-note">
                        <span>Open now, no {service.title.toLowerCase()} case study yet.</span>
                        <span aria-hidden="true">Start the first one →</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
