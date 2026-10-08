"use client";

import type { ReactNode } from "react";

type StepperProps = {
  /** 폼 제출 시 쓰일 이름 (hidden input) */
  name: string;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  error?: string;
};

/** 인원·객실 수처럼 작은 정수를 +/- 버튼으로 고르는 입력 */
export function Stepper({ name, label, unit, value, min, max, onChange, error }: StepperProps) {
  const labelId = `${name}-label`;
  const errorId = `${name}-error`;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3">
        <span id={labelId} className="text-sm font-medium text-ink">
          {label}
        </span>

        <div
          role="group"
          aria-labelledby={labelId}
          aria-describedby={error ? errorId : undefined}
          className="flex items-center gap-3"
        >
          <StepButton
            label={`${label} 줄이기`}
            disabled={value <= min}
            onClick={() => onChange(value - 1)}
          >
            −
          </StepButton>
          <output aria-live="polite" className="w-12 text-center tabular-nums font-semibold">
            {value}
            <span className="ml-0.5 text-sm font-normal text-muted">{unit}</span>
          </output>
          <StepButton
            label={`${label} 늘리기`}
            disabled={value >= max}
            onClick={() => onChange(value + 1)}
          >
            +
          </StepButton>
        </div>

        <input type="hidden" name={name} value={value} />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full border border-line text-lg leading-none text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line"
    >
      {children}
    </button>
  );
}
