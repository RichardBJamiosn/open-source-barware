export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  keywords?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "free-inventory-system-guide",
    title: "Free Inventory System for Bars: Setup in One Night",
    date: "2026-07-08",
    excerpt: "Detailed walkthrough of mapping stations, voice or typed walks, tenths counting, and first-week reconciliation — the exact process used in real bars.",
    category: "Setup",
    keywords: ["free inventory system", "free bar inventory system"],
  },
  {
    slug: "best-free-bar-inventory-system",
    title: "Why Open Source Barware is the Best Free Bar Inventory System",
    date: "2026-07-08",
    excerpt: "What “best” means when you’re the one counting at 2 a.m. Real comparison to spreadsheets and paid tools.",
    category: "Comparison",
    keywords: ["best bar inventory system", "best free bar inventory"],
  },
  {
    slug: "variance-tracking-that-works",
    title: "Variance Tracking That Actually Works in a Free Inventory System",
    date: "2026-07-08",
    excerpt: "Bottle, station, category, and shift-level variance from real operator data.",
    category: "Operations",
  },
  {
    slug: "pos-integration-free-inventory",
    title: "POS Integration in a Free Inventory System — Why It Matters More Than You Think",
    date: "2026-07-08",
    excerpt: "Structured Toast, Square, and CSV imports that turn counts into real usage numbers and smart orders.",
    category: "Operations",
  },
  {
    slug: "when-inventory-meets-the-front-of-house",
    title: "When Inventory Meets the Front of House",
    date: "2026-07-11",
    excerpt:
      "Counts, POS, and guest demand share one truth. Operational notes — free tool stays free; no sales pitch.",
    category: "Operations",
    keywords: ["bar inventory and pos", "front of house operations"],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
