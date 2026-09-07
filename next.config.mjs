/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // Lets `npm run dev` serve its JS bundle/HMR to a phone on the same
  // Wi-Fi hitting the dev machine's LAN IP -- without this, Next blocks
  // those requests as cross-origin, so the page's HTML/CSS loads but no
  // JS ever runs (client components never hydrate). Dev-only; irrelevant
  // to the static `next build` export.
  allowedDevOrigins: ["192.168.1.10", "192.168.1.6"],
};

export default nextConfig;
