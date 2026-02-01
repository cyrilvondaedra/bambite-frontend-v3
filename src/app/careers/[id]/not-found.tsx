import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-3xl mb-4 sub_heading">Job Not Found</h1>
          <Button asChild>
            <Link href="/careers">
              <ArrowLeft size={16} className="mr-2" />
              Back to Careers
            </Link>
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
