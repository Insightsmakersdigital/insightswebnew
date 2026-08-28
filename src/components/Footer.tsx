import Link from "next/link";
import { SITE_SHORT, SITE_NAME } from "../data/site";

export default function Footer() {
  return (
    <footer className="site-footer panel-light">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden="true"></span>
            {SITE_SHORT}
          </Link>
          <p>Digital marketing, branding & web development studio, based in Kerala.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <div>
            <h4>Studio</h4>
            <Link href="/about">About</Link>
            <Link href="/work">Work</Link>
            <Link href="/services">Services</Link>
            <Link href="/blogs">Journal</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <h4>Elsewhere</h4>
            <a href="#" rel="noopener">LinkedIn</a>
            <a href="#" rel="noopener">Instagram</a>
            <a href="#" rel="noopener">YouTube</a>
          </div>
          <div>
            <h4>Legal</h4>
            <Link href="/privacy-policy">Privacy policy</Link>
            <Link href="/terms-of-service">Terms of service</Link>
          </div>
        </nav>
      </div>
      <div className="wrap footer-bottom">
        <p>
          © <span id="year"></span> {SITE_NAME}. All rights reserved.
        </p>
        <button className="to-top" id="toTop" aria-label="Back to top">
          ↑
        </button>
      </div>
    </footer>
  );
}
