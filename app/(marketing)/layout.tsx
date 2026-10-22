import Navbar from "@/components/marketing/shell/Navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
