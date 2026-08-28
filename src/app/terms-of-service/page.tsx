import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { SITE_NAME, CONTACT } from "../../data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: { index: false, follow: false },
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />

      <main id="main">
        <PageHero eyebrow="Legal" heading="Terms of Service" light={false} />

        <section>
          <div className="wrap">
            <div className="legal-content reveal">
              <h2>Working with us</h2>
              <p>
                These terms apply when {SITE_NAME} is engaged to provide marketing, branding, or web development
                services. Specific scope, deliverables, and timelines for each project are agreed separately before
                work begins.
              </p>
              <h2>Payment</h2>
              <p>
                Project pricing, payment schedules, and revision rounds are confirmed in writing at the start of each
                engagement, with no separate line items or surprise invoices.
              </p>
              <h2>Intellectual property</h2>
              <p>
                Ownership of final deliverables transfers to the client upon full payment, unless otherwise agreed.
                Insights Marketers retains the right to display completed work in its own portfolio.
              </p>
              <h2>Contact</h2>
              <p>
                Questions about these terms can be sent to{" "}
                <a className="text-link" href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
