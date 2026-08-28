import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Journal",
  description: "Insights from the Insights Marketers team, coming soon.",
};

export default function BlogsPage() {
  return (
    <>
      <Header />

      <main id="main">
        <section className="panel-light">
          <div className="wrap">
            <div className="coming-soon reveal">
              <p className="eyebrow">Journal</p>
              <h1 className="page-hero-heading">Insights.</h1>
              <p className="hero-sub">Notes on branding, marketing, and building, coming soon.</p>
              <Link href="/contact" className="btn btn-primary btn-lg magnetic" style={{ marginTop: "var(--space-4)" }}>
                <span>Get in touch instead</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
