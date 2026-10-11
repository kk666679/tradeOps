"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Truck, MapPin, Clock, Route, Navigation, AlertCircle } from 'lucide-react'

export function TMSIntegration() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Transportation Management</h3>
          <p className="text-muted-foreground">Connect with TMS for shipment tracking and logistics optimization</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Configure TMS</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>TMS System Configuration</DialogTitle>
              <DialogDescription>
                Configure connection to your transportation management system for real-time shipment tracking.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="connection" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="connection">Connection</TabsTrigger>
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
                <TabsTrigger value="routes">Routes</TabsTrigger>
              </TabsList>
              <TabsContent value="connection" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tms-provider">TMS Provider</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select TMS provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sap-tm">SAP TM</SelectItem>
                        <SelectItem value="oracle-tms">Oracle TMS</SelectItem>
                        <SelectItem value="jda">JDA TMS</SelectItem>
                        <SelectItem value="custom">Custom API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-version">API Version</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select API version" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">v1.0</SelectItem>
                        <SelectItem value="v2">v2.0</SelectItem>
                        <SelectItem value="latest">Latest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tms-endpoint">TMS API Endpoint</Label>
                  <Input id="tms-endpoint" placeholder="https://api.tms-provider.com/v2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tms-username">Username</Label>
                    <Input id="tms-username" placeholder="TMS username" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tms-password">Password</Label>
                    <Input id="tms-password" type="password" placeholder="TMS password" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tracking" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="real-time-tracking">Real-time Tracking</Label>
                    <input type="checkbox" id="real-time-tracking" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="eta-updates">ETA Updates</Label>
                    <input type="checkbox" id="eta-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="delay-alerts">Delay Alerts</Label>
                    <input type="checkbox" id="delay-alerts" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="update-frequency">Update Frequency</Label>
                    <Select defaultValue="5min">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1min">Every minute</SelectItem>
                        <SelectItem value="5min">Every 5 minutes</SelectItem>
                        <SelectItem value="15min">Every 15 minutes</SelectItem>
                        <SelectItem value="1hour">Every hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="routes" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="route-optimization">Route Optimization</Label>
                    <input type="checkbox" id="route-optimization" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="multi-stop">Multi-stop Routes</Label>
                    <input type="checkbox" id="multi-stop" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="optimization-criteria">Optimization Criteria</Label>
                    <Select defaultValue="time">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="time">Minimize Time</SelectItem>
                        <SelectItem value="cost">Minimize Cost</SelectItem>
                        <SelectItem value="distance">Minimize Distance</SelectItem>
                        <SelectItem value="emissions">Minimize Emissions</SelectItem>
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

      {/* TMS Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">12 en route</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transit Time</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-muted-foreground">-0.2 days from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Route Efficiency</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">87%</div>
            <p className="text-xs text-muted-foreground">Optimized routes</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Shipments</CardTitle>
          <CardDescription>Real-time tracking of current transportation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4 p-3 border-b font-medium text-sm">
              <div>Shipment ID</div>
              <div>Origin</div>
              <div>Destination</div>
              <div>Status</div>
              <div>ETA</div>
              <div>Actions</div>
            </div>
            <div className="grid grid-cols-6 gap-4 p-3 border-b">
              <div className="font-medium">TMS-2024-001</div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Port of LA
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Chicago, IL
              </div>
              <Badge variant="default">In Transit</Badge>
              <div>2h 15m</div>
              <Button variant="outline" size="sm">Track</Button>
            </div>
            <div className="grid grid-cols-6 gap-4 p-3 border-b">
              <div className="font-medium">TMS-2024-002</div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Miami, FL
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dallas, TX
              </div>
              <Badge variant="secondary">Loading</Badge>
              <div>6h 30m</div>
              <Button variant="outline" size="sm">Track</Button>
            </div>
            <div className="grid grid-cols-6 gap-4 p-3 border-b">
              <div className="font-medium">TMS-2024-003</div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Seattle, WA
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Denver, CO
              </div>
              <Badge variant="destructive">Delayed</Badge>
              <div>4h 45m</div>
              <Button variant="outline" size="sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                Alert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}