import type { ReactNode } from "react";
import { BrokerageNav } from "./_components";

export const metadata = {
  title: "Brokerage · TradeOps",
  description:
    "Customs brokerage operations — Section 90 accreditation, declarations, clients, audit, and governance.",
};

export default function BrokerageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-[var(--bg)]">
      <BrokerageNav />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
