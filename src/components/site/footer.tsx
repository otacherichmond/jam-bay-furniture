import { Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { COMPANY, telHref, whatsappLink } from "@/lib/site";

const QUICK_LINKS = [
  { href: "#furniture", label: "Furniture" },
  { href: "#services", label: "Services" },
  { href: "#why-us", label: "Why Us" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
              J&amp;B
            </span>
            <span className="font-display text-lg font-semibold text-foreground">
              Jam &amp; Bay
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Handcrafted furniture, cabinetry and doors — designed, built and delivered from our own
            workshop in Wuse, Abuja.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">{COMPANY.website}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {COMPANY.address}
            </li>
            <li>
              <a href={telHref} className="flex items-center gap-2 hover:text-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                {COMPANY.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink("Hello Jam & Bay Furniture! I have a question.")}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-accent hover:underline"
              >
                WhatsApp us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Working hours
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>Mon – Sat: 8:00 am – 6:00 pm</li>
            <li>Sunday: Closed</li>
          </ul>
          <Link
            to="/admin"
            className="mt-6 inline-block text-xs text-muted-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
          >
            Owner login
          </Link>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <p className="container-page text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
