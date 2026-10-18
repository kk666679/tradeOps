export default function CustomersPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-center">Trusted by Zone Operators</h1>
      <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-16 text-center max-w-2xl mx-auto">
        Free Zones and CFS operators worldwide rely on TradeOps for compliant, efficient trade operations.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-black/60 dark:backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl flex items-center justify-center min-h-[110px] sm:min-h-[120px]"
          >
            <span className="text-sm sm:text-base text-slate-400">Customer {i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
