import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  { name: 'Starter', price: '$499', features: ['Up to 5 users', 'Basic WMS features', 'Standard support'] },
  { name: 'Professional', price: '$1,499', features: ['Unlimited users', 'Customs Duty Engine', 'Priority support', 'API Access'] },
  { name: 'Enterprise', price: 'Custom', features: ['Siloed Database', 'Federated Learning', 'Dedicated Manager', 'SLA 99.99%'] },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Simple, transparent pricing.</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier) => (
          <div key={tier.name} className="rounded-3xl bg-white dark:bg-black/60 backdrop-blur-xl p-8 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col hover:border-blue-500 transition-colors">
            <h3 className="text-2xl font-bold">{tier.name}</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-extrabold">{tier.price}</span>
              {tier.price !== 'Custom' && <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>}
            </div>
            <ul className="mt-8 space-y-4 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Check className="h-5 w-5 text-blue-600 shrink-0" /> {feature}
                </li>
              ))}
            </ul>
            <Link href="/register" className="mt-8 w-full text-center rounded-full bg-slate-900 dark:bg-white px-4 py-3 text-sm font-medium text-white dark:text-slate-900 hover:bg-slate-800 transition-colors">Get Started</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
