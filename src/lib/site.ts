export const COMPANY = {
  name: "Jam & Bay Furniture Limited",
  shortName: "Jam & Bay",
  address: "23 Ndjamena Cres, Wuse, Abuja 904101, Federal Capital Territory, Nigeria",
  phoneDisplay: "0916 234 0000",
  phoneE164: "2349162340000",
  website: "jnbfurniture.com.ng",
  googleRating: 4.3,
} as const;

export const telHref = `tel:+${COMPANY.phoneE164}`;
export const whatsappNumber = COMPANY.phoneE164;

export function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello Jam & Bay Furniture! I would like to make an inquiry.";
export const QUOTE_WHATSAPP_MESSAGE =
  "Hello Jam & Bay Furniture! I would like to request a quote for a custom furniture order.";
export const CUSTOM_ORDER_WHATSAPP_MESSAGE =
  "Hello Jam & Bay Furniture! I would like to place a custom order.";

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export const CATEGORIES = [
  { value: "sofas", label: "Sofas" },
  { value: "beds", label: "Beds" },
  { value: "wardrobes", label: "Wardrobes" },
  { value: "tables", label: "Tables" },
  { value: "chairs", label: "Chairs" },
  { value: "desks", label: "Desks" },
  { value: "kitchen", label: "Kitchen Cabinets" },
  { value: "doors", label: "Doors" },
] as const;

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

export function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
