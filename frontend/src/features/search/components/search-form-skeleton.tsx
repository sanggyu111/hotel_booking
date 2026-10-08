/** 검색 폼이 준비되는 동안 같은 크기로 자리를 잡아 화면이 튀지 않게 한다. */
export function SearchFormSkeleton() {
  return (
    <div
      aria-hidden
      className="animate-pulse space-y-6 rounded-3xl border border-line bg-paper-raised p-5 sm:p-7"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-line/60" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-16 rounded-2xl bg-line/60" />
        <div className="h-16 rounded-2xl bg-line/60" />
      </div>
      <div className="space-y-2">
        <div className="h-14 rounded-2xl bg-line/60" />
        <div className="h-14 rounded-2xl bg-line/60" />
      </div>
      <div className="h-14 rounded-2xl bg-line" />
    </div>
  );
}
