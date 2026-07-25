import type { Metadata } from "next";
import { Caveat, Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import ConditionalSiteChrome from "@/components/ConditionalSiteChrome";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JulyFourthLaunchOverlay from "@/components/JulyFourthLaunchOverlay";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

// GA4 property 540046010 "Open Source Barware", stream 14996118024 → opensourcebarware.com.
// Verified against the Admin API 2026-07-25. Do not change without re-checking the property:
// the previous value (G-ZM3BBYW5PY) belongs to no property on this account and silently
// blackholed all site analytics from 2026-07-09 onward.
const GA_MEASUREMENT_ID = "G-DQJKBWMM8H";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-pen",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://opensourcebarware.com";
const siteTitle = "Open Source Barware — Free Bar Inventory Program";
const siteDescription =
  "The free bar inventory program built by bartenders, tested in a real restaurant. No subscriptions. No upsells. Just a system that works.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "free bar inventory spreadsheet",
    "bar inventory template free",
    "pour cost calculator",
    "free bartender tools",
    "open source bar inventory",
    "bartender resources",
    "cocktail inventory management",
    "bar inventory system free",
    "liquor inventory spreadsheet",
    "beverage cost calculator",
    "bar inventory",
    "free inventory system",
    "bartender tools",
    "liquor inventory",
    "free liquor inventory",
    "wine inventory",
    "free wine inventory",
    "open source",
    "restaurant inventory",
    "beverage management",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Open Source Barware",
    type: "website",
    locale: "en_US",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Open Source Barware",
      url: siteUrl,
      description: siteDescription,
    },
    {
      "@type": "WebSite",
      name: "Open Source Barware",
      url: siteUrl,
    },
    {
      "@type": "SoftwareApplication",
      // Same @id as the node on /download so Google treats them as one entity.
      "@id": `${siteUrl}/#software`,
      name: "Open Source Barware",
      applicationCategory: "BusinessApplication",
      operatingSystem: "macOS, Windows",
      softwareVersion: "1.5.0",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: "Free, open-source bar inventory program with voice walk mapping, tenths counting, variance tracking, POS integration, and smart ordering. No subscription. No lock-in.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${caveat.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script src="/osb-analytics.js" strategy="afterInteractive" />
        <Script src="/osb-ambient-cursor.js" strategy="afterInteractive" />
        {/* Bing Webmaster Tools verification */}
        <meta name="msvalidate.01" content="0F0DF97AF304FF08B8E12E092B2CEEAF" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {/* Critical theme so a failed stylesheet never leaves raw unstyled HTML */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html,body{background:#0d0b09;color:#e8dfd4;margin:0;min-height:100%;}
              body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}
              /* Do NOT set a{color} here — unlayered rules beat Tailwind @layer
                 utilities and blank out copper buttons (text same color as bg). */
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <ConditionalSiteChrome>
          <Footer />
        </ConditionalSiteChrome>
        <Suspense fallback={null}>
          <ConditionalSiteChrome>
            <JulyFourthLaunchOverlay />
          </ConditionalSiteChrome>
        </Suspense>
      </body>
    </html>
  );
}
