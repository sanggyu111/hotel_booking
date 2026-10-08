import { Suspense } from "react";
import { SearchFormSection } from "@/features/search/components/search-form-section";
import { SearchFormSkeleton } from "@/features/search/components/search-form-skeleton";

/**
 * 첫 화면: 호텔 객실 검색.
 * 헤더와 소개 문구는 빌드 때 정적으로 만들어 두고,
 * '오늘 날짜'가 필요한 검색 폼만 요청 시점에 채워 넣는다(Suspense).
 */
export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 sm:px-6">
      <header className="flex items-center justify-between py-5">
        <span className="font-display text-xl font-bold tracking-tight">머무름</span>
        <nav className="text-sm text-muted">
          {/* 예약 내역 화면은 다음 단계에서 만든다 */}
          <span aria-disabled className="cursor-default">
            내 예약
          </span>
        </nav>
      </header>

      <main className="grid flex-1 grid-cols-1 items-start gap-8 pb-12 pt-4 md:grid-cols-[1fr_minmax(0,28rem)] md:gap-12 md:pt-16">
        <section className="md:sticky md:top-16">
          <p className="text-sm font-medium text-accent">오늘 밤부터 한 달 뒤까지</p>
          <h1 className="mt-2 font-display text-4xl leading-tight font-bold sm:text-5xl">
            어디에서
            <br />
            머물까요?
          </h1>
          <p className="mt-4 max-w-sm text-muted">
            지역과 날짜, 인원만 고르면 지금 예약 가능한 객실을 보여 드립니다.
          </p>

          <ul className="mt-8 hidden space-y-3 text-sm text-muted md:block">
            <li className="flex gap-3">
              <Dot />
              {/* flex 안에서 글자와 <strong>이 따로 칸을 차지하지 않도록 한 덩어리로 묶는다 */}
              <span>
                객실을 고르면 결제 전까지 <strong className="text-ink">10분간</strong> 다른
                사람이 가져가지 못하게 잡아 둡니다.
              </span>
            </li>
            <li className="flex gap-3">
              <Dot />
              <span>체크인 7일 전까지 취소하면 전액 환불됩니다.</span>
            </li>
          </ul>
        </section>

        <Suspense fallback={<SearchFormSkeleton />}>
          <SearchFormSection />
        </Suspense>
      </main>
    </div>
  );
}

function Dot() {
  return <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />;
}
