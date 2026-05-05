import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "삼각편대 — 삼각김밥 편의점 대장",
  description: "삼각김밥 리뷰·평점·태그 기반 추천 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ minHeight: "100vh" }}>{children}</body>
    </html>
  );
}
