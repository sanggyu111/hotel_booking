import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 기본은 동적 렌더링, 캐시는 'use cache'로 명시한 곳만.
  // 재고·가격이 실수로 캐시되는 일을 구조적으로 막는다.
  cacheComponents: true,

  // Docker 이미지에 필요한 파일만 담는 출력 형식
  output: "standalone",
};

export default nextConfig;
