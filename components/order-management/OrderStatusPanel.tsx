import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ClipboardList, Clock3, CheckCircle2 } from "lucide-react"

const milestones = [
  { label: "Confirmed", value: "128", tone: "text-emerald-600" },
  { label: "Processing", value: "32", tone: "text-amber-600" },
  { label: "Delayed", value: "4", tone: "text-rose-600" },
]

export function OrderStatusPanel() {
  return (
    <Card className="border border-slate-200/70 shadow-sm">
      <CardHeader className="px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Order Management</CardTitle>
            <CardDescription>Track order lifecycle, fulfillment status, and exception alerts.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 px-6 pb-6 text-slate-700 sm:grid-cols-3">
        {milestones.map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
            <p className={`mt-3 text-3xl font-bold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
