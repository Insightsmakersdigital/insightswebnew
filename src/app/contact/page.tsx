import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import ContactForm from "../../components/ContactForm";
import { CONTACT } from "../../data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Message Insights Marketers on WhatsApp, phone, or email. A strategist replies within one business day.",
};

export default function ContactPage() {
  return (
    <>
      <Header />

      <main id="main">
        <PageHero
          eyebrow="Get in touch"
          heading="Tell us about the project."
          subhead="Message us on WhatsApp, call, or send a note below. A strategist replies within one business day."
          light={false}
        />

        <section className="contact">
          <div className="wrap">
            <div className="contact-ledger" data-contact>
              <div className="contact-left reveal">
                <div className="eyebrow-row">
                  <p className="eyebrow">Reach us directly</p>
                </div>
                <p className="contact-body" style={{ marginTop: "var(--space-5)" }}>
                  No ticketing system, no call queue. You reach a founder directly.
                </p>

                <div className="contact-tier">
                  <span className="contact-tier-label">(Mail)</span>
                  <a href={`mailto:${CONTACT.email}`} className="contact-email">
                    {CONTACT.email}
                  </a>
                </div>

                <div className="contact-tier">
                  <span className="contact-tier-label">(Phone)</span>
                  <div className="contact-phone-list">
                    {CONTACT.phones.map((phone) => (
                      <a href={`tel:${phone.replace(/\s/g, "")}`} className="contact-phone" key={phone}>
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="contact-tier">
                  <span className="contact-tier-label">(Chat)</span>
                  <a href={CONTACT.whatsapp} target="_blank" rel="noopener" className="contact-phone">
                    Message us on WhatsApp →
                  </a>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
