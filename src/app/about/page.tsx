import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import RevealHeading from "../../components/RevealHeading";
import PillarAccordion from "../../components/PillarAccordion";
import { PILLARS, PILLAR_HEADLINES, SERVICES, servicesByPillar } from "../../data/site";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "A Kerala-based studio running marketing, branding, and web development as one system, not three separate vendors.",
};

const introStats = [
  { value: "2024", label: "founded, Kerala-based" },
  { value: "3", label: "disciplines under one roof" },
  { value: String(SERVICES.length), label: "specialties across them" },
];

const pillarAccordionEntries = PILLARS.map((pillar) => ({
  pillar,
  headline: PILLAR_HEADLINES[pillar],
  list: servicesByPillar(pillar),
}));

const reasons = [
  {
    title: "Direct access",
    text: "You talk to the person doing the work, not an account manager relaying your notes to someone else. Every call, review, and report happens with them directly.",
  },
  {
    title: "One system, not three vendors",
    text: "Marketing, branding, and build run under the same roof, planned together from the start. Nothing gets handed off between agencies that have never spoken to each other.",
  },
  {
    title: "Proof you can check",
    text: "Every case study on this site is real, and every gap is named plainly. If a discipline doesn't have one yet, the site says so instead of hiding it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main id="main">
        <PageHero eyebrow="About the studio" heading="You work with us. Not an account manager." />

        <section className="intro">
          <div className="wrap">
            <div className="eyebrow-row reveal">
              <span className="section-index">01</span>
              <p className="eyebrow">Who we are</p>
            </div>
            <p className="intro-lead reveal">
              Insights Marketers is a Kerala-based digital marketing, branding, and web development studio, founded
              in 2024. Marketing, branding, and build sit under one roof here, planned and delivered by the same
              team from the first call to the last file handed over.
            </p>

            <div className="intro-metrics">
              {introStats.map((stat) => (
                <div className="metric reveal" key={stat.label}>
                  <p className="metric-num">{stat.value}</p>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="process panel-light">
          <div className="wrap">
            <div className="eyebrow-row">
              <span className="section-index">02</span>
              <p className="eyebrow">What we do</p>
            </div>
            <RevealHeading as="h2" text="Three disciplines, run as one." />
            <PillarAccordion entries={pillarAccordionEntries} />
          </div>
        </section>

        <section>
          <div className="wrap">
            <div className="eyebrow-row">
              <span className="section-index">03</span>
              <p className="eyebrow">Why choose us</p>
            </div>
            <RevealHeading as="h2" text="Three reasons, no filler." />
            <div>
              {reasons.map((reason, i) => (
                <div className={`${styles.reasonRow} reveal`} key={reason.title}>
                  <span className={styles.reasonNum}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className={styles.reasonTitle}>{reason.title}</h3>
                    <p className={styles.reasonText}>{reason.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.mvSection}`}>
          <div className="wrap">
            <div className="eyebrow-row">
              <span className="section-index">04</span>
              <p className="eyebrow">Mission &amp; vision</p>
            </div>

            <div className={styles.mvGrid}>
              <div className={`${styles.mvBlock} reveal`}>
                <p className={styles.mvLabel}>Mission</p>
                <h3 className={styles.mvHeading}>What we&apos;re here to do</h3>
                <p className={styles.mvText}>
                  Turn a business&apos;s marketing, branding, and digital presence into one connected system, planned
                  and built by the same team, instead of three disconnected vendors that never compare notes.
                </p>
              </div>

              <div className={`${styles.mvDivider} reveal`} aria-hidden="true"></div>

              <div className={`${styles.mvBlock} reveal`}>
                <p className={styles.mvLabel}>Vision</p>
                <h3 className={styles.mvHeading}>Where we&apos;re headed</h3>
                <p className={styles.mvText}>
                  We want to be the studio Kerala businesses call first when they need marketing, branding, or a
                  website, not for our size, but because working directly with the people doing the work is a
                  better way to grow.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
