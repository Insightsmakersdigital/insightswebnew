import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { SITE_NAME, CONTACT } from "../../data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false, follow: false },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main id="main">
        <PageHero eyebrow="Legal" heading="Privacy Policy" light={false} />

        <section>
          <div className="wrap">
            <div className="legal-content reveal">
              <p>
                At {SITE_NAME}, one of our main priorities is the privacy of our visitors. This Privacy Policy
                document contains the types of information that we collect and record, and how we use it.
              </p>
              <p>If you have additional questions or require more information about this policy, do not hesitate to contact us.</p>
              <p>
                This Privacy Policy applies only to our online activities and is valid for visitors to our website
                with regards to the information they share and/or that we collect on this site. It does not apply to
                any information collected offline or via channels other than this website.
              </p>

              <h2>Consent</h2>
              <p>By using our website, you hereby consent to this Privacy Policy and agree to its terms.</p>

              <h2>Information we collect</h2>
              <p>
                If you contact us directly, through this website, WhatsApp, phone, or email, we collect the
                information you provide: your name, email address, phone number, the contents of your message, and
                any other details you choose to share with us — including project details, once you become a client.
              </p>

              <h2>How we use your information</h2>
              <p>We use the information we collect in the following ways:</p>
              <ul>
                <li>To respond to your enquiry and discuss your project</li>
                <li>To provide, operate, and improve our website</li>
                <li>To understand how visitors use our website</li>
                <li>To deliver the work, if you become a client</li>
                <li>To find and prevent fraud</li>
              </ul>
              <p>We do not sell or share your information with third parties for marketing purposes.</p>

              <h2>Data retention</h2>
              <p>
                We retain enquiry and client information only for as long as needed to provide our services and meet
                legal obligations. You can request deletion of your information at any time.
              </p>

              <h2>Log files</h2>
              <p>
                Like most websites, our hosting provider automatically logs standard visitor information: IP
                address, browser type, internet service provider, date and time stamp, and referring/exit pages.
                This is not linked to anything personally identifiable, and is used only to analyze trends,
                administer the site, and gather general usage information.
              </p>

              <h2>CCPA privacy rights (Do Not Sell My Personal Information)</h2>
              <p>Under the CCPA, among other rights, California consumers have the right to:</p>
              <p>
                Request that a business that collects a consumer&apos;s personal data disclose the categories and
                specific pieces of personal data that a business has collected about consumers.
              </p>
              <p>Request that a business delete any personal data about the consumer that a business has collected.</p>
              <p>
                Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s
                personal data.
              </p>
              <p>
                If you make a request, we have one month to respond to you. If you would like to exercise any of
                these rights, please contact us.
              </p>

              <h2>GDPR data protection rights</h2>
              <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
              <p>
                <strong>The right to access</strong> — You have the right to request copies of your personal data. We
                may charge you a small fee for this service.
              </p>
              <p>
                <strong>The right to rectification</strong> — You have the right to request that we correct any
                information you believe is inaccurate, or complete information you believe is incomplete.
              </p>
              <p>
                <strong>The right to erasure</strong> — You have the right to request that we erase your personal
                data, under certain conditions.
              </p>
              <p>
                <strong>The right to restrict processing</strong> — You have the right to request that we restrict
                the processing of your personal data, under certain conditions.
              </p>
              <p>
                <strong>The right to object to processing</strong> — You have the right to object to our processing
                of your personal data, under certain conditions.
              </p>
              <p>
                <strong>The right to data portability</strong> — You have the right to request that we transfer the
                data we have collected to another organization, or directly to you, under certain conditions.
              </p>
              <p>
                If you make a request, we have one month to respond to you. If you would like to exercise any of
                these rights, please contact us.
              </p>

              <h2>Children&apos;s information</h2>
              <p>
                Another part of our priority is adding protection for children while using the internet. We
                encourage parents and guardians to observe, participate in, and/or monitor and guide their online
                activity.
              </p>
              <p>
                {SITE_NAME} does not knowingly collect any personally identifiable information from children under
                the age of 13. If you believe your child provided this kind of information on our website, please
                contact us immediately and we will do our best to promptly remove it from our records.
              </p>

              <h2>Contact</h2>
              <p>
                Questions about this policy can be sent to{" "}
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
