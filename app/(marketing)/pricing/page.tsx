import { Pricing } from "@/components/marketing/pricing/Pricing";
import { FAQ } from "@/components/marketing/faq/FAQ";

const faqItems = [
  {
    q: "How quickly can we launch a zone deployment?",
    a: "Most single-zone rollouts go live in 2–4 weeks with data migration, workflow config, and user onboarding.",
  },
  {
    q: "Does TradeOps support multi-tenant operations?",
    a: "Yes. The platform is designed for isolated tenant data, shared infrastructure, and per-tenant policy controls.",
  },
  {
    q: "Can this integrate with customs and warehouse systems?",
    a: "TradeOps supports ERP, WMS, scanner, weighbridge, smart-contract, and document workflows through structured integrations.",
  },
];

export default function PricingPage() {
  return (
    <div className="w-full">
      <Pricing />
      <div className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <FAQ items={faqItems} />
      </div>
    </div>
  );
}
