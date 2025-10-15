import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { MiniPlayerProvider } from "@/contexts/MiniPlayerContext";
import GlobalMiniPlayer from "@/components/GlobalMiniPlayer";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A & B — Bizim hikayemiz",
  description: "A romantic journey told with memories, messages and music.",
  icons: { icon: "/favicon.ico" },
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "A & B",
    description: "A romantic journey told with memories, messages and music.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} antialiased`}
        style={{
          // Provide CSS vars to Tailwind theme mapping
          // These are already set via font loaders as CSS variables
        }}
      >
        <MiniPlayerProvider>
          {children}
          <GlobalMiniPlayer />
          <Footer />
        </MiniPlayerProvider>
        <Analytics />
      </body>
    </html>
  );
}
