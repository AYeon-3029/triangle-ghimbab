# 삼각편대 — 삼각김밥 편의점 대장

편의점 삼각김밥 리뷰·평점·태그 기반 추천 웹서비스

**→ [samgakpd.vercel.app](https://samgakpd.vercel.app)**

---

## 주요 기능

- **티어리스트**: 리뷰 수·별점·포토리뷰를 반영한 가중 점수로 S/A/B/C 자동 등급화
- **취향 태그**: 매콤·짭짤·든든 등 11개 태그로 제품 키워드 집계 시각화
- **알레르기 필터**: 식약처 표시 의무 13종 기준 필터 (세션 저장)
- **리뷰 시스템**: 별점(0.5단위)·태그·사진·재구매 의향 작성, 비로그인 익명 작성 가능
- **커뮤니티**: 글·댓글·좋아요, 제목·내용·작성자 통합 검색
- **검색**: 제품명 검색 + 알레르기 필터 복합 적용

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| DB / ORM | PostgreSQL + Prisma 5 |
| 이미지 스토리지 | Supabase Storage |
| 스타일링 | Tailwind CSS 4 + shadcn/ui |
| 배포 | Vercel |

## 로컬 실행

```bash
# 환경 변수 설정
cp .env.example .env.local
# DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 입력

npm install
npx prisma generate
npx prisma db seed   # 시드 데이터 투입
npm run dev
```

## 고려대학교 정보대학 NE:XT Contest 2026 출품작
