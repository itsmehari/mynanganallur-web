import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteAnalytics } from "@/components/analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "mynanganallur.in — Nanganallur news, jobs, events & listings",
    template: "%s · mynanganallur.in",
  },
  description:
    "Nanganallur-focused local platform: news, directory, jobs, events, and neighbourhood hubs from mynanganallur.in.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mynanganallur.in",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteAnalytics />
        {children}
      </body>
    </html>
  );
}
