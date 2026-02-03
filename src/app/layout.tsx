import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/CartContext";
import { UserProvider } from "@/components/UserContext";
import { Toaster } from "@/components/ui/sonner";

const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});
const _dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

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
  keywords: ["restaurant", "bar", "burmese cuisine", "food"],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
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
      <body className={`${_dmSans.variable} ${_playfair.variable}`}>
        <ThemeProvider>
          <UserProvider>
            <CartProvider>{children}</CartProvider>
          </UserProvider>
        </ThemeProvider>
        <Toaster position="top-center" expand={false} richColors />
      </body>
    </html>
  );
}
