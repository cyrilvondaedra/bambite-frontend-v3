"use client";

export default function OriginStory() {
  return (
    <section className="relative bg-(--color-background) py-24 md:py-32 lg:py-40">
      <div className="absolute left-0 top-0 h-32 w-full bg-linear-to-b from-foreground/5 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

          <div>
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] text-(--color-primary)">
              Chapter One
            </span>
            <h2 className="font-serif text-4xl text-(--color-header1) font-medium leading-tight md:text-5xl lg:text-6xl">
              {"And that's how BamBite was born"}
            </h2>
          </div>

          {/* Right Column - Description */}
          <div
            className="flex flex-col justify-center transition-all delay-300 duration-1000 
             "
          >
            <p className="text-lg leading-relaxed md:text-xl text-(--color-header2)">
              {
                "What begins in Bam's world - his discoveries, his creativity, his joyful little recipes - is now being shared with you. Every dish is an invitation to connect, to feel comfort, and to experience new flavours carried from his home to yours, wherever you are."
              }
            </p>
            <p className="mt-6 text-lg leading-relaxed text-(--color-header2) md:text-xl">
              No matter how much the world changes, Bam believes one thing will
              always stay the same:{" "}
              <span className="font-medium text-(--color-primary)">
                food is happiness, comfort, and connection.
              </span>
            </p>
          </div>
        </div>

        <div
          className="mt-20 rounded-2xl bg-(--color-foreground) p-8 md:p-12 lg:p-16 transition-all delay-500 duration-1000 ${
           "
        >
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-(--color-primary) px-4 py-2">
              <span className="text-sm font-medium text-(--color-header1)">
                Our Mission
              </span>
            </div>
            <p className="font-serif text-2xl leading-relaxed text-(--color-header1) md:text-3xl lg:text-4xl">
              BamBite exists to connect cultures, generations, and moments
              through the simple happiness of great food.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
