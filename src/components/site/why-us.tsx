import { Award, HandHeart, MapPin, PenTool, ShieldCheck, Truck } from "lucide-react";
import { COMPANY } from "@/lib/site";
import { Reveal, SectionHeading } from "@/components/site/reveal";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Built to last, guaranteed quality",
    text: "We use kiln-dried hardwood and high-density foam so your furniture stays firm and beautiful for years — no sagging, no wobbling.",
  },
  {
    icon: PenTool,
    title: "Designed around your space",
    text: "Send us your room dimensions and style preference. We design, build and adjust until the piece fits your space perfectly.",
  },
  {
    icon: HandHeart,
    title: "Direct from our workshop",
    text: "No middlemen. You deal directly with the people building your furniture, which means honest prices and better attention.",
  },
  {
    icon: Truck,
    title: "Delivery & installation",
    text: "We deliver and install across Abuja and beyond, and we handle the heavy lifting so you don't have to.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Why Jam &amp; Bay
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Furniture you'll still love in ten years
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We're a furniture store and manufacturer based in Wuse, Abuja — which means
              everything we sell is something we made, checked and stand behind.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {REASONS.map((reason) => (
                <div key={reason.title}>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <reason.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-semibold text-foreground">{reason.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {reason.text}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10">
              <h3 className="font-display text-2xl font-semibold">The Jam &amp; Bay promise</h3>
              <div className="mt-8 grid gap-7 sm:grid-cols-2">
                <PromiseStat icon={Award} value={`${COMPANY.googleRating} / 5`} label="Google customer rating" />
                <PromiseStat icon={MapPin} value="Wuse, Abuja" label="Our own showroom & workshop" />
                <PromiseStat icon={ShieldCheck} value="Real wood" label="Kiln-dried, solid materials" />
                <PromiseStat icon={PenTool} value="Custom" label="Sizes, fabrics & finishes" />
              </div>
              <p className="mt-8 border-t border-white/15 pt-6 text-sm leading-relaxed text-primary-foreground/80">
                Call us on {COMPANY.phoneDisplay} or send a WhatsApp message — a real person from
                our team responds, usually within minutes during working hours.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PromiseStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Award;
  value: string;
  label: string;
}) {
  return (
    <div>
      <Icon className="h-6 w-6 text-[var(--gold)]" />
      <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-primary-foreground/75">{label}</p>
    </div>
  );
}
