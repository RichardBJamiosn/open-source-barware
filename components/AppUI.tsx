"use client";

import React from "react";

// ── AppButton ──

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function AppButton({
  variant = "primary",
  children,
  className = "",
  ...props
}: AppButtonProps) {
  const base =
    "relative px-6 py-3 font-semibold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-copper hover:bg-copper-bright text-bg hover:shadow-[0_0_20px_rgba(205,127,50,0.3)]",
    secondary:
      "bg-transparent border border-copper/40 text-copper hover:border-copper hover:bg-copper/10",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// ── AppPanel ──

interface AppPanelProps {
  children: React.ReactNode;
  className?: string;
  withRivets?: boolean;
}

export function AppPanel({
  children,
  className = "",
  withRivets = true,
}: AppPanelProps) {
  return (
    <div className={`panel ${withRivets ? "rivets" : ""} p-6 ${className}`}>
      {children}
    </div>
  );
}

// ── AppInput ──

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function AppInput({
  label,
  className = "",
  id,
  ...props
}: AppInputProps) {
  const inputId = id || props.name || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs uppercase tracking-[0.15em] text-text-muted"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`bg-bg-warm border border-gear-border px-4 py-2.5 text-text placeholder:text-text-light/50 focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/40 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}

// ── AppSelect ──

interface AppSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function AppSelect({
  label,
  options,
  className = "",
  id,
  ...props
}: AppSelectProps) {
  const selectId = id || props.name || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs uppercase tracking-[0.15em] text-text-muted"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`appearance-none w-full bg-bg-warm border border-gear-border px-4 py-2.5 pr-10 text-text focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/40 transition-colors cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Dropdown chevron */}
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-copper/60"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </div>
    </div>
  );
}

// ── ProgressBar ──

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  label,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-text-muted uppercase tracking-[0.15em]">
            {label}
          </span>
          <span className="text-copper">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-2 bg-bg-warm border border-gear-border overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${clamped}%`,
            background:
              "linear-gradient(90deg, var(--copper-dark), var(--copper), var(--copper-bright))",
          }}
        />
      </div>
    </div>
  );
}

// ── StepIndicator ──

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isComplete = step < currentStep;

        return (
          <React.Fragment key={step}>
            {/* Node */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all
                  ${
                    isActive
                      ? "bg-copper border-copper-bright text-bg shadow-[0_0_12px_rgba(205,127,50,0.4)]"
                      : isComplete
                        ? "bg-copper/20 border-copper text-copper"
                        : "bg-bg-warm border-gear-border text-text-light"
                  }
                `}
              >
                {isComplete ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 7l3.5 3.5L12 4" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {labels?.[i] && (
                <span
                  className={`text-[10px] uppercase tracking-[0.12em] whitespace-nowrap ${
                    isActive
                      ? "text-copper"
                      : isComplete
                        ? "text-text-muted"
                        : "text-text-light"
                  }`}
                >
                  {labels[i]}
                </span>
              )}
            </div>

            {/* Pipe connector between nodes */}
            {step < totalSteps && (
              <div className="flex-1 mx-2 h-[2px] relative">
                <div className="absolute inset-0 bg-gear-border" />
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-500"
                  style={{
                    width: isComplete ? "100%" : "0%",
                    background:
                      "linear-gradient(90deg, var(--copper), var(--copper-bright))",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
