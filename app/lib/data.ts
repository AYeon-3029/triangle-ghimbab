export type Allergen =
  | "egg" | "milk" | "soybean" | "wheat" | "crab" | "shrimp"
  | "pork" | "tomato" | "sulfite" | "chicken" | "beef" | "squid" | "shellfish";

export const ALLERGEN_LABEL: Record<Allergen, string> = {
  egg:      "계란",
  milk:     "우유",
  soybean:  "대두",
  wheat:    "밀",
  crab:     "게",
  shrimp:   "새우",
  pork:     "돼지고기",
  tomato:   "토마토",
  sulfite:  "아황산류",
  chicken:  "닭고기",
  beef:     "쇠고기",
  squid:    "오징어",
  shellfish: "조개류",
};

// 식약처 알레르기 표시 의무 순서 기준
const ALLERGEN_ORDER: Allergen[] = [
  "egg", "milk", "soybean", "wheat", "crab", "shrimp",
  "pork", "tomato", "sulfite", "chicken", "beef", "squid", "shellfish",
];

export function sortAllergens(allergens: Allergen[]): Allergen[] {
  return [...allergens].sort((a, b) => ALLERGEN_ORDER.indexOf(a) - ALLERGEN_ORDER.indexOf(b));
}

export type Tag =
  | "withDrink" | "Salty" | "Heavy" | "Mild"
  | "Spicy" | "Normal" | "Dry" | "Sweety" | "withRamyeon" | "Chewy" | "Fishy";

export const TAG_LABEL: Record<Tag, string> = {
  Spicy:       "매콤",
  Salty:       "짭짤",
  Sweety:      "달달",
  Mild:        "슴슴",
  Normal:      "무난",
  Fishy:       "비림",
  Heavy:       "든든",
  Dry:         "퍽퍽",
  Chewy:       "씹는맛",
  withDrink:   "음료와 함께",
  withRamyeon: "라면이랑",
};

export type Brand = "GS25" | "SEVEN_ELEVEN" | "EMART24" | "CU";
export const BRAND_LABEL: Record<Brand, string> = {
  GS25:         "GS25",
  SEVEN_ELEVEN: "세븐일레븐",
  EMART24:      "이마트24",
  CU:           "CU",
};
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
  allergens: Allergen[];
};

export type User = {
  id: string;
  email: string;
  nickname: string;
};

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  imageUrls: string[];
  createdAt: string;
  commentCount: number;
  likeCount: number;
  viewerHasLiked: boolean;
  comments: CommunityComment[];
};

export type CommunityComment = {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
};
