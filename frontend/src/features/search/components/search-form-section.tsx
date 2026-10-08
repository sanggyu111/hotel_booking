import { connection } from "next/server";
import { todayInSeoul } from "@/lib/format/date";
import { POPULAR_REGIONS } from "../regions";
import { SearchForm } from "./search-form";

/**
 * '오늘'은 요청 시점마다 달라지므로 빌드 때 고정되면 안 된다.
 * connection()으로 이 부분만 요청 시점에 렌더링하고,
 * 페이지의 나머지(헤더, 소개 문구)는 정적으로 미리 만들어 둔다.
 */
export async function SearchFormSection() {
  await connection();
  const today = todayInSeoul();
  return <SearchForm today={today} regions={POPULAR_REGIONS} />;
}
