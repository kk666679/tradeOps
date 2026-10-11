"use client"
import * as React from "react"
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onCheckedChange?: (checked: boolean) => void
}
export function Checkbox({ onCheckedChange, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  )
}
export default Checkbox
