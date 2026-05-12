/// <reference types="node" />
import { PrismaClient, Brand, Tag } from "@prisma/client";
import { calcScore, calcTagCounts, calcTier } from "../src/utils/scoring";

const prisma = new PrismaClient();

// -------------------------------------------------------
// 1. 제품 + 리뷰 데이터를 여기에 입력하세요
// -------------------------------------------------------
const SEED_DATA: {
  id?: string;            // 지정 시 해당 값 사용, 생략 시 cuid() 자동 생성
  name: string;
  brand: Brand;
  imageUrl: string;
  isNew?: boolean;
  price?: number;
  reviews: {
    id?: string;          // 지정 시 해당 값 사용, 생략 시 cuid() 자동 생성
    rating: number;       // 0.5 단위 (필수)
    comment?: string;     // 코멘트 (선택)
    imageUrl?: string;    // 이미지 URL (선택)
    tags?: Tag[];         // 태그 목록 (선택)
    isPurchase?: boolean; // 재구매 의사 여부 (선택, 기본값 false)
  }[];
}[] = [
  // ── 삼각 시리즈 ──────────────────────────────
  { id: "P001", name: "삼각)저당전주비빔",       brand: Brand.GS25, price: 1200, isNew: true,imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P001.jpg", reviews: [
    {
      id: "R0011",
      rating: 4,
      comment: `제로콜라처럼 당 낮은걸 자주먹는데 저당임에도 맛좋음`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0011_P001.jpg",
    }
  ] },
  { id: "P002", name: "삼각)라이트참치마요",     brand: Brand.GS25, price: 1300, isNew: true,imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P002.jpg", reviews: [] },
  { id: "P003", name: "삼각)콘참치마요",         brand: Brand.GS25, price: 1300, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P003.jpg", reviews: [] },
  { id: "P004", name: "삼각)갈비양념불고기",     brand: Brand.GS25, price: 1300, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P004.jpg", reviews: [] },
  { id: "P005", name: "삼각)참치마요",           brand: Brand.GS25, price: 1200, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P005.jpg", reviews: [
    {
      id: "R0015",
      rating: 4,
      comment: `자주 애용하는 삼각김밥. 가성비 굿!`,
    },
    {
      id: "R0016",
      rating: 3.5,
    },
    {
      id: "R0017",
      rating: 4,
    },
    {
      id: "R0018",
      rating: 4.5,
    },
    {
      id: "R0019",
      rating: 4.5,
      comment: `내용물이 실하고 맛있음. 밥알이 떡지거나 설익지 아니하고 아주 좋음.`,
      tags: [Tag.Heavy],
    },
    {
      id: "R0020",
      rating: 5,
      comment: `울어라 지옥참마도`,
    },
    {
      id: "R0022",
      rating: 4.5,
      comment: `든든합니다`,
      tags: [Tag.Heavy],
    },
    {
      id: "R0037",
      rating: 4.5,
      comment: `라면이랑 먹어도 맛있고, 그냥 먹어도 맛있고, 차갑게 먹어 라면이랑도 맛있고, 데워서 먹어도 맛있는 최고의 제품`,
    }
  ] },
  { id: "P006", name: "삼각)더바삭한김참치마요",brand: Brand.GS25, price: 1200, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P006.jpg", reviews: [] },
  { id: "P007", name: "삼각)新전주비빔",         brand: Brand.GS25, price: 1200, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P007.jpg", reviews: [
    {
      id: "R0001",
      rating: 4,
      comment: `먹기전에 약간 짜지않을까 걱정했는데 생각보다 양념이 과하지 않음. 밥 전체에 양념이 베어있어서 모서리 부분도 밍밍하지않았음. 제로 콜라랑 먹으면 더 맛있을 듯? 다만 양이 다소 부족하여 2개는 먹어야 한끼를 때울 수 있어 보임`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0001_P007.jpg",
      tags: [Tag.withDrink, Tag.Dry],
    },
    {
      id: "R0012",
      rating: 3,
      comment: `양념이 맛있지만 단일 제품으로 식사를 해결한다는 취지를 생각하면 짜다. 이거랑 맨밥이랑 먹어도 될듯`,
      tags: [Tag.Salty],
    },
    {
      id: "R0013",
      rating: 5,
      comment: `매콤한게 한국인의 입맛에 너무 잘만들어짐`,
      tags: [Tag.Spicy],
    },
    {
      id: "R0014",
      rating: 4,
    },
  ] },
  { id: "P008", name: "삼각)스팸김치볶음밥",         brand: Brand.GS25, price: 1400, isNew: true, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P008.jpg", reviews: [
    {
      id: "R0031",
      rating: 4.5,
      comment: `적절한 간과 적당한 맵기와 신뢰의 스팸 및 마요`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0031_P008.jpg",
    }
  ] },
  { id: "P009", name: "삼각)참치김치볶음밥",         brand: Brand.GS25, price: 1400, isNew: true, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P009.jpg", reviews: [
  ] },

  // ── 더큰 시리즈 ──────────────────────────────
  { id: "P101", name: "더큰)닭갈비깻잎쌈밥",    brand: Brand.GS25, price: 1800, isNew: true,imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P101.jpg", reviews: [] },
  { id: "P102", name: "더큰)전주비빔",           brand: Brand.GS25, price: 1700, isNew: true,imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P102.jpg", reviews: [
    {
      id: "R0033",
      rating: 4.5,
      comment: `믿고 먹는 맛. 속재료 풍부하고 맛있음.`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0033_P102.jpg",
      tags: [Tag.Heavy]
    }
  ] },
  { id: "P103", name: "더큰)스팸계란볶음밥", isNew: true,    brand: Brand.GS25, price: 1900,  imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P103.jpg", reviews: [
    {
      id: "R0007",
      rating: 3.5,
      comment: `단독으로도, 곁들임으로도 무난함`,
      tags: [Tag.Normal],
    },
    {
      id: "R0025",
      rating: 3,
      comment: `무난무난??? 막 맛있는 느낌은 아니고...`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0025_P103.jpg",
      tags: [Tag.Normal]
    },
    {
      id: "R0034",
      rating: 3,
      comment: `스팸이 많이 들어있지 않고, 계란볶음밥 맛이 싱거웠다. 그러나, 마요네즈와 스팸의 조합이 좋아 계란볶음밥과 맛있게 먹었던 것 같다. 김의 바삭함과 짭잘함도 좋았다. 내용물 (스팸+마요) 양이 많이 들어있으면 좋겠다.`,
      tags: [Tag.Mild, Tag.Chewy]
    }
  ] },
  { id: "P104", name: "더큰)바삭김참치마요",     brand: Brand.GS25, price: 1700, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P104.jpg", reviews: [] },
  { id: "P105", name: "더큰)매콤제육깻잎쌈밥",  brand: Brand.GS25, price: 1800, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P105.jpg", reviews: [
    {
      id: "R0024",
      rating: 5,
      comment: `깻잎이 김 옆에 크게 감싸져 있어서 좋았음. 깻잎의 씹는 맛과 향이 제육과 어우러져 매우 만족스러웠음. 제육 본연의 맛도 좋은데 깻잎이 ㄹㅇ 킥임. 근래 먹은 것 중에서 최고의 삼김이었음`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0024_P105.jpg",
      tags: [Tag.Chewy]
    },
    {
      id: "R0027",
      rating: 5,
      comment: `어제도 먹었는데 또 먹음 ㄹㅇ 꿀맛`,
    },
    {
      id: "R0030",
      rating: 4.0,
      comment: `친구한테 추천받아서 먹어봤는데 맛있긴 했다. 포장지에 고기토핑이면 30초 정도 전자레인지 돌리라고 써있길래 했는데 내 생각엔 안 돌렸으면 좀 더 씹는맛 있고 더 맛있지 않았을까 싶다. 난 원래 안 돌리는 파기 때문에 돌려먹는 파의 입장은 또 다를지도..`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0030_P105.jpg",
      tags: [Tag.Heavy, Tag.Chewy],
    }
  ] },
  { id: "P106", name: "더큰)스팸김치볶음밥",     brand: Brand.GS25, price: 1800, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P106.jpg", reviews: [
    {
      id: "R0002",
      rating: 3.5,
      comment: `꽤나 많이 짜다. 매운맛이 거의 없다. 애초에 김치볶음밥이 짠데 스팸까지 짜서 더 짜다. 데미소다를 같이 마시니 짠 맛이 중화되어 좋았다.`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0002_P106.jpg",
      tags: [Tag.Salty, Tag.withDrink],
    },
    {
      id: "R0010",
      rating: 4,
      comment: `김치볶음밥은 원래 맛있고 스팸도 원래 맛있다. 그치만 스팸이 많이 들어있진 않아서 조금 아쉬웠다.`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0010_P106.jpg",
    },
    {
      id: "R0029",
      rating: 4.0,
      comment: `짭짤하고 맛있음. 내용물이 알차네요`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0029_P106.jpg",
      tags: [Tag.Salty, Tag.Heavy],
    }
  ] },
  { id: "P107", name: "더큰)전주비빔참치마요",   brand: Brand.GS25, price: 1800, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P107.jpg", reviews: [] },
  { id: "P108", name: "더큰)베이컨참치마요",     brand: Brand.GS25, price: 1700, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P108.jpg", reviews: [
    {
      id: "R0003",
      rating: 2.0,
      comment: `크다. 별로 안 짬. 밥이 많아서 슴슴함.
베이컨이 별로 없음 참치 마요가 강하지도 않구 속이 너무 조금 들었음..
아예 안 매움.
다른 거랑 같이 먹어야 할듯.`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0003_P108.jpg",
      tags: [Tag.Heavy, Tag.Mild],
    },
    {
      id: "R0004",
      rating: 4.0,
      comment: `확실히 기존보다 내용물이 많아져서 베어물때 밥만 느껴지지 않아서 좋음.`,
      tags: [Tag.Heavy],
    },
    {
      id: "R0009",
      rating: 2.5,
      comment: `그냥 참치마요랑 엄청 큰 차이는 나지 않았던 것 같음`,
      tags: [Tag.Mild],
    }
  ] },
  { id: "P109", name: "더큰)스팸콘치즈김볶밥",  brand: Brand.GS25, price: 1800, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P109.jpg", reviews: [
    {
      id: "R0005",
      rating: 3.5,
      comment: `삼각김밥 치곤 생각보단 매콤한 첫 입이었고 이후에는 짭짤한 맛이 치고 올라왔음. 짠맛이 좀 강해서 아쉬웠음. 스팸이랑 콘치즈는 많이 들어있어 좋았어요`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0005_P109.jpg",
      tags: [Tag.Heavy, Tag.Salty, Tag.Spicy],
    }
  ] },
  { id: "P110", name: "더큰)리챔참치마요",       brand: Brand.GS25, price: 1800, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P110.jpg", reviews: [
    {
      id: "R0026",
      rating: 0.5,
      comment: `리챔 맛도 별로고.... 참치가 비림... ㅠㅠ`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0026_P110.jpg",
      tags: [Tag.Fishy]
    }
  ] },
  { id: "P111", name: "더큰)참치마요",           brand: Brand.GS25, price: 1700, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P111.jpg", reviews: [
    {
      id: "R0028",
      rating: 4,
      comment: `라면이랑 먹을때 이만한게없다`,
      tags: [Tag.withRamyeon],
    },
    {
      id: "R0032",
      rating: 3.5,
      comment: `언제나 스탠다드한 맛. 그치만 딱 그정도인 거 같긴 함. 라면이랑 같이 안 먹으니까 좀 슴슴한듯`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0032_P111.jpg",
      tags: [Tag.Normal, Tag.Mild, Tag.withRamyeon],
    }
  ] },
  { id: "P112", name: "더큰)불닭콘치즈",         brand: Brand.GS25, price: 1800,  imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P112.jpg", reviews: [
    {
      id: "R0006",
      rating: 5,
      comment: `원래 불닭 좋아하긴 하는데 크고 양념 잘 돼있고 불닭에서 기대하는 매운맛이 잘 배어있음.`,
      tags: [Tag.Heavy, Tag.Spicy],
    }
  ] },

  // ── 흑백 시리즈 ──────────────────────────────
  { id: "P201", name: "흑백)파파베이컨리조또",   brand: Brand.GS25, price: 1800, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P201.jpg", reviews: [] },
  { id: "P202", name: "흑백)최유강랍스터볶음밥",brand: Brand.GS25, price: 1800, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P202.jpg", reviews: [
    {
      id: "R0021",
      rating: 4.5,
      comment: `랍스터살도 생각보다 실하고 무엇보다 밥이 맛있어서 내용물 없는 부분도 맛있게 먹을 수 있음`,
      tags: [Tag.Heavy],
    }
  ] },
  { id: "P203", name: "흑백)최강록날치알명란",   brand: Brand.GS25, price: 1700, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P203.jpg", reviews: [
    {
      id: "R0036",
      rating: 5.0,
      comment: `너무 맛있고 와사비향 은은해서 좋았음`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0036_P203.jpg",
    }
  ] },

  // ── 종가 시리즈 ──────────────────────────────
  { id: "P301", name: "종가)묵은지김치제육",     brand: Brand.GS25, price: 1700, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P301.jpg", reviews: [
    {
      id: "R0023",
      rating: 4,
      comment: `김치 씹는 맛이 인상적이었고 달달한 제육의 맛이 좋았음.`,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0023_P301.jpg",
      tags: [Tag.Sweety],
    }
  ] },
  { id: "P302", name: "종가)들기름묵은지참치",   brand: Brand.GS25, price: 1700, imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P302.jpg", reviews: [
    {
      id: "R0008",
      rating: 3.0,
      imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/review-images/R0008_P302.jpg",
    }
  ] },

  // ── 커플 시리즈 ──────────────────────────────
  { id: "P401", name: "커플)매콤제육&콘참치",    brand: Brand.GS25, price: 2300, isNew: true,imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P401.jpg", reviews: [] },
  { id: "P402", name: "커플)바삭김참치&불고기", brand: Brand.GS25, price: 2300, isNew: true,imageUrl: "https://chaoqaomqhdvlqnxrdhx.supabase.co/storage/v1/object/public/product-images/P402.jpg", reviews: [] },
];

// -------------------------------------------------------
// 2. 아래는 수정하지 않아도 됩니다
// -------------------------------------------------------
async function main() {
  console.log("Cleaning existing data...");
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding...");

  for (const product of SEED_DATA) {
    const { reviews, ...productData } = product;

    const reviewCount = reviews.length;
    const avgRating =
      reviewCount === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
    const imageCount = reviews.filter((r) => r.imageUrl != null).length;
    const score = calcScore(avgRating, reviewCount, imageCount);
    const tier = calcTier(score, reviewCount);
    const tagCounts = calcTagCounts(reviews.map((r) => r.tags ?? []));

    const created = await prisma.product.create({
      data: {
        ...productData,
        avgRating,
        score,
        tier,
        tagCounts,
        reviews: {
          create: reviews.map((r) => ({
            ...(r.id && { id: r.id }),
            rating: r.rating,
            comment: r.comment,
            imageUrl: r.imageUrl,
            tags: r.tags ?? [],
          })),
        },
      },
    });

    console.log(`  ✔ ${created.name} (${created.tier}, score: ${created.score.toFixed(2)})`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
