import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "삼각편대",
  description: "편의점 삼각김밥 리뷰, 평점, 태그 기반 추천 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ minHeight: "100vh" }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
