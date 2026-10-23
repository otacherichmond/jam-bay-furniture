import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { Footer } from "@/components/site/footer";
import { Faq } from "@/components/site/faq";
import { Contact } from "@/components/site/contact";
import { Hero } from "@/components/site/hero";
import { Navbar } from "@/components/site/navbar";
import { ProductsSection } from "@/components/site/products-section";
import { ReviewsSection } from "@/components/site/reviews-section";
import { Services } from "@/components/site/services";
import { WhyUs } from "@/components/site/why-us";
import { getProducts, getReviews } from "@/functions/furniture";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => getProducts(),
});

const reviewsQuery = queryOptions({
  queryKey: ["reviews"],
  queryFn: () => getReviews(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(reviewsQuery),
    ]),
  head: () => ({
    meta: [
      { title: "Jam & Bay Furniture — Handcrafted Furniture in Abuja" },
      {
        name: "description",
        content:
          "Sofas, beds, wardrobes, office furniture, kitchen cabinets and doors — designed, built and delivered from our own workshop in Wuse, Abuja. Custom sizes, durable materials, free quotes on WhatsApp.",
      },
      { property: "og:title", content: "Jam & Bay Furniture — Handcrafted Furniture in Abuja" },
      {
        property: "og:description",
        content:
          "Sofas, beds, wardrobes, office furniture and kitchen cabinets built by hand in Wuse, Abuja. Custom designs, delivery and installation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: reviews } = useSuspenseQuery(reviewsQuery);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <ProductsSection products={products} />
        <WhyUs />
        <ReviewsSection reviews={reviews} />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
