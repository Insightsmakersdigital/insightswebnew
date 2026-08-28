import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import PageHero from "../../../components/PageHero";
import SectionHead from "../../../components/SectionHead";
import RevealHeading from "../../../components/RevealHeading";
import FaqAccordion from "../../../components/FaqAccordion";
import StatValue from "../../../components/StatValue";
import IncludedSentence from "../../../components/IncludedSentence";
import ApproachTrack from "../../../components/ApproachTrack";
import { SERVICES, servicesByPillar } from "../../../data/site";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: service.title, description: service.description };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = servicesByPillar(service.pillar).filter((s) => s.slug !== service.slug);

  return (
    <>
      <Header />

      <main id="main">
        <PageHero eyebrow={`${service.pillar} pillar`} heading={service.title} subhead={service.headline} light={false} />

        <section className="intro panel-light">
          <div className="wrap">
            <p className="intro-lead reveal">{service.description}</p>
            <div className="intro-metrics">
              {service.quickFacts.map((fact) => (
                <div className="metric reveal" key={fact.label}>
                  <p className="metric-num">
                    <StatValue value={fact.value} suffix={fact.suffix} />
                  </p>
                  <p>{fact.label}</p>
                </div>
              ))}
            </div>
            <div className="hero-actions reveal" style={{ marginTop: "var(--space-10)" }}>
              <Link href="/contact" className="btn btn-primary btn-lg magnetic">
                <span>Start a project</span>
              </Link>
              <Link href="/services" className="btn btn-outline btn-lg">
                <span>All services</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="included-section" id="included">
          <div className="wrap">
            <SectionHead index="01" eyebrow="What's included" heading="Every angle, covered" />
            <IncludedSentence slug={service.slug} sentence={service.includedSentence} />
          </div>
        </section>

        <section className="case-study">
          <div className="wrap case-grid">
            <div className="case-copy reveal">
              <div className="eyebrow-row">
                <span className="section-index">02</span>
                <p className="eyebrow">{service.proof.eyebrow}</p>
              </div>
              <RevealHeading as="h2" className="case-heading" text={service.proof.heading} />
              <p className="case-body">{service.proof.body}</p>
              <blockquote className="case-quote">
                &quot;{service.proof.quote}&quot;
                {service.proof.quoteAttribution && <cite>— {service.proof.quoteAttribution}</cite>}
              </blockquote>
            </div>
            <div className="case-right reveal">
              <div className="case-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="case-visual-img" src={`/images/services-proof/${service.slug}.jpg`} alt={service.title} />
              </div>
              <ul className="case-results">
                {service.proof.stats.map((stat) => (
                  <li className="case-result-row" key={stat.label}>
                    <span className="case-result-label">{stat.label}</span>
                    <span className="case-result-value">
                      <StatValue value={stat.value} suffix={stat.suffix} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="approach-section" id="approach">
          <div className="wrap">
            <ApproachTrack steps={service.approach} />
          </div>
        </section>

        <section className="panel-light" id="faq">
          <div className="wrap">
            <SectionHead index="04" eyebrow="Questions" heading="Frequently asked" />
            <FaqAccordion items={service.faqs} />
          </div>
        </section>

        {related.length > 0 && (
          <section className="panel-light">
            <div className="wrap">
              <div className="eyebrow-row">
                <p className="eyebrow">Also in {service.pillar}</p>
              </div>
              <div className="service-list">
                {related.map((s) => (
                  <Link className="service-list-item" href={`/services/${s.slug}`} key={s.slug}>
                    <h4>{s.title}</h4>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="service-cta">
          <div className="wrap">
            <div className="eyebrow-row">
              <p className="eyebrow">Ready when you are</p>
            </div>
            <RevealHeading as="h2" className="service-cta-heading" text={`Let's talk about ${service.title.toLowerCase()}.`} />
            <div className="hero-actions reveal">
              <Link href="/contact" className="btn btn-invert btn-lg magnetic">
                <span>Start a project</span>
              </Link>
              <Link href="/contact" className="btn btn-outline btn-lg">
                <span>Book a free strategy call</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
