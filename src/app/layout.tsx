import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
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
  title: "Ravy & Mami — Our Story",
  description: "A romantic journey told with memories, messages and music.",
  icons: { icon: "/favicon.ico" },
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Ravy & Mami",
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
