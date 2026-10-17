"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="font-mono text-3xl text-red-400 opacity-60">✕</div>
      <h2 className="text-[16px] font-semibold text-[var(--text)]">
        Something went wrong
      </h2>
      <p className="max-w-md text-[13px] leading-relaxed text-[var(--text-secondary)]">
        {error.message || "An unexpected error occurred while loading the brokerage module."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-emerald-500 px-4 py-2 font-mono text-[12px] font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
      >
        Try again
      </button>
    </div>
  );
}
