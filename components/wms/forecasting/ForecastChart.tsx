"use client"

import { AIChartContainer } from '@common/aichart-container'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const forecastData = [
  { week: 'W1', predicted: 1240, actual: 1220 },
  { week: 'W2', predicted: 1310, actual: 1295 },
  { week: 'W3', predicted: 1380, actual: 1360 },
  { week: 'W4', predicted: 1420, actual: null },
  { week: 'W5', predicted: 1390, actual: null },
  { week: 'W6', predicted: 1450, actual: null },
]

export function ForecastChart() {
  return (
    <AIChartContainer
      title="30-Day Demand Forecast"
      description="Predicted vs actual cargo volume"
      metrics={[
        { label: 'Predicted', value: 'predicted', color: '#6366f1' },
        { label: 'Actual', value: 'actual', color: '#10b981' },
      ]}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={forecastData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="predicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="actual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="predicted" stroke="#6366f1" fill="url(#predicted)" strokeWidth={2} name="Predicted" />
          <Area type="monotone" dataKey="actual" stroke="#10b981" fill="url(#actual)" strokeWidth={2} name="Actual" connectNulls={false} />
        </AreaChart>
      </ResponsiveContainer>
    </AIChartContainer>
  )
}
