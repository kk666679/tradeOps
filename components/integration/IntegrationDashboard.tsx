"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Settings, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface IntegrationCardProps {
  title: string
  description: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  onToggle: (enabled: boolean) => void
  onConfigure: () => void
  onSync: () => void
}

function IntegrationCard({
  title,
  description,
  status,
  lastSync,
  onToggle,
  onConfigure,
  onSync
}: IntegrationCardProps) {
  const [enabled, setEnabled] = useState(status === 'connected')

  const statusConfig = {
    connected: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      badge: 'Connected',
      badgeVariant: 'default' as const
    },
    disconnected: {
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      badge: 'Disconnected',
      badgeVariant: 'secondary' as const
    },
    error: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      badge: 'Error',
      badgeVariant: 'destructive' as const
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  const handleToggle = (checked: boolean) => {
    setEnabled(checked)
    onToggle(checked)
  }

  return (
    <Card className={`border-2 ${config.borderColor} ${config.bgColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${config.color}`} />
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
          </div>
          <Badge variant={config.badgeVariant}>{config.badge}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Enable Integration</span>
          <Switch checked={enabled} onCheckedChange={handleToggle} />
        </div>

        {lastSync && (
          <div className="text-xs text-muted-foreground">
            Last sync: {lastSync}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onConfigure}>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="sm" onClick={onSync}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ERPIntegration() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error'>('connected')

  const handleToggle = (enabled: boolean) => {
    setStatus(enabled ? 'connected' : 'disconnected')
  }

  const handleConfigure = () => {
    // console.log('Configure ERP integration')
  }

  const handleSync = () => {
    // console.log('Sync ERP data')
  }

  return (
    <IntegrationCard
      title="ERP System"
      description="Integrate with SAP, Oracle, or Microsoft Dynamics for order management and financial data"
      status={status}
      lastSync="2 hours ago"
      onToggle={handleToggle}
      onConfigure={handleConfigure}
      onSync={handleSync}
    />
  )
}

export function TMSIntegration() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error'>('connected')

  const handleToggle = (enabled: boolean) => {
    setStatus(enabled ? 'connected' : 'disconnected')
  }

  const handleConfigure = () => {
    // console.log('Configure TMS integration')
  }

  const handleSync = () => {
    // console.log('Sync TMS data')
  }

  return (
    <IntegrationCard
      title="Transportation Management"
      description="Connect with TMS providers for shipment tracking and route optimization"
      status={status}
      lastSync="30 minutes ago"
      onToggle={handleToggle}
      onConfigure={handleConfigure}
      onSync={handleSync}
    />
  )
}

export function WMSIntegration() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error'>('error')

  const handleToggle = (enabled: boolean) => {
    setStatus(enabled ? 'connected' : 'disconnected')
  }

  const handleConfigure = () => {
    // console.log('Configure WMS integration')
  }

  const handleSync = () => {
    // console.log('Sync WMS data')
  }

  return (
    <IntegrationCard
      title="Warehouse Management"
      description="Sync with existing WMS for inventory levels and warehouse operations"
      status={status}
      lastSync="Failed - API timeout"
      onToggle={handleToggle}
      onConfigure={handleConfigure}
      onSync={handleSync}
    />
  )
}