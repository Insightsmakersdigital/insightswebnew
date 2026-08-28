import Link from "next/link";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import SectionHead from "../components/SectionHead";
import RevealHeading from "../components/RevealHeading";
import WorkCard from "../components/WorkCard";
import FaqAccordion from "../components/FaqAccordion";
import Testimonial from "../components/Testimonial";
import ServiceWheelSection from "../components/ServiceWheelSection";
import CardSwap, { Card } from "../components/CardSwap";
import SplitLineHeading from "../components/SplitLineHeading";
import ContactForm from "../components/ContactForm";
import AnimatedTooltip from "../components/AnimatedTooltip";
import { SITE_SHORT, WORK_ITEMS, SERVICES, CONTACT, FOUNDERS, PROCESS, ROSTER } from "../data/site";

export const metadata: Metadata = {
  title: "Design, Branding & Marketing Studio",
};

const logoTrack = [...WORK_ITEMS, ...WORK_ITEMS];

const featuredWork = WORK_ITEMS.slice(0, 3).map((w) => ({
  title: w.project,
  client: w.name,
  services: w.services.map((slug) => SERVICES.find((s) => s.slug === slug)?.title).filter(Boolean).join(" + "),
  result: w.result,
  tint: w.tint,
}));

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

const ROSTER_SHOWN = 6;
const avatarItems = ROSTER.slice(0, ROSTER_SHOWN).map((seat, i) => ({
  id: i,
  name: seat.filled && seat.name ? seat.name : "Open seat",
  designation: seat.role ?? "Role announced soon",
  initials: seat.filled && seat.name ? initials(seat.name) : undefined,
  open: !seat.filled,
}));
const rosterRemaining = ROSTER.length - ROSTER_SHOWN;

const teamStats = [
  { label: "Studio founded", value: "2024" },
  { label: "Founders, no managers", value: "2" },
  { label: "Core disciplines", value: String(SERVICES.length) },
];

const testimonials = [
  {
    name: "Rahul Menon",
    company: "Arena Animation",
    rating: 5,
    quote: "“They asked better questions than any consultant we've used.”",
    metaOrder: "person-first" as const,
  },
  {
    name: "Sarah Thomas",
    company: "Beyond Borders",
    rating: 5,
    quote: "“Fast, structured, and refreshingly honest.”",
    metaOrder: "rating-first" as const,
  },
  {
    name: "Vishnu Nair",
    company: "Zica Calicut",
    rating: 4.5,
    quote: "“The kind of studio that treats your brand like it's their own.”",
    metaOrder: "person-first" as const,
  },
];
const avgRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1);

const faqItems = [
  {
    question: "What's your process?",
    answer:
      "Four steps, every time: we listen to understand real goals, plan the strategy before any design work starts, build identity, web platforms and campaigns with precision, and measure results transparently, then keep optimizing.",
  },
  {
    question: "Do I get a dedicated account manager?",
    answer:
      "No. You work directly with the founders and the specialists on your project, with no layers in between.",
  },
  {
    question: "What's covered across your three pillars?",
    answer:
      `Marketing (social, SEO, SEM, content), Branding (identity, packaging, graphic design), and Build (websites, apps, automations, custom software, video production): ${SERVICES.length} disciplines that move together instead of as separate vendors.`,
  },
  {
    question: "Which industries do you work with?",
    answer:
      "Education, hospitality, events, adventure and travel brands among others. If the goal is a sharper identity and measurable growth, the playbook transfers.",
  },
];

