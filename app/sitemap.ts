import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/**
 * Stable lastModified dates — do NOT stamp every URL with new Date() on build.
 * That trains crawlers to ignore lastmod (everything always "changed").
 * Bump a page's date only when that URL's content meaningfully changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://opensourcebarware.com";

  // Frozen baselines (content-stable)
  const about = new Date("2026-07-04T00:00:00.000Z");
  const manifesto = new Date("2026-07-04T00:00:00.000Z");
  const compliance = new Date("2026-07-04T00:00:00.000Z");
  // v1.5 public drop + download funnel
  const v15 = new Date("2026-07-10T12:00:00.000Z");
  // Process / free product / comparison metadata + Live Demo nav + signal design
  const seoWave = new Date("2026-07-25T18:00:00.000Z");
  // Blog posts
  const blogGuide = new Date("2026-07-08T00:00:00.000Z");
  const blogFoh = new Date("2026-07-11T00:00:00.000Z");

  return [
    {
      url: baseUrl,
      lastModified: seoWave,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: about,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/the-process`,
      lastModified: seoWave,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/download`,
      lastModified: seoWave,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/downloads`,
      lastModified: v15,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: v15,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: blogGuide,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/manifesto`,
      lastModified: manifesto,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/open-source-compliance`,
      lastModified: compliance,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/free-bar-inventory-software`,
      lastModified: seoWave,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/bar-inventory-software-comparison`,
      lastModified: seoWave,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/liquor-inventory`,
      lastModified: v15,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wine-inventory`,
      lastModified: v15,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: blogFoh,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/free-inventory-system-guide`,
      lastModified: blogGuide,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/best-free-bar-inventory-system`,
      lastModified: blogGuide,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/variance-tracking-that-works`,
      lastModified: blogGuide,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/pos-integration-free-inventory`,
      lastModified: blogGuide,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/when-inventory-meets-the-front-of-house`,
      lastModified: blogFoh,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
