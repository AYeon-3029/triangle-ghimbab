export type Tag =
  | "withDrink" | "Delicious" | "Salty" | "Heavy" | "Mild"
  | "Spicy" | "Normal" | "Dry" | "Sweety" | "withRamyeon" | "Resonable";

export const TAG_LABEL: Record<Tag, string> = {
  withDrink:   "음료와 함께",
  Delicious:   "맛있는",
  Salty:       "짠맛",
  Heavy:       "든든한",
  Mild:        "담백한",
  Spicy:       "매운맛",
  Normal:      "무난한",
  Dry:         "퍽퍽한",
  Sweety:      "단맛",
  withRamyeon: "라면과 함께",
  Resonable:   "가성비",
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


