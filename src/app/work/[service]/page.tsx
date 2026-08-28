import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import PageHero from "../../../components/PageHero";
import WorkCard from "../../../components/WorkCard";
import { SERVICES, workForService } from "../../../data/site";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service: slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `Work — ${service.title}`,
    description: `Insights Marketers ${service.title.toLowerCase()} work.`,
  };
}

export default async function WorkByServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const items = workForService(service.slug).map((w) => ({
    title: w.project,
    client: w.name,
    services: w.services.map((s) => SERVICES.find((sv) => sv.slug === s)?.title).filter(Boolean).join(" + "),
    result: w.result,
    tint: w.tint,
  }));

  return (
    <>
      <Header />

      <main id="main">
        <PageHero eyebrow="Selected work" heading={service.title} light={false} />

        <section>
          <div className="wrap">
            <nav className="category-filters" aria-label="Filter by discipline">
              <Link href="/work">All work</Link>
              {SERVICES.map((s) => (
                <Link href={`/work/${s.slug}`} className={s.slug === service.slug ? "active" : ""} key={s.slug}>
                  {s.title}
                </Link>
              ))}
            </nav>
            {items.length > 0 ? (
              <div className="work-grid">
                {items.map((item) => (
                  <WorkCard key={item.title} {...item} />
                ))}
              </div>
            ) : (
              <div className="service-empty reveal">
                <p className="case-body">
                  No case study for {service.title.toLowerCase()} yet.{" "}
                  <Link href="/contact" className="text-link">
                    Get in touch
                  </Link>{" "}
                  to be the first.
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-link"
                  style={{ marginTop: "var(--space-6)", display: "inline-flex" }}
                >
                  What&apos;s included in {service.title} <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
