"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Warehouse, Package, BarChart3, AlertTriangle, CheckCircle, Zap } from 'lucide-react'

export function WMSIntegration() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Warehouse Management</h3>
          <p className="text-muted-foreground">Sync with existing WMS for inventory and warehouse operations</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Configure WMS</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>WMS System Configuration</DialogTitle>
              <DialogDescription>
                Configure connection to your warehouse management system for inventory synchronization.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="connection" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="connection">Connection</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
              </TabsList>
              <TabsContent value="connection" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wms-provider">WMS Provider</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select WMS provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manhattan">Manhattan WMS</SelectItem>
                        <SelectItem value="highjump">HighJump</SelectItem>
                        <SelectItem value="redprairie">RedPrairie</SelectItem>
                        <SelectItem value="custom">Custom API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse-count">Warehouse Count</Label>
                    <Input id="warehouse-count" type="number" defaultValue="1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wms-endpoint">WMS API Endpoint</Label>
                  <Input id="wms-endpoint" placeholder="https://api.wms-provider.com/v1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wms-api-key">API Key</Label>
                    <Input id="wms-api-key" type="password" placeholder="Enter API key" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wms-client-secret">Client Secret</Label>
                    <Input id="wms-client-secret" type="password" placeholder="Enter client secret" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="inventory" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="real-time-inventory">Real-time Inventory Sync</Label>
                    <input type="checkbox" id="real-time-inventory" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="batch-updates">Batch Inventory Updates</Label>
                    <input type="checkbox" id="batch-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
                    <input type="checkbox" id="low-stock-alerts" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sync-frequency">Inventory Sync Frequency</Label>
                    <Select defaultValue="15min">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="5min">Every 5 minutes</SelectItem>
                        <SelectItem value="15min">Every 15 minutes</SelectItem>
                        <SelectItem value="1hour">Every hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="operations" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="picking-optimization">Picking Optimization</Label>
                    <input type="checkbox" id="picking-optimization" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slotting-optimization">Slotting Optimization</Label>
                    <input type="checkbox" id="slotting-optimization" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="labor-management">Labor Management</Label>
                    <input type="checkbox" id="labor-management" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operation-mode">Operation Mode</Label>
                    <Select defaultValue="hybrid">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full WMS Control</SelectItem>
                        <SelectItem value="hybrid">Hybrid Mode</SelectItem>
                        <SelectItem value="read-only">Read-only Sync</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Test Connection</Button>
              <Button>Save Configuration</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* WMS Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Accuracy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.7%</div>
            <p className="text-xs text-muted-foreground">Cycle count variance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Picking Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">142</div>
            <p className="text-xs text-muted-foreground">Lines per hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">7</div>
            <p className="text-xs text-muted-foreground">Items below threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Space Utilization</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84.3%</div>
            <p className="text-xs text-muted-foreground">Warehouse capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Zones Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Zones</CardTitle>
            <CardDescription>Current status of warehouse storage areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Zone A - Dry Goods</p>
                    <p className="text-sm text-muted-foreground">85% capacity</p>
                  </div>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Zone B - Refrigerated</p>
                    <p className="text-sm text-muted-foreground">72% capacity</p>
                  </div>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Zone C - Hazardous</p>
                    <p className="text-sm text-muted-foreground">91% capacity</p>
                  </div>
                </div>
                <Badge variant="outline">Warning</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent WMS Activity</CardTitle>
            <CardDescription>Latest warehouse operations and sync events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <Package className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Inventory sync completed</p>
                  <p className="text-xs text-muted-foreground">SKU-12345 → +50 units</p>
                </div>
                <span className="text-xs text-muted-foreground">2m ago</span>
              </div>
              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Picking route optimized</p>
                  <p className="text-xs text-muted-foreground">Reduced travel time by 15%</p>
                </div>
                <span className="text-xs text-muted-foreground">5m ago</span>
              </div>
              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Low stock alert</p>
                  <p className="text-xs text-muted-foreground">Item ABC-789 below reorder point</p>
                </div>
                <span className="text-xs text-muted-foreground">12m ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}