export default function HomePage() {
  return (
    // .home-page scopes the decorative column-guide grid lines (see
    // globals.css's "page column grid" rule) to this page only.
    <div className="home-page">
      <Header />

      <main id="main">
        <Hero
          brand={SITE_SHORT}
          primaryCta={{ label: "Start your project", href: "/contact" }}
          secondaryCta={{ label: "Book a free strategy call", href: "/contact" }}
          stats={[
            { value: "12+", label: "brands partnered" },
            { value: "9", label: "specialized disciplines" },
            { value: "3", label: "core pillars" },
          ]}
        />

        <ServiceWheelSection services={SERVICES} />

        <section className="work panel-light" id="work">
          <div className="wrap">
            <SectionHead index="01" eyebrow="Selected work" heading="Projects" />
            <div className="work-grid">
              {featuredWork.map((item) => (
                <WorkCard key={item.title} {...item} />
              ))}
            </div>
            <Link href="/work" className="text-link reveal">
              View all projects <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="case-study">
          <div className="wrap case-grid">
            <div className="case-copy reveal">
              <div className="eyebrow-row">
                <span className="section-index">02</span>
                <p className="eyebrow">Case study</p>
              </div>
              <RevealHeading as="h2" className="case-heading" text="How Arena Animation filled three campuses" />
              <p className="case-body">
                Arena Animation had strong instructors but a brand that undersold them: generic collateral, no
                consistent identity across branches. We rebuilt the brand and digital presence around one goal: make
                enquiry-to-enrolment as short as possible.
              </p>
              <blockquote className="case-quote">
                &quot;They didn&apos;t just redesign our logo — they rebuilt how every campus presents itself, online and
                off.&quot;
                <cite>— Arena Animation</cite>
              </blockquote>
            </div>
            <div className="case-right reveal">
              <div className="case-visual">
                <span className="case-visual-label">Image placeholder: Arena Animation</span>
              </div>
              <ul className="case-results">
                <li className="case-result-row">
                  <span className="case-result-label">campuses rebranded</span>
                  <span className="case-result-value">
                    <strong data-count="3" className="counted">
                      0
                    </strong>
                  </span>
                </li>
                <li className="case-result-row">
                  <span className="case-result-label">more enquiries</span>
                  <span className="case-result-value">
                    <strong data-count="60" className="counted">
                      0
                    </strong>
                    <span className="stat-suffix">%</span>
                  </span>
                </li>
                <li className="case-result-row">
                  <span className="case-result-label">months to launch</span>
                  <span className="case-result-value">
                    <strong data-count="4" className="counted">
                      0
                    </strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="panel-light" id="process">
          <div className="wrap process-wrap">
            <div className="process-intro reveal">
              <div className="eyebrow-row">
                <span className="section-index">03</span>
                <p className="eyebrow">How we work</p>
              </div>
              <RevealHeading as="h2" text="Four steps, every time." />
              <p className="process-lead">
                Every project moves through the same four stages, in order, so nothing gets skipped and nothing
                gets guessed.
              </p>
            </div>

            <div className="process-stage reveal">
              <CardSwap width={340} height={240} cardDistance={45} verticalDistance={40} skewAmount={4} delay={2800} pauseOnHover={false}>
                {PROCESS.map((p, i) => (
                  <Card key={p.step}>
                    <div className="card-top">
                      <span className="card-tag">Step</span>
                      <span className="card-num">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="card-bottom">
                      <h3>{p.step}</h3>
                      <p>{p.body}</p>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </section>

        <section className="team panel-light">
          <div className="wrap">
            <div className="team-ledger">
              <div className="team-left reveal">
                <div className="eyebrow-row">
                  <span className="section-index">04</span>
                  <p className="eyebrow">The studio</p>
                </div>
                <h2 className="team-heading">
                  <span className="tone-dark">You work with us.</span> <span className="tone-dim">Not an account manager.</span>
                </h2>

                <div className="team-avatars">
                  <AnimatedTooltip items={avatarItems} />
                  {rosterRemaining > 0 && <span className="avatar-tooltip-circle avatar-tooltip-pill">+{rosterRemaining}</span>}
                </div>

                <div className="team-pairs">
                  <p>
                    <strong>Team:</strong> <span>2 founders + specialists</span>
                  </p>
                  <p>
                    <strong>Skills:</strong> <span>{SERVICES.length} disciplines</span>
                  </p>
                </div>

                <p className="team-body">
                  Insights Marketers is led directly by its founders, {FOUNDERS[0].name} and {FOUNDERS[1].name}, with no
                  layers, no hand-offs, between you and the people doing the work.
                </p>
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
            </div>
          </div>
        </section>

        <section className="testimonials-section panel-light">
          <div className="wrap">
            <div className="testimonial-fullbleed">
              {testimonials.map((t) => (
                <Testimonial key={t.name} {...t} />
              ))}

              <div className="testimonial-heading-col">
                <div className="eyebrow-row">
                  <span className="section-index">05</span>
                  <p className="eyebrow">Client feedback</p>
                </div>
                <RevealHeading as="h2" text="Why Brands Choose To Work With Us" className="testimonial-heading" />
                <p className="testimonial-subline">
                  <span className="dim">Real feedback,</span>
                  <span>from real clients.</span>
                </p>
                <div className="testimonial-trust reveal">
                  <div className="trust-avatar-stack" aria-hidden="true">
                    <span className="trust-avatar" style={{ "--tint": "262 90% 62%" } as React.CSSProperties}></span>
                    <span className="trust-avatar" style={{ "--tint": "158 64% 45%" } as React.CSSProperties}></span>
                    <span className="trust-avatar" style={{ "--tint": "28 92% 58%" } as React.CSSProperties}></span>
                    <span className="trust-avatar trust-avatar-pill">12+</span>
                  </div>
                  <div className="trust-copy">
                    <p className="trust-label">Trusted by clients</p>
                    <p className="trust-rating">
                      <span aria-hidden="true">★★★★★</span> {avgRating} / 5
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-social panel-light" id="faq">
          <div className="wrap">
            <div className="faq-social-box">
              <div className="faq-editorial reveal">
                <p className="faq-statement">
                  <span className="tone-dark">We partner with ambitious brands across</span>{" "}
                  <span className="tone-dim">education, hospitality, events, adventure and travel.</span>
                </p>
                <h2 className="faq-social-heading">
                  Good questions,
                  <br />
                  straight answers.
                </h2>
              </div>

              <div className="faq-functional">
                <div className="faq-marquee-row reveal" aria-hidden="true">
                  <div className="faq-marquee-track">
                    {logoTrack.map((c, i) => (
                      <span key={i}>{c.name}</span>
                    ))}
                  </div>
                </div>

                <div className="faq-pill-row reveal">
                  <Link href="/work" className="faq-pill faq-pill-ghost">
                    View our work <span aria-hidden="true">→</span>
                  </Link>
                  <Link href="/contact" className="faq-pill faq-pill-solid">
                    Book a call <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <FaqAccordion items={faqItems} />
              </div>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="wrap">
            <div className="contact-ledger" data-contact>
              <div className="contact-left reveal">
                <div className="eyebrow-row">
                  <span className="section-index">07</span>
                  <p className="eyebrow">Get in touch</p>
                </div>
                <SplitLineHeading text="CONTACT THE STUDIO" className="contact-heading" />
                <p className="contact-body">Send a note below. A strategist replies within one business day.</p>
                <div className="contact-tier">
                  <span className="contact-tier-label">(Mail)</span>
                  <a href={`mailto:${CONTACT.email}`} className="contact-email">
                    {CONTACT.email}
                  </a>
                </div>
                <div className="contact-tier">
                  <span className="contact-tier-label">(Phone)</span>
                  <a href={`tel:${CONTACT.phones[0].replace(/\s/g, "")}`} className="contact-phone">
                    {CONTACT.phones[0]}
                  </a>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
