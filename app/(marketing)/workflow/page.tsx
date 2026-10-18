import { ArrowRight, Check, Clock, Shield, Zap } from "lucide-react";

export default function WorkflowPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">Built-in Trade Workflows.</h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Pre-configured flows for Free Zone and CFS operations, from gate-in to final declaration.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        {[
          {
            icon: <Check className="w-12 h-12" />,
            title: "Bonded Trade",
            description:
              "End-to-end FIZ → FCZ flow: physical movement, document flow, bonded-ledger events, and exception handling across six modules.",
          },
          {
            icon: <Shield className="w-12 h-12" />,
            title: "Customs Compliance",
            description:
              "HS code classification, duty and tax calculation, permit checks, and audit trails that keep every shipment regulation-ready.",
          },
          {
            icon: <Clock className="w-12 h-12" />,
            title: "Approvals & Escalations",
            description:
              "Multi-stage approval routing with SLA tracking, escalation queues, and status visibility for compliance officers and zone managers.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-black/60 dark:backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl flex flex-col gap-4"
          >
            <div className="bg-blue-50 dark:bg-blue-500/20 p-4 rounded-2xl text-blue-600 dark:text-blue-400">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-black/60 dark:backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">How it works</h2>
        <ol className="space-y-6 md:flex md:gap-8">
          {[
            { step: 1, title: "Cargo arrival", icon: <Zap className="w-6 h-6" />, text: "Gate-in recorded with weighbridge and ANPR data; shipment enters the workflow." },
            { step: 2, title: "Document intake", icon: <Check className="w-6 h-6" />, text: "AI agents ingest packing lists, invoices, and permits for compliance risk detection." },
            { step: 3, title: "Classification", icon: <Shield className="w-6 h-6" />, text: "HS codes, duty, and tax are calculated automatically with full audit trails." },
            { step: 4, title: "Approval", icon: <Clock className="w-6 h-6" />, text: "Multi-stage routing with SLA tracking and escalation until the declaration is cleared." },
            { step: 5, title: "Release", icon: <ArrowRight className="w-6 h-6" />, text: "Cargo is released or moved under bond with bonded-ledger events logged end-to-end." },
          ].map((step) => (
            <li
              key={step.step}
              className="flex gap-4 items-start md:min-w-0"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                {step.step}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{step.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
