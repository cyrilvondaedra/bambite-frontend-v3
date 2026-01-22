import Image from "next/image";

export default function ContactUs() {
  return (
    <section id="contact_us" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-4/3 lg:aspect-4/5">
            <Image
              src="/forcontact.jpg"
              alt="Restaurant interior"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Contact
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-8">
              Reach us here
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              We&apos;re Here for You. Questions about our products, locations,
              or collaborations? Send us a message and our support team — guided
              by smart tech and warm hearts — will respond shortly. The future
              of flavour starts with a conversation.
            </p>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="sr-only">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="First Name"
                    className="w-full px-0 py-3 bg-transparent border-b border-(--color-primary) text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-(--color-primary) transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last Name"
                    className="w-full px-0 py-3 bg-transparent border-b border-(--color-primary) text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-(--color-primary) transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="w-full px-0 py-3 bg-transparent border-b border-(--color-primary) text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-(--color-primary) transition-colors"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="guests" className="sr-only">
                    Reason of contact
                  </label>
                  <select
                    id="guests"
                    className="w-full px-0 py-3 bg-transparent border-b border-(--color-primary) text-foreground focus:outline-none focus:border-(--color-primary) transition-colors"
                  >
                    <option value="">Reason of contact</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Special requests or dietary requirements"
                  className="w-full px-0 py-3 bg-transparent border-b border-(--color-primary) hover:border-(--color-primary) text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-4 px-8 py-3 bg-primary text-primary-foreground text-sm tracking-wider uppercase hover:bg-primary/90 transition-all duration-300"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
