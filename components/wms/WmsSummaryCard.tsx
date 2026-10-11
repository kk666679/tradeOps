import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Clock3, CheckCircle2 } from "lucide-react"

export function WmsSummaryCard() {
  return (
    <Card className="border border-slate-200/70 shadow-sm">
      <CardHeader className="px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">WMS Summary</CardTitle>
            <CardDescription>Track inventory, throughput, and cycle performance in a single view.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 px-6 pb-6 text-slate-700 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Stock Levels</p>
          <p className="mt-3 text-3xl font-bold">12.4K</p>
          <Badge variant="secondary" className="mt-2">Stable</Badge>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Cycle Time</p>
          <p className="mt-3 text-3xl font-bold">2.8h</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <Clock3 className="h-4 w-4" /> On target
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Fulfillment</p>
          <p className="mt-3 text-3xl font-bold">98%</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4" /> High accuracy
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
