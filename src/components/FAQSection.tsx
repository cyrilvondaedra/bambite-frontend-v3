import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need a reservation?",
    answer:
      "We highly recommend making a reservation, especially for dinner service and weekends. Walk-ins are welcome but subject to availability. You can reserve a table through our website or by calling us directly.",
  },
  {
    question: "Do you accommodate dietary restrictions?",
    answer:
      "Absolutely. Our kitchen can accommodate vegetarian, vegan, gluten-free, and most allergy requirements. Please inform us of any dietary needs when making your reservation so our chef can prepare accordingly.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Complimentary valet parking is available during dinner service. There is also a public parking garage located one block east of the restaurant with validated parking for our guests.",
  },
  {
    question: "Do you offer private dining?",
    answer:
      "Yes, we have a private dining room that seats up to 16 guests, perfect for intimate celebrations and business dinners. Please contact us directly to discuss menu options and availability.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "We kindly request 24 hours notice for cancellations. For parties of 6 or more, we require 48 hours notice. Late cancellations or no-shows may be subject to a fee.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 secondary_background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          {/* <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
            Questions & Answers
          </p> */}
          <h2 className="font-serif text-4xl font-medium leading-tight md:text-5xl lg:text-6xl text-balance heading2">
            FAQ
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b secondary_border"
            >
              <AccordionTrigger className="font-serif sub_heading2 text-lg hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="sub_heading2 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
