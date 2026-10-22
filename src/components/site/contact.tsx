import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import {
  COMPANY,
  DEFAULT_WHATSAPP_MESSAGE,
  QUOTE_WHATSAPP_MESSAGE,
  telHref,
  whatsappLink,
} from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 bg-sand py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Get in touch"
            title="Visit the showroom or message us"
            subtitle="Walk into our Wuse workshop to see and test the furniture yourself — or start the conversation on WhatsApp, whichever is easier for you."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <MapPin className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-foreground">Showroom &amp; workshop</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {COMPANY.address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.address)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline"
              >
                Get directions →
              </a>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Clock className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-foreground">Opening hours</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Monday – Saturday: 8:00 am – 6:00 pm
                <br />
                Sunday: Closed (WhatsApp messages still answered)
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                A real person from our team replies, usually within minutes during working hours.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex h-full flex-col rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Phone className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">Call or WhatsApp us</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
                {COMPANY.phoneDisplay}
              </p>
              <div className="mt-auto flex flex-col gap-2 pt-5">
                <a
                  href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-[var(--accent)]/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" />
                  Call now
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
            <h3 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              Ready to furnish your space?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Tell us what you need — a single statement piece or a full home or office fit-out —
              and we'll send you a free quote with designs and pricing.
            </p>
            <a
              href={whatsappLink(QUOTE_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-black/10 transition-transform hover:scale-[1.03]"
            >
              <MessageCircle className="h-4 w-4" />
              Request a free quote
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
