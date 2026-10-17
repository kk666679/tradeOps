"use client";

import {
  Activity,
  Box,
  Cpu,
  Factory,
  Globe,
  Hexagon,
  ShieldCheck,
  Truck,
  Zap,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

const iconMap: Record<string, ComponentType<LucideProps>> = {
  ShieldCheck,
  Truck,
  Factory,
  Box,
  Hexagon,
  Cpu,
  Globe,
  Zap,
  Activity,
};

export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = iconMap[name] ?? Box;
  return <Icon {...props} />;
}
