/**
 * 숙박일은 항상 'YYYY-MM-DD' 문자열로 다룬다.
 * Date 객체로 바꿔 로컬 타임존에서 계산하면 하루가 밀리는 버그가 생기므로,
 * 계산은 모두 UTC 자정 기준으로 하고 결과도 문자열로 돌려준다.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** 호텔 기준 시간대(Asia/Seoul)의 오늘 날짜 */
export function todayInSeoul(now: Date = new Date()): string {
  // en-CA 로케일은 'YYYY-MM-DD' 형식으로 출력된다.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function toUtcMs(date: string): number {
  const m = ISO_DATE.exec(date);
  if (!m) throw new Error(`Invalid ISO date: ${date}`);
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function fromUtcMs(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** 형식뿐 아니라 실제 존재하는 날짜인지(2월 30일 등 거르기) 확인 */
export function isValidIsoDate(date: string): boolean {
  if (!ISO_DATE.test(date)) return false;
  return fromUtcMs(toUtcMs(date)) === date;
}

export function addDays(date: string, days: number): string {
  return fromUtcMs(toUtcMs(date) + days * DAY_MS);
}

/** 체크인~체크아웃 사이 박 수 (체크아웃일은 숙박일에 포함하지 않음) */
export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((toUtcMs(checkOut) - toUtcMs(checkIn)) / DAY_MS);
}

/** '2026-10-09' → '10월 9일 (금)' */
export function formatKoreanDate(date: string): string {
  const d = new Date(toUtcMs(date));
  return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 (${WEEKDAYS[d.getUTCDay()]})`;
}
