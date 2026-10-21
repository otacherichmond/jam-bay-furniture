import {
  BedDouble,
  Briefcase,
  CookingPot,
  DoorOpen,
  GraduationCap,
  Sofa,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { CUSTOM_ORDER_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/site";

const SERVICES = [
  {
    icon: Sofa,
    title: "Home & Living Furniture",
    text: "Sofas, armchairs, coffee tables, TV stands and dining sets that anchor your living space.",
  },
  {
    icon: Briefcase,
    title: "Office Furniture & Fit-Outs",
    text: "Executive desks, ergonomic office chairs and complete workstation setups for companies of any size.",
  },
  {
    icon: CookingPot,
    title: "Kitchen Cabinets",
    text: "Made-to-measure kitchen cabinets with premium hardware, measured and installed to fit perfectly.",
  },
  {
    icon: BedDouble,
    title: "Bedroom Furniture",
    text: "Bed frames, wardrobes, dressers and bedside tables — matching sets or individual statement pieces.",
  },
  {
    icon: GraduationCap,
    title: "School Furniture",
    text: "Durable desks, chairs and library shelving built to handle years of daily classroom use.",
  },
  {
    icon: DoorOpen,
    title: "Custom Doors",
    text: "Solid wood entrance and interior doors, plain or hand-carved, made to your exact measurements.",
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title="Everything your space needs, built in-house"
            subtitle="One workshop for furniture, cabinetry and doors — so your whole project matches, from the living room to the office."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 100}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-[var(--accent)] group-hover:text-accent-foreground">
                  <service.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <a
            href={whatsappLink(CUSTOM_ORDER_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
          >
            Have something custom in mind? Send us a message →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
