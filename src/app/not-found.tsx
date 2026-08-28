import type { Metadata } from "next";
import Link from "next/link";
import NotFoundFlipCards from "../components/NotFoundFlipCards";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main">
      <section className={styles.notfoundStage}>
        <div className="wrap">
          <div className={styles.notfoundInner}>
            <h1 className={styles.srOnly}>404 — Page not found</h1>

            <NotFoundFlipCards />

            <div className={`${styles.notfoundCaption} reveal`}>
              <p className={styles.notfoundEyebrow}>Page not found</p>
              <p className={styles.notfoundLine}>This page doesn&apos;t exist. It might have moved, or it was never there.</p>
            </div>

            <Link href="/" className={`btn btn-primary btn-lg magnetic reveal ${styles.notfoundCta}`}>
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
