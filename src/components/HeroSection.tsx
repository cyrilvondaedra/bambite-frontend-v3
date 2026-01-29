import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Chef preparing dishes"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 cover" />
      </div>
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl">
          <p className="sub_heading text-sm tracking-[0.3em] uppercase mb-4">
            Bringing You More Ways to Enjoy Asian Cuisine
          </p>
          <h1 className="heading font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-tight text-balance">
            Asian flavors beyond what you already know
          </h1>
          <p className="mt-8 sub_heading max-w-xl leading-relaxed">
            Rooted in Asian flavors and reimagined with modern creativity,
            BamBite brings together bold tastes, and the joy of our little
            souls.
          </p>
          <a
            href="/menus"
            className="inline-block secondary_btn border border_border mt-10 px-8 py-3 text-sm rounded-3xl tracking-wider uppercase transition-all duration-300"
          >
            Order Now
          </a>
        </div>
      </div>
    </section>
  );
}
