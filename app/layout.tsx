import type { Metadata } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Bebas_Neue({ subsets: ["latin"], variable: "--font-display", weight: "400" });
const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body" });
const codeFont = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://wod-lab-codex.vercel.app"),
  title: "WodLab",
  description: "Forge your limits. One WoD at a time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${codeFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
