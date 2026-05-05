export type Tier = "S" | "A" | "B" | "C";

export type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  emoji: string;
  tier: Tier;
};

export const PRODUCTS: Product[] = [
  { id: 1,  name: "전주식 비빔밥", brand: "GS25",    price: 1900, rating: 4.6, reviewCount: 1284, tags: ["든든한", "익숙한", "가성비"],  emoji: "🍱", tier: "S" },
  { id: 2,  name: "매콤제육",     brand: "GS25",    price: 1700, rating: 4.5, reviewCount: 982,  tags: ["매운맛", "든든한", "자극적"],  emoji: "🥩", tier: "S" },
  { id: 3,  name: "참치마요",     brand: "GS25",    price: 1500, rating: 4.3, reviewCount: 2104, tags: ["고소한", "클래식", "가성비"],  emoji: "🐟", tier: "A" },
  { id: 4,  name: "스팸마요",     brand: "GS25",    price: 1700, rating: 4.4, reviewCount: 1567, tags: ["짠맛",   "든든한", "클래식"],  emoji: "🥫", tier: "A" },
  { id: 5,  name: "전주김치",     brand: "GS25",    price: 1400, rating: 4.1, reviewCount: 743,  tags: ["매운맛", "클래식", "가성비"],  emoji: "🌶️", tier: "A" },
  { id: 6,  name: "불닭마요",     brand: "GS25",    price: 1800, rating: 4.0, reviewCount: 612,  tags: ["매운맛", "자극적", "든든한"],  emoji: "🔥", tier: "A" },
  { id: 7,  name: "햄에그",      brand: "GS25",    price: 1600, rating: 3.9, reviewCount: 421,  tags: ["든든한", "아침",   "고소한"],  emoji: "🍳", tier: "B" },
  { id: 8,  name: "닭가슴살",    brand: "GS25",    price: 1900, rating: 3.8, reviewCount: 318,  tags: ["건강한", "단백질", "아침"],    emoji: "🍗", tier: "B" },
  { id: 9,  name: "소고기버섯",   brand: "GS25",    price: 2000, rating: 3.7, reviewCount: 256,  tags: ["든든한", "단백질", "클래식"],  emoji: "🍄", tier: "B" },
  { id: 10, name: "참치김치",     brand: "GS25",    price: 1600, rating: 3.6, reviewCount: 198,  tags: ["매운맛", "클래식", "가성비"],  emoji: "🐠", tier: "B" },
  { id: 11, name: "오징어볶음",   brand: "GS25",    price: 1700, rating: 3.4, reviewCount: 142,  tags: ["매운맛", "자극적", "짠맛"],    emoji: "🦑", tier: "C" },
  { id: 12, name: "진미채마요",   brand: "GS25",    price: 1500, rating: 3.2, reviewCount: 89,   tags: ["짠맛",   "고소한", "가성비"],  emoji: "🐡", tier: "C" },
];
