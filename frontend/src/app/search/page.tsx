import Link from "next/link";
import { Suspense } from "react";
import { createSearchSchema, toFieldErrors } from "@/features/search/schema";
import { POPULAR_REGIONS } from "@/features/search/regions";
import { formatKoreanDate, nightsBetween, todayInSeoul } from "@/lib/format/date";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = { title: "검색 결과" };

/**
 * /search — 첫 화면 폼이 이동해 오는 곳.
 * 지금은 서버에서 조건을 다시 검증해 보여 주기만 하고,
 * 객실 목록은 백엔드(GET /api/v1/hotels/search)가 준비되면 이 자리에 붙인다.
 */
export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← 검색 조건 바꾸기
      </Link>
      {/* searchParams는 요청마다 달라서 Suspense 안에서 읽는다 */}
      <Suspense fallback={<div className="mt-6 h-40 animate-pulse rounded-3xl bg-line/60" />}>
        <SearchSummary searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchSummary({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const pick = (key: string) => {
    const v = raw[key];
    return Array.isArray(v) ? v[0] : v;
  };

  // 브라우저 검증은 우회될 수 있으므로 서버에서 같은 스키마로 다시 검증한다.
  const result = createSearchSchema(todayInSeoul()).safeParse({
    region: pick("region") ?? "",
    checkIn: pick("checkIn") ?? "",
    checkOut: pick("checkOut") ?? "",
    guests: pick("guests") ?? "",
    rooms: pick("rooms") ?? "",
  });

  if (!result.success) {
    const errors = Object.values(toFieldErrors(result.error));
    return (
      <section className="mt-6 rounded-3xl border border-danger/30 bg-white p-6">
        <h1 className="font-display text-2xl font-bold">검색 조건을 확인해 주세요</h1>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-danger">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </section>
    );
  }

  const q = result.data;
  const regionLabel = POPULAR_REGIONS.find((r) => r.code === q.region)?.label ?? q.region;

  return (
    <section className="mt-6 rounded-3xl border border-line bg-paper-raised p-6">
      <h1 className="font-display text-2xl font-bold">{regionLabel}의 빈 객실</h1>
      <p className="mt-2 text-muted">
        {formatKoreanDate(q.checkIn)} → {formatKoreanDate(q.checkOut)} ·{" "}
        {nightsBetween(q.checkIn, q.checkOut)}박 · {q.guests}명 · 객실 {q.rooms}개
      </p>
      <p className="mt-6 rounded-2xl border border-dashed border-line p-4 text-sm text-muted">
        객실 목록은 백엔드 검색 API를 연결하면 여기에 표시됩니다.
      </p>
    </section>
  );
}
