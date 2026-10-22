import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { COMPANY } from "@/lib/site";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Do you deliver outside Abuja?",
    answer:
      "Yes. We deliver and install across Abuja and the wider FCT, and we can arrange nationwide delivery for larger orders. Delivery within Abuja is free for orders above ₦500,000.",
  },
  {
    question: "Can you build furniture to my exact measurements?",
    answer:
      "That's our specialty. Send us your room dimensions and preferred style on WhatsApp, and we'll design the piece with you before a single cut is made.",
  },
  {
    question: "How long does a custom order take?",
    answer:
      "Most custom pieces are ready in 2–4 weeks depending on the design. Kitchen cabinets and full office fit-outs can take longer — we always confirm the timeline before you pay.",
  },
  {
    question: "What materials do you use?",
    answer:
      "We build with kiln-dried hardwoods, high-density foams and premium fabrics and finishes. Every material is chosen to survive daily use in Nigerian homes and offices.",
  },
  {
    question: "How do payments work?",
    answer:
      "We take a deposit to start work and the balance on completion or delivery. Bank transfer is our standard payment method, and you'll get a receipt for every payment.",
  },
  {
    question: "Do your products come with a warranty?",
    answer:
      "Yes — all our furniture carries a workmanship warranty. If something goes wrong because of how it was built, we fix it. Just call us on " +
    COMPANY.phoneDisplay +
    ".",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Questions, answered"
            title="Everything you might ask before ordering"
          />
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.question} delay={i * 50}>
                <div className="mb-3 overflow-hidden rounded-2xl border border-border bg-card">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-semibold text-foreground">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen ? (
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
