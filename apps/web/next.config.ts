import path from "node:path";
import type { NextConfig } from "next";

const I18N_REQUEST = "./i18n/request.ts";

const config: NextConfig = {
  transpilePackages: ["@varchasv/domain", "@varchasv/i18n"],
  // The browser talks to the API through /api on the same origin, so the session cookie is first-party.
  async rewrites() {
    return [{ source: "/api/:path*", destination: (() => {
      const url = process.env.API_URL;
      if (!url && process.env.NODE_ENV === "production") {
        throw new Error("API_URL env var is not set. Add it to Vercel: Settings > Environment Variables.");
      }
      return `${url ?? "http://localhost:4100"}/:path*`;
    })() }];
  },
  poweredByHeader: false,
  async headers() {
    const headers = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(), payment=()" },
    ];
    if (process.env.NODE_ENV === "production") headers.push({ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" });
    // The sample documents beside the Print settings are shown in a frame of our own page, so they (and only they) may be framed by the same site.
    const own = headers.map((h) => (h.key === "X-Frame-Options" ? { ...h, value: "SAMEORIGIN" } : h.key === "Content-Security-Policy" ? { ...h, value: h.value.replace("frame-ancestors 'none'", "frame-ancestors 'self'") } : h));
    return [{ source: "/:path((?!print/sample).*)", headers }, { source: "/print/sample/:path*", headers: own }];
  },
  // next-intl reads its request config through this alias. We set it directly instead of using
  // next-intl's build plugin, which pulls in @swc/core's native addon only for features we don't use.
  turbopack: { resolveAlias: { "next-intl/config": I18N_REQUEST } },
  webpack(cfg) {
    cfg.resolve ??= {};
    cfg.resolve.alias = { ...cfg.resolve.alias, "next-intl/config": path.resolve(I18N_REQUEST) };
    return cfg;
  },
};

export default config;
