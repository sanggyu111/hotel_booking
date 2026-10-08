/** 첫 화면에서 '빈 객실 찾기'를 누른 직후 바로 보이는 자리표시 화면 */
export default function SearchLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <div className="h-5 w-32 animate-pulse rounded bg-line/60" />
      <div className="mt-6 h-40 animate-pulse rounded-3xl bg-line/60" />
    </div>
  );
}
