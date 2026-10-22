import { MessageCircle, Quote, Star } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { COMPANY, DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/site";
import type { ReviewRow } from "@/functions/furniture";

export function ReviewsSection({ reviews }: { reviews: ReviewRow[] }) {
  return (
    <section id="reviews" className="scroll-mt-24 bg-sand py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Customer reviews"
            title="What our customers say"
            subtitle={`Rated ${COMPANY.googleRating} out of 5 on Google by customers across Abuja.`}
          />
        </Reveal>

        {reviews.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={review.id} delay={(i % 3) * 90}>
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <Quote className="h-5 w-5 text-[var(--gold)]" />
                  <div className="mt-3 flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star
                        key={star}
                        className={
                          star < review.rating
                            ? "h-4 w-4 fill-[var(--gold)] text-[var(--gold)]"
                            : "h-4 w-4 text-border"
                        }
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    “{review.comment}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{review.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{review.location}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : null}

        <Reveal className="mt-10 text-center">
          <a
            href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-[var(--accent)]"
          >
            <MessageCircle className="h-4 w-4" />
            Join them — start with a free consultation
          </a>
        </Reveal>
      </div>
    </section>
  );
}
