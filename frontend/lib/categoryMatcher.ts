import { Listing } from "@/types/listing";

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", label: "All stays", icon: "🏠" },
  { id: "pools", label: "Amazing pools", icon: "🏊" },
  { id: "beach", label: "Beach", icon: "🏖️" },
  { id: "countryside", label: "Countryside", icon: "🌾" },
  { id: "mountains", label: "Mountains", icon: "⛰️" },
  { id: "cabins", label: "Cabins", icon: "🪵" },
  { id: "views", label: "Amazing views", icon: "🌅" },
  { id: "design", label: "Design", icon: "✨" },
  { id: "farms", label: "Farms", icon: "🚜" },
  { id: "tropical", label: "Tropical", icon: "🌴" },
  { id: "lakefront", label: "Lakefront", icon: "⛵" },
  { id: "cities", label: "Iconic cities", icon: "🏙️" },
  { id: "mansions", label: "Mansions", icon: "🏰" },
];

/**
 * Accurately matches a listing against a selected category based on its title,
 * description, city, country, amenities, and pricing attributes.
 */
export function matchCategory(listing: Listing, categoryId: string): boolean {
  if (!categoryId || categoryId === "all") {
    return true;
  }

  const title = (listing.title || "").toLowerCase();
  const desc = (listing.description || "").toLowerCase();
  const city = (listing.city || "").toLowerCase();
  const country = (listing.country || "").toLowerCase();
  const amenities = (listing.amenities || []).map((a) => a.toLowerCase());
  const combinedText = `${title} ${desc} ${city} ${country} ${amenities.join(" ")}`;

  switch (categoryId) {
    case "pools":
      return (
        combinedText.includes("pool") ||
        amenities.some((a) => a.includes("pool"))
      );

    case "beach":
      return (
        ["beach", "sea", "ocean", "coast", "coastal", "waterfront"].some((kw) =>
          combinedText.includes(kw)
        ) || ["goa", "bali", "nice"].includes(city)
      );

    case "countryside":
      return (
        ["countryside", "cottage", "retreat", "rural", "farm", "paddies", "garden", "orchard"].some(
          (kw) => combinedText.includes(kw)
        ) || ["ubud", "dehradun", "rishikesh"].includes(city)
      );

    case "mountains":
      return (
        ["mountain", "alpine", "chalet", "himalayan", "hillside"].some((kw) =>
          combinedText.includes(kw)
        ) || ["interlaken", "dehradun", "rishikesh"].includes(city)
      );

    case "cabins":
      return ["cabin", "chalet", "cottage", "wood", "bamboo", "timber"].some((kw) =>
        combinedText.includes(kw)
      );

    case "views":
      return ["view", "views", "skyline", "panoram", "overlook", "eiffel", "scenic"].some(
        (kw) => combinedText.includes(kw)
      );

    case "design":
      return [
        "design",
        "designer",
        "architectural",
        "loft",
        "minimalist",
        "modern",
        "smart home",
        "duplex",
      ].some((kw) => combinedText.includes(kw));

    case "farms":
      return [
        "farm",
        "orchard",
        "paddies",
        "eco",
        "sanctuary",
        "nature",
        "garden",
        "bamboo",
      ].some((kw) => combinedText.includes(kw));

    case "tropical":
      return (
        ["tropical", "palm", "beach", "coastal", "caribbean"].some((kw) =>
          combinedText.includes(kw)
        ) || ["bali", "goa"].includes(city)
      );

    case "lakefront":
      return ["lake", "waterfront", "river", "riverside", "brienz", "ganges"].some((kw) =>
        combinedText.includes(kw)
      );

    case "cities":
      return [
        "paris",
        "tokyo",
        "new york",
        "noida",
        "gurgaon",
        "london",
        "city",
        "urban",
        "downtown",
      ].some((kw) => combinedText.includes(kw));

    case "mansions":
      return (
        ["villa", "penthouse", "mansion", "estate", "residence"].some((kw) =>
          combinedText.includes(kw)
        ) || listing.price_per_night >= 150
      );

    default:
      return true;
  }
}
