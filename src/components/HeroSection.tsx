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
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl">
          <p className="text-background/80 text-sm tracking-[0.3em] uppercase mb-4">
            More ways to enjoy Asian Cuisine
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-background font-light leading-tight text-balance">
           Asian flavors beyond what you already know
          </h1>
          <p className="mt-8 text-background/80 max-w-xl leading-relaxed">
            Introducing new ways to enjoy the tastes of Asia, thoughtfully prepared and easy to love.
          </p>
          <a
            href="#reserve"
            className="inline-block mt-10 px-8 py-3 border border-primary hover:text-white text-background text-sm tracking-wider uppercase hover:bg-primary transition-all duration-300"
          >
            Order Now
          </a>
        </div>
      </div>
    </section>
  );
}
