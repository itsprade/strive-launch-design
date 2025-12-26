import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strive Labs - Marketing Intelligence Platform",
  description: "AI-powered marketing analytics and campaign optimization platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
