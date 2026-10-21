import heroImage from "@/assets/hero-showroom.jpg";
import { MessageCircle, Phone, Star } from "lucide-react";
import { COMPANY, DEFAULT_WHATSAPP_MESSAGE, telHref, whatsappLink } from "@/lib/site";
import { Reveal } from "@/components/site/reveal";

const BENEFITS = [
  {
    title: "Quality craftsmanship",
    text: "Every piece is built by hand in our own Wuse workshop by experienced carpenters and upholsterers.",
  },
  {
    title: "Durable materials",
    text: "Kiln-dried hardwoods, high-density foams and premium finishes that stand up to daily use.",
  },
  {
    title: "Custom designs",
    text: "Made-to-measure sizes, fabrics and finishes — designed around your space and your taste.",
  },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Jam & Bay furniture showroom"
          width={1920}
          height={1080}
          className="hero-zoom h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
      </div>

      <div className="container-page flex min-h-[85vh] flex-col justify-center py-24 text-white">
        <Reveal className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-[var(--gold)] text-[var(--gold)]" />
            Rated {COMPANY.googleRating} by our customers
          </p>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Handcrafted furniture for beautiful homes &amp; offices in Abuja
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            From custom sofas and beds to complete office and school fit-outs — designed,
            built and delivered by our own workshop.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#furniture"
              className="inline-flex items-center rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-black/25 transition-transform hover:scale-[1.03]"
            >
              Browse our furniture
            </a>
            <a
              href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <a
              href={telHref}
              className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm font-semibold text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              <Phone className="h-4 w-4" />
              {COMPANY.phoneDisplay}
            </a>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {BENEFITS.map((benefit, i) => (
            <Reveal key={benefit.title} delay={i * 120}>
              <div className="h-full rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <h3 className="font-display text-lg font-semibold text-white">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{benefit.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
