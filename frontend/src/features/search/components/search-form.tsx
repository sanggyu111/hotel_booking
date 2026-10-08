"use client";

import Form from "next/form";
import { useState, type FormEvent } from "react";
import { addDays, formatKoreanDate, nightsBetween } from "@/lib/format/date";
import type { Region } from "../regions";
import {
  BOOKING_WINDOW_DAYS,
  MAX_GUESTS,
  MAX_NIGHTS,
  MAX_ROOMS,
  createSearchSchema,
  toFieldErrors,
  type SearchErrors,
} from "../schema";
import { Stepper } from "./stepper";

type SearchFormProps = {
  /** 서버에서 계산한 Asia/Seoul 기준 오늘. 서버·브라우저 렌더 결과를 일치시키기 위해 props로 받는다. */
  today: string;
  regions: readonly Region[];
};

/**
 * 첫 화면 검색 폼.
 * GET 방식으로 /search?region=…&checkIn=… 으로 이동한다.
 * 검색 조건이 URL에 남으므로 공유·새로고침·뒤로가기가 그대로 동작한다.
 */
export function SearchForm({ today, regions }: SearchFormProps) {
  const [region, setRegion] = useState(regions[0]?.code ?? "");
  const [checkIn, setCheckIn] = useState(addDays(today, 1));
  const [checkOut, setCheckOut] = useState(addDays(today, 2));
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [errors, setErrors] = useState<SearchErrors>({});

  const nights = nightsBetween(checkIn, checkOut);
  const maxRooms = Math.min(MAX_ROOMS, guests);

  function changeCheckIn(next: string) {
    if (!next) return;
    setCheckIn(next);
    // 체크아웃이 범위를 벗어나면 1박으로 맞춰 준다.
    const n = nightsBetween(next, checkOut);
    if (n < 1 || n > MAX_NIGHTS) setCheckOut(addDays(next, 1));
    setErrors((e) => ({ ...e, checkIn: undefined, checkOut: undefined }));
  }

  function changeCheckOut(next: string) {
    if (!next) return;
    setCheckOut(next);
    setErrors((e) => ({ ...e, checkOut: undefined }));
  }

  function changeGuests(next: number) {
    setGuests(next);
    // 인원이 객실 수보다 적어지면 객실 수를 따라 줄인다.
    if (rooms > next) setRooms(next);
    setErrors((e) => ({ ...e, guests: undefined, rooms: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const result = createSearchSchema(today).safeParse({ region, checkIn, checkOut, guests, rooms });
    if (!result.success) {
      // 기본 동작(/search 이동)을 막고 에러를 보여 준다.
      event.preventDefault();
      setErrors(toFieldErrors(result.error));
    }
  }

  return (
    <Form
      action="/search"
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-3xl border border-line bg-paper-raised p-5 shadow-[0_1px_0_rgba(0,0,0,0.03),0_12px_40px_-20px_rgba(28,35,33,0.25)] sm:p-7"
    >
      {/* 1. 지역 */}
      <fieldset aria-describedby={errors.region ? "region-error" : undefined}>
        <legend className="mb-3 text-sm font-semibold text-ink">어디로 떠나세요?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {regions.map((r) => (
            <label key={r.code} className="group cursor-pointer">
              <input
                type="radio"
                name="region"
                value={r.code}
                checked={region === r.code}
                onChange={() => {
                  setRegion(r.code);
                  setErrors((e) => ({ ...e, region: undefined }));
                }}
                className="peer sr-only"
              />
              <span className="flex flex-col rounded-2xl border border-line bg-white px-4 py-3 transition group-hover:border-ink/40 peer-checked:border-accent peer-checked:bg-accent-soft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                <span className="font-semibold text-ink">{r.label}</span>
                <span className="text-xs text-muted">{r.hint}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.region && (
          <p id="region-error" className="mt-1.5 text-sm text-danger">
            {errors.region}
          </p>
        )}
      </fieldset>

      {/* 2. 날짜 */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">언제 머무세요?</legend>
        <div className="grid grid-cols-2 gap-2">
          <DateField
            id="checkIn"
            label="체크인"
            value={checkIn}
            min={today}
            max={addDays(today, BOOKING_WINDOW_DAYS)}
            onChange={changeCheckIn}
            error={errors.checkIn}
          />
          <DateField
            id="checkOut"
            label="체크아웃"
            value={checkOut}
            min={addDays(checkIn, 1)}
            max={addDays(checkIn, MAX_NIGHTS)}
            onChange={changeCheckOut}
            error={errors.checkOut}
          />
        </div>
        {nights >= 1 && nights <= MAX_NIGHTS && (
          <p className="mt-2 text-sm text-muted">
            {formatKoreanDate(checkIn)} → {formatKoreanDate(checkOut)} ·{" "}
            <strong className="font-semibold text-accent">{nights}박</strong>
          </p>
        )}
      </fieldset>

      {/* 3. 인원·객실 */}
      <fieldset className="space-y-2">
        <legend className="mb-3 text-sm font-semibold text-ink">몇 분이세요?</legend>
        <Stepper
          name="guests"
          label="인원"
          unit="명"
          value={guests}
          min={1}
          max={MAX_GUESTS}
          onChange={changeGuests}
          error={errors.guests}
        />
        <Stepper
          name="rooms"
          label="객실"
          unit="개"
          value={rooms}
          min={1}
          max={maxRooms}
          onChange={(n) => {
            setRooms(n);
            setErrors((e) => ({ ...e, rooms: undefined }));
          }}
          error={errors.rooms}
        />
      </fieldset>

      <button
        type="submit"
        className="w-full rounded-2xl bg-accent px-6 py-4 text-base font-semibold text-white transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.99]"
      >
        빈 객실 찾기
      </button>
    </Form>
  );
}

function DateField({
  id,
  label,
  value,
  min,
  max,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  min: string;
  max: string;
  onChange: (next: string) => void;
  error?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className="block rounded-2xl border border-line bg-white px-4 py-3 focus-within:border-accent"
      >
        <span className="block text-xs text-muted">{label}</span>
        {/* 모바일에서는 OS 기본 날짜 선택기가 열려 앱처럼 동작한다. */}
        <input
          id={id}
          name={id}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 w-full bg-transparent font-semibold text-ink outline-none"
        />
      </label>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
