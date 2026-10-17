import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 md:py-16 transition-colors">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold">TradeOps</span>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">The multi-tenant warehouse and customs platform for modern logistics.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/product" className="hover:text-blue-600 dark:hover:text-blue-400">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
