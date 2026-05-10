export type Tag =
  | "withDrink" | "Salty" | "Heavy" | "Mild"
  | "Spicy" | "Normal" | "Dry" | "Sweety" | "withRamyeon" | "Chewy" | "Fishy";

export const TAG_LABEL: Record<Tag, string> = {
  withDrink:   "음료와 함께",
  Salty:       "짭짤",
  Heavy:       "든든",
  Mild:        "슴슴",
  Spicy:       "매콤",
  Normal:      "무난",
  Dry:         "퍽퍽",
  Sweety:      "달달",
  withRamyeon: "라면이랑",
  Chewy:       "씹는맛",
  Fishy:       "비림",
};

export type Brand = "GS25" | "SEVEN_ELEVEN" | "EMART24" | "CU";
export type Tier  = "S" | "A" | "B" | "C" | "Unknown";

export type Product = {
  id: string;
  name: string;
  brand: Brand;
  price: number;
  avgRating: number;
  score: number;
  reviewCount: number;  // computed from reviews count (not in DB, fetched separately)
  tags: Tag[];          // derived from tagCounts keys
  imageUrl: string;
  isNew: boolean;
  tier: Tier;
};


