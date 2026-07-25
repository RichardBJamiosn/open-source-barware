import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { blogPosts } from "@/lib/blog";

export const metadata = {
  ...pageMetadata({
    title: "Blog — Open Source Barware | Free Inventory System Guides",
    description: "In-depth operator guides on free bar inventory systems, variance tracking, POS integration, and why the best bar inventory system is the one that stays free and open source.",
    path: "/blog",
    keywords: [
      "free inventory system",
      "free bar inventory system",
      "best bar inventory system",
      "best free bar inventory system",
      "bar inventory software",
      "free inventory system",
      "bartender resources",
    ],
  }),
  // Must re-declare canonical here: this object literally replaces the `alternates`
  // returned by pageMetadata(), so declaring only `types` silently dropped the
  // canonical and made /blog the one sitemap URL without one.
  alternates: {
    canonical: "/blog",
    types: {
      'application/rss+xml': '/blog/feed.xml',
    },
  },
};

const posts = blogPosts;

export default function BlogIndex() {
  return (
    <main className="min-h-screen">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-2">Operator Notes</p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream mb-4">Blog</h1>
          <p className="text-text-muted max-w-2xl">
            Practical notes on running inventory the way real bars do it. Free tools, real workflows, no upsells.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="panel p-6 md:p-8">
              <div className="flex items-center gap-3 text-xs text-text-light mb-2">
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-copper/40" />
                <span>{post.category}</span>
              </div>
              <h2 className="font-serif text-2xl text-cream mb-3">
                <Link href={`/blog/${post.slug}`} className="hover:text-copper transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">{post.excerpt}</p>
              <Link 
                href={`/blog/${post.slug}`} 
                className="text-sm text-copper hover:text-copper-bright inline-flex items-center gap-1"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center text-xs text-text-light">
          More notes coming as we test and improve the program with the trade.
        </div>
      </section>
    </main>
  );
}
