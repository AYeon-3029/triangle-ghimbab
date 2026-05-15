import { Tag, Tier } from "@prisma/client";

// 티어 분류 기준
export const TIER_CONFIG = {
  MIN_REVIEWS: 1,   // 이 개수 미만이면 Unknown 처리
  S: 50,            // score >= 50
  A: 40,            // score >= 40
  B: 30,            // score >= 30
  // score < 30 → C
} as const;

export function calcScore(
  avgRating: number,
  reviewCount: number,
  imageCount: number,
  purchaseCount: number
): number {
  return avgRating * (10 + reviewCount * 0.1 + imageCount * 0.3 + purchaseCount * 0.2);
}

export function calcTier(score: number, reviewCount: number): Tier {
  if (reviewCount < TIER_CONFIG.MIN_REVIEWS) return Tier.Unknown;
  if (score >= TIER_CONFIG.S) return Tier.S;
  if (score >= TIER_CONFIG.A) return Tier.A;
  if (score >= TIER_CONFIG.B) return Tier.B;
  return Tier.C;
}

export function calcTagCounts(tagLists: Tag[][]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const tags of tagLists) {
    for (const tag of tags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }
  return counts;
}

const TIER_ORDER: Record<Tier, number> = { S: 0, A: 1, B: 2, C: 3, Unknown: 4 };

export function sortByTierThenScore<T extends { tier: Tier; score: number }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || b.score - a.score
  );
}

export function getTopTags(
  tagCounts: Record<string, number>,
  limit: number
): { tag: string; count: number }[] {
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

export function getTopTagsWithTies(
  tagCounts: Record<string, number>,
  topN: number
): string[] {
  const entries = Object.entries(tagCounts).filter(([, n]) => n > 0);
  if (entries.length === 0) return [];
  entries.sort((a, b) => b[1] - a[1]);
  if (entries.length <= topN) return entries.map(([tag]) => tag);

  const threshold = entries[topN - 1][1];
  return entries.filter(([, count]) => count >= threshold).map(([tag]) => tag);
}
