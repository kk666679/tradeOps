import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProgressBar } from './ProgressBar'
import { MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Shipment {
  id: string
  origin: string
  destination: string
  status: string
  progress: number
  eta: string
  iotEnabled?: boolean
  currentLocation?: string
}

interface ShipmentCardProps {
  shipment: Shipment
  className?: string
}

export function ShipmentCard({ shipment, className }: ShipmentCardProps) {
  return (
    <Card className={cn("border border-slate-200 rounded-lg hover:shadow-md transition", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium text-slate-950">{shipment.id}</p>
            <p className="text-sm text-slate-600">
              <MapPin className="inline h-3 w-3 mr-1" />
              {shipment.origin} → {shipment.destination}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={
              shipment.status === 'In Transit'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }
          >
            {shipment.status}
          </Badge>
        </div>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-600">Progress</span>
            <span className="text-xs text-slate-500">{shipment.progress}%</span>
          </div>
          <ProgressBar progress={shipment.progress} color="from-blue-500 to-cyan-500" />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-500">
            <Clock className="inline h-3 w-3 mr-1" />
            ETA: {shipment.eta}
          </p>
          <Button variant="ghost" size="sm">
            Track →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
