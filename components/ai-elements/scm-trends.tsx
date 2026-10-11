"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AIFeaturesCard, type AIFeature } from '@common/aifeatures-card'
import { BrainCircuit, Shield, Zap, Eye, Activity, ShieldAlert, Leaf, Lock, BarChart4 } from 'lucide-react'

const scmFeatures: AIFeature[] = [
  {
    id: '1',
    title: 'AI-driven Autonomous Decision-Making',
    description: 'Agentic AI evaluates suppliers, runs procurement, manages contracts autonomously.',
    icon: <BrainCircuit className="h-5 w-5" />,
    status: 'active',
    priority: 'critical',
    progress: 87,
    metrics: [{ label: 'Adoption', value: '+47%', trend: 47 }],
    tags: ['Agentic', 'Autonomous', 'Procurement'],
  },
  {
    id: '2',
    title: 'Real-time Visibility & IoT',
    description: 'End-to-end visibility with IoT sensors and connected data platforms.',
    icon: <Eye className="h-5 w-5" />,
    status: 'active',
    priority: 'high',
    progress: 98,
    metrics: [{ label: 'Uptime', value: '98%', trend: 2 }],
    tags: ['IoT', 'Live', 'Tracking'],
  },
  {
    id: '3',
    title: 'Digital Twins & Simulation',
    description: 'Virtual supply chain models for disruption simulation and strategy testing.',
    icon: <Activity className="h-5 w-5" />,
    status: 'active',
    priority: 'high',
    progress: 72,
    tags: ['Digital Twin', 'Simulation', 'Predictive'],
  },
  {
    id: '4',
    title: 'Smart Warehouse Automation',
    description: 'Robot-centric operations with AI-controlled warehouses.',
    icon: <Zap className="h-5 w-5" />,
    status: 'training',
    priority: 'medium',
    progress: 60,
    metrics: [{ label: 'Throughput', value: '+32%', trend: 32 }],
    tags: ['Automation', 'Robotics'],
  },
  {
    id: '5',
    title: 'Supply Chain Resilience',
    description: 'Multi-sourcing, nearshoring, scenario planning for disruptions.',
    icon: <Shield className="h-5 w-5" />,
    status: 'active',
    priority: 'critical',
    progress: 100,
    tags: ['Resilience', 'Risk', 'Nearshoring'],
  },
  {
    id: '6',
    title: 'Sustainability & ESG',
    description: 'Carbon footprint tracking, ethical sourcing, supplier compliance.',
    icon: <Leaf className="h-5 w-5" />,
    status: 'active',
    priority: 'medium',
    progress: 65,
    tags: ['ESG', 'Carbon', 'Compliance'],
  },
  {
    id: '7',
    title: 'Advanced Predictive Analytics',
    description: 'ML for demand, inventory, risk with external data integration.',
    icon: <BarChart4 className="h-5 w-5" />,
    status: 'active',
    priority: 'high',
    progress: 94,
    metrics: [{ label: 'Accuracy', value: '94%', trend: 2 }],
    tags: ['ML', 'Forecasting', 'Analytics'],
  },
  {
    id: '8',
    title: 'Cybersecurity Integration',
    description: 'Risk monitoring, real-time alerts, compliance tracking.',
    icon: <Lock className="h-5 w-5" />,
    status: 'active',
    priority: 'high',
    progress: 100,
    tags: ['Security', 'Compliance', 'Monitoring'],
  },
]

interface ScmTrendsProps {
  className?: string
}

export function ScmTrends({ className }: ScmTrendsProps) {
  return (
    <div className={className}>
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl pb-6">
          <CardTitle className="text-2xl flex items-center gap-3">
            🚀 SCM 2026: Top Features & Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AIFeaturesCard
            title="Active SCM Capabilities"
            description="AI-powered features driving your 2026 supply chain strategy"
            features={scmFeatures}
            maxFeatures={4}
            showControls={false}
          />

          <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Strategic Pillars</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Digital', sub: 'AI, data, automation', color: 'text-indigo-600' },
                { label: 'Predictive', sub: 'Forecasting, simulations', color: 'text-purple-600' },
                { label: 'Resilient', sub: 'Flexible sourcing, risk planning', color: 'text-emerald-600' },
                { label: 'Strategic', sub: 'Total business value', color: 'text-cyan-600' },
              ].map((p) => (
                <div key={p.label} className="p-4 bg-white rounded-xl shadow-sm border text-center">
                  <div className={`text-xl font-bold ${p.color}`}>{p.label}</div>
                  <p className="text-xs text-slate-600 mt-1">{p.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
