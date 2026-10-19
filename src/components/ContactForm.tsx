"use client";

import { useEffect, useRef, useState } from "react";
import { SOCIAL_LINKS } from "../data/site";

// Web3Forms access key for info@insightsmarketers.com -- this is a public
// key by Web3Forms' own design (safe in client-side code; it only lets
// someone submit TO this inbox, not read from it), see web3forms.com/docs.
const WEB3FORMS_ACCESS_KEY = "f5543978-3e6a-486b-8d3a-69fea2f8023f";

// The contact form ledger, shared between the homepage's #contact section
// and the dedicated /contact page. Row hairlines arm once the form scrolls
// into view (IntersectionObserver, one-shot); submit posts straight to
// Web3Forms (static export has no backend of its own to receive it).
// variant="compact" (homepage) drops Email/Message for just Name + Number
// -- a lower-friction ask than the full form on the dedicated /contact page.
export default function ContactForm({ variant = "full" }: { variant?: "full" | "compact" }) {
  const compact = variant === "compact";
  const formRef = useRef<HTMLFormElement>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(form);
    return () => io.disconnect();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    data.append("access_key", WEB3FORMS_ACCESS_KEY);
    data.append("subject", `New ${compact ? "homepage" : "contact page"} enquiry from ${data.get("name")}`);
    data.append("from_name", "Insights Marketers website");

    setSubmitting(true);
    setStatus("Sending...");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setStatus("Thanks. We'll be in touch within one business day.");
        form.reset();
      } else {
        setStatus("Something went wrong. Please email or WhatsApp us directly.");
      }
    } catch {
      setStatus("Something went wrong. Please email or WhatsApp us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className={["contact-form-ledger reveal", visible && "is-visible"].filter(Boolean).join(" ")}
      id="contactForm"
      noValidate
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <div className="contact-field-wrap">
        <input className="contact-field" id="name" name="name" type="text" placeholder=" " autoComplete="name" required />
        <label className="contact-field-label" htmlFor="name">
          Name*
        </label>
      </div>
      {compact ? (
        <>
          <div className="contact-field-wrap">
            <input className="contact-field" id="phone" name="phone" type="tel" placeholder=" " autoComplete="tel" required />
            <label className="contact-field-label" htmlFor="phone">
              Number*
            </label>
          </div>
          <div className="contact-field-wrap contact-field-wrap-message-small">
            <textarea className="contact-field contact-field-message" id="message-compact" name="message" placeholder=" "></textarea>
            <label className="contact-field-label contact-field-label-message" htmlFor="message-compact">
              Message (optional)
            </label>
          </div>
        </>
      ) : (
        <>
          <div className="contact-field-wrap">
            <input className="contact-field" id="email" name="email" type="email" placeholder=" " autoComplete="email" required />
            <label className="contact-field-label" htmlFor="email">
              Email*
            </label>
          </div>
          <div className="contact-field-wrap contact-field-wrap-message">
            <textarea className="contact-field contact-field-message" id="message" name="message" placeholder=" " required></textarea>
            <label className="contact-field-label contact-field-label-message" htmlFor="message">
              Message*
            </label>
          </div>
        </>
      )}
      <input type="checkbox" name="botcheck" className="contact-field-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="contact-submit-row">
        <button type="submit" className="contact-submit magnetic" disabled={submitting}>
          <span>{submitting ? "Sending..." : "Send message"}</span>
        </button>
      </div>
      <div className="contact-status-block">
        <p className="contact-status-reply">Replies within one business day</p>
        <div className="contact-socials">
          {SOCIAL_LINKS.map((social) => (
            <a href={social.href} target="_blank" rel="noopener noreferrer" key={social.href}>
              {social.label}
            </a>
          ))}
        </div>
      </div>
      <p className="form-status" id="formStatus" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
