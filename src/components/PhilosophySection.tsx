import Image from "next/image"

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Our Philosophy
        </p>
        
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-tight max-w-2xl mb-16">
          Connecting flavor, sustainability, and craftsmanship
        </h2>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="border-t border-border pt-6">
              <span className="font-serif text-4xl md:text-5xl text-foreground/20">1</span>
              <h3 className="font-serif text-xl mt-4 mb-3">Sourced with Purpose</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our purpose is to celebrate Burmese traditional foods by maintaining their authenticity while presenting them in a way that connects with today’s diners.
              </p>
            </div>
            
            <div className="border-t border-border pt-6">
              <span className="font-serif text-4xl md:text-5xl text-foreground/20">2</span>
              <h3 className="font-serif text-xl mt-4 mb-3">Crafted with Care</h3>
              <p className="text-muted-foreground leading-relaxed">
                Each dish reflects our dedication to technique, allowing natural flavors to shine through thoughtful preparation.
              </p>
            </div>
          </div>

          <div className="relative aspect-4/5">
            <Image
              src="/noodleMenu.jpg"
              alt="Beautifully plated dish"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
