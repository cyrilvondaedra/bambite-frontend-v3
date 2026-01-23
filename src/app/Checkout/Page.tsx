"use client";

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
    width: 15,
    height: 15,
  },
  {
    name: "Line",
    link: "https://line.me/R/ti/p/@276tolpa?oat_content=url&ts=12311741",
    icon: "/line.svg",
    color: "bg-green-500",
    width: 20,
    height: 20,
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/bambiteburst?igsh=MTk1cDRieXN3ZTAzbg%3D%3D",
    icon: "/ig.svg",
    color: "bg-pink-600",
    width: 15,
    height: 15,
  },
  {
    name: "tikTok",
    link: "https://www.tiktok.com/@bambite25?_r=1&_t=ZS-92g00es6bgN",
    icon: "/tt.svg",
    color: "bg-black",
    width: 15,
    height: 15,
  },
];
export default function Checkout() {

  return (
    <CartProvider>
      <main className="h-full bg-background">
        <Header />

        {/* Hero */}
        <section className="pt-32 pb-12 bg-(--color-background) text-(--color-text)">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-5xl md:text-xl font-semibold mb-6">
              Send us order details to confirm your order
            </h1>
            {socials.map((social) => (
              <div className="mb-4" key={social.name}>
                <Button
                  asChild
                  key={social.name}
                  size="lg"
                  className={`${social.color} w-100 rounded-xl mb-4 text-primary-foreground hover:${social.color}/90 py-2 text-sm`}
                >
                  <Link href={social.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <Image
                      src={social.icon}
                      alt={`${social.name} Logo`}
                      width={social.width}
                      height={social.height}
                      className="inline-block"
                    />
                    <span className="ml-2">Send to {social.name}</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </CartProvider>
  );
}
