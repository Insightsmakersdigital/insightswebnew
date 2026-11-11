"use client";

import { useEffect } from "react";

// The homepage fallback script (src/app/page.tsx) stashes the URL the visitor
// actually typed before sending them to /404.html. Put it back in the address
// bar so they don't see "/404.html".
export default function RestoreUrl() {
  useEffect(() => {
    try {
      const orig = sessionStorage.getItem("nf-url");
      if (!orig) return;
      sessionStorage.removeItem("nf-url");
      if (orig.startsWith("/") && !orig.startsWith("//")) {
        window.history.replaceState(window.history.state, "", orig);
      }
    } catch {
      /* storage blocked: leave the URL as /404.html */
    }
  }, []);
  return null;
}
