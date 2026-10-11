"use client"
import * as React from "react"
export interface PricingCardProps {
  name?: string
  price?: number | string
  features?: string[]
  highlighted?: boolean
}
export function PricingCard({ name, price, features = [] }: PricingCardProps) {
  return (
    <div className="rounded border p-4">
      <h3 className="font-semibold">{name}</h3>
      <p className="text-2xl">{price}</p>
      <ul>{features.map((f, i) => <li key={i}>{f}</li>)}</ul>
    </div>
  )
}
export default PricingCard
