import type { Metadata } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getBaseUrl, siteName } from "@/lib/seo";

const displayFont = Bebas_Neue({ subsets: ["latin"], variable: "--font-display", weight: "400" });
const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body" });
const codeFont = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: "Forge your limits. One WoD at a time.",
  applicationName: siteName,
  category: "sports",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: "Forge your limits. One WoD at a time.",
    images: ["/images/home-hero-crossfit.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "Forge your limits. One WoD at a time.",
    images: ["/images/home-hero-crossfit.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${codeFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
