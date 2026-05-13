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
  allergens: string[];  // parsed from DB allergens string (comma-separated)
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
