import { Building2, TrendingUp, Users, Award } from "lucide-react";

const benefits = [
  {
    icon: Building2,
    title: "Proven Business Model",
    description:
      "Join a successful brand with established operations and processes.",
  },
  {
    icon: TrendingUp,
    title: "Strong ROI",
    description:
      "Benefit from our track record of consistent growth and profitability.",
  },
  {
    icon: Users,
    title: "Comprehensive Training",
    description:
      "Full support from site selection to grand opening and beyond.",
  },
  {
    icon: Award,
    title: "Brand Recognition",
    description: "Leverage our reputation for excellence in fine dining.",
  },
];
export default function FranchiseSection() {
  return (
    <section
      id="franchise"
      className="py-24 md:py-32 bg-(--color-foreground) text-(--color-header2)"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-serif text-(--color-header1) text-4xl font-medium leading-tight md:text-5xl lg:text-6xl text-balance mb-4">
              Franchise Opportunity
            </p>
            <p className="text-(--color-nav) leading-relaxed mb-8">
              We are expanding and looking for passionate partners to bring the
              Terroir experience to new locations. Join our family of
              restaurateurs and be part of a culinary legacy built on
              excellence, innovation, and unforgettable dining experiences.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 border border-text-(--color-border) hover:border-(--color-primary) transition-colors rounded-lg"
              >
                <benefit.icon className="w-8 h-8 mb-4 text-(--color-nav)" />
                <h3 className="font-serif text-xl mb-2 text-(--color-header1)">{benefit.title}</h3>
                <p className="text-(--color-nav) text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
