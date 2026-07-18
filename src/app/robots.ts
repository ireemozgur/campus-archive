import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/profile/"],
    },
    sitemap: "https://campus-archive-ten.vercel.app/sitemap.xml",
  };
}
