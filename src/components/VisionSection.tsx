export default function VisionSection() {
  return (
    <section className="relative overflow-hidden bg-foreground py-32 md:py-40 lg:py-48">

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Label */}
        <div className="mb-8 transition-all duration-1000">
          <span className="inline-block rounded-full border border-background/20 px-6 py-2 text-sm font-medium uppercase tracking-[0.2em] text-background/80">
            Our Vision
          </span>
        </div>

        {/* Main Vision Text */}
        <h2 className="font-serif text-3xl font-medium leading-relaxed text-background md:text-4xl lg:text-5xl transition-all delay-200 duration-1000">
          We, BamBite, strive to be a vibrant hub of flavorful experiences that
          celebrate <span className="text-primary">creativity</span>,{" "}
          <span className="text-primary">curiosity</span>, and{" "}
          <span className="text-primary">connection</span>
        </h2>

        {/* Secondary Text */}
        <p
          className="mx-auto mt-10 max-w-3xl text-lg leading-relaxed text-background/70 md:text-xl transition-all delay-400 duration-1000
          "
        >
          Turning everyday meals into shared moments that delight and surprise.
          Through thoughtful reinvention and genuine care in every dish, we aim
          to bring smiles to tables everywhere and make food a universal
          language of happiness.
        </p>

        {/* Decorative Line */}
        <div
          className="mx-auto mt-16 h-px w-24 bg-background/30 transition-all delay-500 duration-1000
          "
        />
      </div>
    </section>
  );
}
