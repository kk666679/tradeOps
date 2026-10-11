'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/dashboard/page/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AILoadingState } from '@/components/common/ailoading-state'
import { AIErrorState } from '@/components/common/aierror-state'
import { useTradeOpsCreate } from '@/hooks/useTradeOpsCreate'

export type TradeOpsFieldConfig = {
  key: string
  label: string
  type?: 'text' | 'number' | 'select' | 'textarea'
  options?: string[]
  placeholder?: string
  defaultValue?: string
  required?: boolean
}

export interface TradeOpsCreatePageProps {
  resource: 'declarations' | 'documents' | 'permits' | 'tradeFinance'
  title: string
  description: string
  backHref: string
  fields: TradeOpsFieldConfig[]
  /** Where to redirect after a successful create. Defaults to backHref. */
  successHref?: string
}

export function TradeOpsCreatePage({ resource, title, description, backHref, fields, successHref }: TradeOpsCreatePageProps) {
  const router = useRouter()
  const { mutate, isLoading, isError, error, reset } = useTradeOpsCreate(resource)

  const [values, setValues] = React.useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const f of fields) init[f.key] = f.defaultValue ?? ''
    return init
  })
  const [formError, setFormError] = React.useState<string | null>(null)

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (formError) setFormError(null)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setFormError(null)
    const payload: Record<string, unknown> = {}
    for (const f of fields) {
      const v = values[f.key]
      if (v === '' || v === undefined) continue
      payload[f.key] = f.type === 'number' ? Number(v) : v
    }
    mutate(payload, {
      onSuccess: () => router.push(successHref ?? backHref),
      onError: (err: unknown) => setFormError(err instanceof Error ? err.message : 'Failed to create record'),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={backHref}>
            <ArrowLeft data-icon="inline-start" />Back
          </Link>
        </Button>
        <PageHeader title={title} description={description} />
      </div>
      <Card>
        <CardHeader><CardTitle>New record</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <AILoadingState message="Creating record…" />
          ) : (
            <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
              {fields.map((f) => (
                <div className="flex flex-col gap-1.5" key={f.key}>
                  <Label htmlFor={f.key}>
                    {f.label}
                    {f.required ? <span className="text-destructive"> *</span> : null}
                  </Label>
                  {f.type === 'textarea' ? (
                    <Textarea
                      id={f.key}
                      value={values[f.key]}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      rows={3}
                    />
                  ) : f.type === 'select' ? (
                    <Select value={values[f.key] || undefined} onValueChange={(v) => handleChange(f.key, v)}>
                      <SelectTrigger id={f.key}>
                        <SelectValue placeholder={f.placeholder ?? `Select ${f.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {f.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={f.key}
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={values[f.key]}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                    />
                  )}
                </div>
              ))}
              {(isError || formError) && (
                <div className="sm:col-span-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {formError ?? (error instanceof Error ? error.message : 'Failed to create record')}
                </div>
              )}
              <div className="flex items-center gap-2 sm:col-span-2">
                <Button type="submit" disabled={isLoading}>
                  <Save data-icon="inline-start" />Save
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={backHref}>Cancel</Link>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}