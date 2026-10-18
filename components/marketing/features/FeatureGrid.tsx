import Link from "next/link";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export type FeatureGridItem = {
  title: string;
  description: string;
  href?: string;
  iconName?: string;
};

export function FeatureGrid({ features }: { features: FeatureGridItem[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {features.map((feature, i) => (
          <Link key={i} href={feature.href || "#"} className="group relative rounded-3xl bg-white/[0.02] border border-white/5 p-6 sm:p-8 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-6 group-hover:scale-110 transition-transform">
            <DynamicIcon name={feature.iconName ?? "Box"} className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
        </Link>
      ))}
    </div>
  );
}

export default FeatureGrid;
