"use client";

import { useEffect, useRef, useState } from "react";

// The contact form ledger, shared between the homepage's #contact section
// and the dedicated /contact page. Row hairlines arm once the form scrolls
// into view (IntersectionObserver, one-shot); submit is a client-only stub
// (no backend wired up yet) that swaps in a status message and resets.
export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("");

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus("Thanks. We'll be in touch within one business day.");
    form.reset();
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
      <div className="contact-submit-row">
        <button type="submit" className="contact-submit magnetic">
          <span>Send message</span>
        </button>
      </div>
      <div className="contact-status-block">
        <div className="contact-status-line">
          <span className="contact-status-dot" aria-hidden="true"></span>
          <span>Available for projects</span>
        </div>
        <p className="contact-status-reply">Replies within one business day</p>
        <div className="contact-socials">
          <a href="#" rel="noopener">
            LinkedIn
          </a>
          <a href="#" rel="noopener">
            Instagram
          </a>
          <a href="#" rel="noopener">
            YouTube
          </a>
        </div>
      </div>
      <p className="form-status" id="formStatus" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
