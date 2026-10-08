import type { MetadataRoute } from "next";

/**
 * PWA manifest: 휴대폰에서 '홈 화면에 추가'하면
 * 주소창 없는 전체 화면 앱처럼 실행된다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "머무름 — 호텔 객실 예약",
    short_name: "머무름",
    description: "지역과 날짜를 고르고 빈 객실을 바로 예약하세요.",
    lang: "ko",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6f2ea",
    theme_color: "#f6f2ea",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
