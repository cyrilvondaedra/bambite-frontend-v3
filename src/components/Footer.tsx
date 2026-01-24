import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";

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

export default function Footer() {
  return (
    <footer className="bg-(--color-primary) text-(--color-primary-foreground) border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-semibold tracking-wider text-(--color-primary-foreground) mb-6">
              BamBite
            </h3>
            <p className="text-(--color-primary-foreground) leading-relaxed mb-6">
              Experience culinary excellence in an atmosphere of refined
              elegance. Where every dish is crafted with passion and served with
              grace.
            </p>
            <div className="flex gap-4">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <Image
                    src={social.icon}
                    alt={`${social.name} Logo`}
                    width={social.width}
                    height={social.height}
                    className="inline-block w-5"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm tracking-wider text-(--color-primary-foreground) mb-6">
              QUICK LINKS
            </h4>

            <ul className="space-y-4">
              <li>
                <Link
                  href="/menus"
                  className="text-(--color-primary-foreground) hover:text-accent transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/about_us"
                  className="text-(--color-primary-foreground) hover:text-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact_us"
                  className="text-(--color-primary-foreground) hover:text-accent transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/career"
                  className="text-(--color-primary-foreground) hover:text-accent transition-colors"
                >
                  Career
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-wider text-(--color-primary-foreground) mb-6">
              CONTACT
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <span className="text-(--color-primary-foreground)">
                  Pathuwan
                  <br />
                  169 Rama VI Soi 7, Khwaeng Rong Muang, Pathum Wan, Krung Thep
                  Maha Nakhon, Bangkok 10330
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <span className="text-(--color-primary-foreground)">
                  Udom Suk
                  <br />
                  183/ Sukhumvit Road, 101/2, Bang Na Nuea, Bang Na, Bangkok
                  10260
                </span>
              </li>
              {/* <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <a
                  href="tel:+12125551234"
                  className="text-(--color-primary-foreground)hover:text-accent transition-colors"
                >
                  +1 (212) 555-1234
                </a>
              </li> */}
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <a
                  href="mailto:hello@noir.com"
                  className="text-(--color-primary-foreground) hover:text-accent transition-colors"
                >
                  BamBite@Totals-Inc.com
                </a>
              </li>
            </ul>
            <p className="text-sm">
              We&apos;ll respond shortly during office hours.
            </p>
          </div>
          <div>
            <h4 className="text-sm tracking-wider text-(--color-primary-foreground) mb-6">
              HOURS
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <div className="text-muted-foreground">
                  <p className="text-(--color-primary-foreground) mb-1">
                    Monday - Sunday
                  </p>
                  <p className="text-(--color-primary-foreground)">
                    10:00 AM - 12:00 AM
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-(--color-primary-foreground)">
            © 2026 BamBite Restaurant. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-(--color-primary-foreground) hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-(--color-primary-foreground) hover:text-accent transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
