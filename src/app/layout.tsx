import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BamBite - Your Best Restaurant in Town",
  description:
    "BamBite offers a delightful culinary journey through Thailand's rich flavors.",
  metadataBase: new URL("https://bambite-v3.netlify.app"),
  alternates: { canonical: "/" },
  icons: {
    icon: "/web-app-manifest-192x192.png", 
    shortcut: "/web-app-manifest-512x512.png", 
    apple: "/web-app-manifest-512x512.png",
  },
  keywords: [
    "restaurant",
    "bar",
    "burmese cuisine",
    "food",
  ],
  openGraph: {
    title: "BamBite - Your Best Restaurant in Town",
    description:
      "BamBite offers a delightful culinary journey through Thailand's rich flavors.",
    url: "https://bambite-v3.netlify.app",
    siteName: "BamBite",
    locale: "en_US",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
