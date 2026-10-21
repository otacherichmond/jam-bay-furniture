import { createFileRoute } from "@tanstack/react-router";

/**
 * Public image proxy for owner-uploaded product photos in the private
 * `product-images` bucket. Visitors only ever see these URLs.
 */
export const Route = createFileRoute("/api/public/storage/product-images/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const objectPath = (params as { _splat?: string })["_splat"];
        if (!objectPath || objectPath.includes("..")) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage
          .from("product-images")
          .download(objectPath);

        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(data, {
          headers: {
            "Content-Type": data.type || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
