import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import ServiceHoverList from "../../components/ServiceHoverList";
import { SERVICES } from "../../data/site";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services",
  description: `${SERVICES.length} disciplines, no boxes to sort through.`,
};

// Real photography, one file per service slug, dropped in at
// public/images/services/{slug}.jpg (3:4 portrait, matches the hover
// preview's aspect-ratio in services.module.css).
const rows = SERVICES.map((service, i) => ({
  service,
  number: String(i + 1).padStart(2, "0"),
  image: `/images/services/${service.slug}.jpg`,
}));

export default function ServicesPage() {
  return (
    <>
      <Header />

      <main id="main" className={styles.pageCompact}>
        <PageHero eyebrow="What we do" heading="Everything we do. One list." subhead={`${SERVICES.length} disciplines, in one place.`} light={false} />

        <section>
          <div className="wrap">
            <ServiceHoverList rows={rows} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
