import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const operations = [
  { label: "Inbound Container", status: "Ready" },
  { label: "Outbound Load", status: "Pending" },
  { label: "Stock Audit", status: "In progress" },
]

export function WmsOperationsPanel() {
  return (
    <Card className="border border-slate-200/70 shadow-sm">
      <CardHeader className="px-6 py-6">
        <CardTitle className="text-lg font-semibold">Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6">
        {operations.map((operation) => (
          <div key={operation.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
            <div>
              <p className="font-semibold text-slate-950">{operation.label}</p>
              <p className="text-sm text-slate-600">{operation.status}</p>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
