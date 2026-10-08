import type { Metadata, Viewport } from "next";
import { Gowun_Batang, Noto_Sans_KR } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

// 한글 폰트는 용량이 커서 preload를 끄고 필요한 글자만 내려받게 한다.
const body = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
  variable: "--font-body",
});

const heading = Gowun_Batang({
  weight: ["700"],
  display: "swap",
  preload: false,
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: { default: "머무름 — 호텔 객실 예약", template: "%s · 머무름" },
  description: "지역과 날짜를 고르고 빈 객실을 바로 예약하세요.",
  applicationName: "머무름",
  // iOS 홈 화면에 추가했을 때 주소창 없이 앱처럼 열리게
  appleWebApp: { capable: true, title: "머무름", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f2ea",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${body.variable} ${heading.variable}`}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
