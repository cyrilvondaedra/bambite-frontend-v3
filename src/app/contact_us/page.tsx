"use client";
import { Suspense } from "react";
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
    reason: "general_inquiry",
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit form");
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
      <main className="h-full bg-(--color-background)">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
        <section
          id="contact_us"
          className="py-24 md:py-32 px-6 md:px-12 lg:px-20 primary_background"
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
                <h2 className="font-serif heading text-4xl font-medium leading-tight md:text-5xl lg:text-6xl text-balance mb-8">
                  Contact us
                </h2>
                <p className="body text-lg leading-relaxed mb-10">
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
                      className="w-full px-0 py-3 heading bg-transparent border-b primary_border placeholder:heading focus:outline-none focus:primary_border transition-colors"
                      required
                    />
                  </div>

                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-0 py-3 heading bg-transparent border-b primary_border placeholder:heading focus:outline-none focus:primary_border transition-colors"
                    required
                  />

                  <select
                    id="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-0 py-3 heading bg-transparent border-b primary_border focus:outline-none focus:primary_border transition-colors"
                    required
                  >
                    <option value="general_inquiry">General Inquiry</option>
                    <option value="product_question">Product Question</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>

                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Special requests or dietary requirements"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-0 py-3 heading bg-transparent border-b primary_border focus:primary_border placeholder:heading focus:outline-none transition-colors resize-none"
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-block mt-10 px-8 py-3 primary_btn text-sm rounded-3xl tracking-wider uppercase transition-all duration-300"
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
