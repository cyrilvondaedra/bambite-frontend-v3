"use client";

import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const socials = [
  {
    name: "Facebook",
    link: "https://www.facebook.com/profile.php?id=61581495755518",
    icon: "/fb.webp",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    width: 15,
    height: 15,
  },
  {
    name: "Line",
    link: "https://line.me/R/ti/p/@276tolpa?oat_content=url&ts=12311741",
    icon: "/line.svg",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    width: 20,
    height: 20,
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/bambiteburst?igsh=MTk1cDRieXN3ZTAzbg%3D%3D",
    icon: "/ig.svg",
    color: "bg-pink-600",
    hoverColor: "hover:bg-pink-700",
    width: 15,
    height: 15,
  },
  {
    name: "TikTok",
    link: "https://www.tiktok.com/@bambite25?_r=1&_t=ZS-92g00es6bgN",
    icon: "/tt.svg",
    color: "bg-gray-700",
    hoverColor: "hover:bg-gray-800",
    width: 15,
    height: 15,
  },
];

export default function Checkout() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-(--color-background)">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>

        {/* Hero */}
        <section className="pt-32 pb-12 primary_background heading">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-8">
              Send us order details to confirm your order
            </h1>

            <div className="max-w-md mx-auto space-y-4">
              {socials.map((social) => (
                <Button
                  key={social.name}
                  asChild
                  size="lg"
                  className={`${social.color} ${social.hoverColor} w-full rounded-xl text-white`}
                >
                  <Link
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3"
                  >
                    <Image
                      src={social.icon}
                      alt={`${social.name} Logo`}
                      width={social.width}
                      height={social.height}
                      className="shrink-0"
                    />
                    <span>Send to {social.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </CartProvider>
  );
}
