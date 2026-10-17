import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="font-mono text-3xl text-[var(--text-muted)] opacity-40">◇</div>
      <h2 className="text-[16px] font-semibold text-[var(--text)]">
        Not found
      </h2>
      <p className="max-w-md text-[13px] leading-relaxed text-[var(--text-secondary)]">
        The brokerage resource you requested does not exist or you do not have access to it.
      </p>
      <Link
        href="/brokerage"
        className="rounded-md bg-emerald-500 px-4 py-2 font-mono text-[12px] font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
      >
        Back to overview
      </Link>
    </div>
  );
}
