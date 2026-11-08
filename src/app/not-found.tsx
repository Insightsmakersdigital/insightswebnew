import type { Metadata } from "next";
import Link from "next/link";
import CrowdCanvas from "../components/CrowdCanvas";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main" className={styles.stage}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>404 — Page not found</p>
        <h1 className={styles.title}>Are you lost?</h1>
        <p className={styles.line}>
          This page doesn&apos;t exist. It might have moved, or it was never there.
        </p>
        <Link href="/" className={`btn btn-primary btn-lg ${styles.cta}`}>
          <span>Back to home</span>
        </Link>
      </div>
      <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} className={styles.canvas} />
    </main>
  );
}
