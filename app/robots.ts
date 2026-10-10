import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexorasmm.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services", "/guide", "/api-access", "/login", "/register", "/terms"],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/dashboard",
          "/dashboard/*",
          "/new-order",
          "/orders",
          "/add-funds",
          "/account",
          "/tickets",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
