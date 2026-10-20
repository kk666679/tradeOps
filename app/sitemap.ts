import type { MetadataRoute } from "next";

// Keep the public website sitemap on the existing www hostname.
// The MCP endpoint may use the apex hostname separately.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kurnia-kadir.xyz").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/product", changeFrequency: "monthly", priority: 0.8 },
    { path: "/solutions", changeFrequency: "monthly", priority: 0.8 },
    { path: "/solutions/fiz", changeFrequency: "monthly", priority: 0.8 },
    { path: "/solutions/forwarders", changeFrequency: "monthly", priority: 0.8 },
    { path: "/solutions/manufacturers", changeFrequency: "monthly", priority: 0.8 },
    { path: "/solutions/brokers", changeFrequency: "monthly", priority: 0.8 },
    { path: "/solutions/fcz", changeFrequency: "monthly", priority: 0.64 },
    { path: "/solutions/demo", changeFrequency: "monthly", priority: 0.5 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/customers", changeFrequency: "monthly", priority: 0.6 },
    { path: "/api-docs", changeFrequency: "monthly", priority: 0.5 },
    { path: "/workflow", changeFrequency: "monthly", priority: 0.5 },
  ];

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
