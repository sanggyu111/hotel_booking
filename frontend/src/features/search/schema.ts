import { z } from "zod";
import { addDays, isValidIsoDate, nightsBetween } from "@/lib/format/date";

export const MAX_NIGHTS = 30;
export const MAX_GUESTS = 10;
export const MAX_ROOMS = 5;
/** 오늘부터 몇 일 뒤까지 체크인을 받을지 (재고 시드 범위와 맞춘다) */
export const BOOKING_WINDOW_DAYS = 365;

const isoDate = z
  .string()
  .refine(isValidIsoDate, { message: "날짜 형식이 올바르지 않습니다." });

/**
 * 검색 조건 스키마.
 * 홈 화면 폼(브라우저)과 /search 페이지(서버)가 같은 규칙을 쓴다.
 * '오늘'은 실행 위치마다 다를 수 있어 인자로 받는다.
 */
export function createSearchSchema(today: string) {
  const lastCheckIn = addDays(today, BOOKING_WINDOW_DAYS);

  return z
    .object({
      region: z.string().trim().min(1, "지역을 선택해 주세요.").max(50),
      checkIn: isoDate,
      checkOut: isoDate,
      guests: z.coerce
        .number()
        .int()
        .min(1, "인원은 1명 이상이어야 합니다.")
        .max(MAX_GUESTS, `인원은 최대 ${MAX_GUESTS}명입니다.`),
      rooms: z.coerce
        .number()
        .int()
        .min(1, "객실은 1개 이상이어야 합니다.")
        .max(MAX_ROOMS, `객실은 최대 ${MAX_ROOMS}개입니다.`),
    })
    .superRefine((v, ctx) => {
      // 날짜 형식이 틀렸으면 위에서 이미 걸렸으므로 아래 계산은 건너뛴다.
      if (!isValidIsoDate(v.checkIn) || !isValidIsoDate(v.checkOut)) return;

      if (v.checkIn < today) {
        ctx.addIssue({
          code: "custom",
          path: ["checkIn"],
          message: "체크인은 오늘 이후여야 합니다.",
        });
      }
      if (v.checkIn > lastCheckIn) {
        ctx.addIssue({
          code: "custom",
          path: ["checkIn"],
          message: `체크인은 ${BOOKING_WINDOW_DAYS}일 이내로 선택해 주세요.`,
        });
      }

      const nights = nightsBetween(v.checkIn, v.checkOut);
      if (nights < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["checkOut"],
          message: "체크아웃은 체크인 다음 날 이후여야 합니다.",
        });
      } else if (nights > MAX_NIGHTS) {
        ctx.addIssue({
          code: "custom",
          path: ["checkOut"],
          message: `최대 ${MAX_NIGHTS}박까지 예약할 수 있습니다.`,
        });
      }

      if (v.rooms > v.guests) {
        ctx.addIssue({
          code: "custom",
          path: ["rooms"],
          message: "객실 수는 인원 수보다 많을 수 없습니다.",
        });
      }
    });
}

export type SearchInput = z.infer<ReturnType<typeof createSearchSchema>>;
export type SearchField = keyof SearchInput;
export type SearchErrors = Partial<Record<SearchField, string>>;

/** Zod 결과를 필드별 첫 번째 에러 메시지로 정리 */
export function toFieldErrors(error: z.ZodError): SearchErrors {
  const errors: SearchErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors)) {
      errors[field as SearchField] = issue.message;
    }
  }
  return errors;
}
