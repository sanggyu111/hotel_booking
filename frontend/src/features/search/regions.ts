/**
 * 첫 화면에 보여 줄 인기 지역.
 * 지금은 상수로 두고, 백엔드가 준비되면 지역 목록 API로 바꾼다
 * (자주 안 바뀌는 데이터라 'use cache' 대상).
 */
export type Region = {
  code: string;
  label: string;
  hint: string;
};

export const POPULAR_REGIONS: readonly Region[] = [
  { code: "SEOUL", label: "서울", hint: "도심 · 비즈니스" },
  { code: "BUSAN", label: "부산", hint: "해운대 · 광안리" },
  { code: "JEJU", label: "제주", hint: "휴양 · 리조트" },
  { code: "GANGNEUNG", label: "강릉", hint: "바다 · 카페거리" },
  { code: "GYEONGJU", label: "경주", hint: "한옥 · 유적지" },
  { code: "YEOSU", label: "여수", hint: "밤바다 · 오션뷰" },
];
