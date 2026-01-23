"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
      console.log("response", response);

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast.success("Your message has been sent!");
      setFormData({
        name: "",
        email: "",
        reason: "",
        message: "",
      });
    } catch (err: any) {
      toast.error(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <CartProvider>
      <main className="h-full bg-background">
        <Header />

        <section
          id="contact_us"
          className="py-24 md:py-32 px-6 md:px-12 lg:px-20"
        >
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
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-8">
                  Reach us here
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-10">
                  We&apos;re Here for You. Questions about our products,
                  locations, or collaborations? Send us a message and our
                  support team will respond shortly.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="gap-6">
                    <input
                      type="text"
                      id="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-0 py-3 bg-transparent border-b border-(--color-primary) text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-(--color-primary) transition-colors"
                      required
                    />
                  </div>

                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-0 py-3 bg-transparent border-b border-(--color-primary) text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-(--color-primary) transition-colors"
                    required
                  />

                  <select
                    id="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-0 py-3 bg-transparent border-b border-(--color-primary) text-foreground focus:outline-none focus:border-(--color-primary) transition-colors"
                    required
                  >
                    <option value="">Reason of contact</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Others">Others</option>
                  </select>

                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Special requests or dietary requirements"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-0 py-3 bg-transparent border-b border-(--color-primary) focus:border-(--color-primary) text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors resize-none"
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-3xl text-sm tracking-wider uppercase hover:bg-primary/90 transition-all duration-300"
                  >
                    {loading ? "Sending..." : "Submit Request"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </CartProvider>
  );
}
