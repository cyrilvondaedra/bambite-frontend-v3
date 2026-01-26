import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="bg-(--color-background) py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Label */}
        <div className="mb-6">
          <span className="text-sm font-medium uppercase tracking-widest text-(--color-primary)">
            Our Story
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h2 className="font-serif text-4xl font-medium leading-tight text-(--color-header1) md:text-5xl lg:text-6xl text-balance">
              About Us
            </h2>

            <div className="space-y-6 text-lg leading-relaxed text-(--color-header2)">
              <p>
                Hi, I&apos;m Bam. Welcome to my imaginative little world where
                familiar flavors meet new ideas and every bite becomes a joyful
                adventure.
              </p>

              <p>
                <span className="font-semibold text-(--color-primary)">BamBite</span>{" "}
                is the way of connecting generations, cultures, and experiences
                through food. Inspired by cuisines from across Asia, we explore
                flavors, techniques, and dishes beyond the familiar with
                creativity and care.
              </p>

              <p>
                The result is food that feels comforting and approachable, yet a
                little unexpected — offering something new while still feeling
                right at home.
              </p>

              <p className="text-(--color-header2) font-medium italic border-l-4 border-(--color-primary) pl-6">
                &quot;At BamBite, every dish is an invitation to discover,
                enjoy, and have fun through flavor.&quot;
              </p>
            </div>

            <a
              href="/about_us"
              className="inline-block mt-10 px-8 py-3 bg-(--color-background) text-(--color-header2) hover:bg-(--color-header1) hover:text-(--color-body) border border-(--color-header1) text-sm rounded-3xl tracking-wider uppercase transition-all duration-300"
            >
              Learn More
            </a>
          </div>

          {/* Right Column - Images */}
          <div className="relative">
            <div className="grid grid-cols-12 gap-4">
              {/* Main Portrait Image */}
              <div className="col-span-8 relative aspect-3/4 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/noodleMenu.jpg"
                  alt="Chef Bam in the kitchen"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Smaller Dish Image */}
              <div className="col-span-4 flex flex-col gap-4 justify-center">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/noodleMenu.jpg"
                    alt="Signature Asian fusion dish"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Decorative Element */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/noodleMenu.jpg"
                    alt="Signature Asian fusion dish"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
