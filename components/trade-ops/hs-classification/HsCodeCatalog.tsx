'use client';

/**
 * HsCodeCatalog
 * Searchable, filterable catalogue of real-world HS (Harmonized System)
 * subheadings rendered from the WCO 2022 reference dataset.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { HS_CHAPTER_TITLES, formatHsCode, totalTaxRate, searchHsCodes } from './hs-code-data';

export interface HsCodeCatalogProps {
  /** Called when the user picks a row. */
  onSelect?: (code: string) => void;
  /** Height cap for the scroll area. */
  className?: string;
}

const KIND_STYLES: Record<string, string> = {
  PRODUCT: 'bg-blue-500/10 text-blue-600',
  MATERIAL: 'bg-emerald-500/10 text-emerald-600',
  EQUIPMENT: 'bg-violet-500/10 text-violet-600',
  PART: 'bg-amber-500/10 text-amber-600',
  RAW: 'bg-teal-500/10 text-teal-600',
  CONSUMABLE: 'bg-rose-500/10 text-rose-600',
};

function rateText(v: number): string {
  return v > 0 ? `${(v * 100).toFixed(v < 0.01 ? 1 : 0)}%` : '0%';
}

export function HsCodeCatalog({ onSelect, className }: HsCodeCatalogProps) {
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<string | null>(null);

  const rows = React.useMemo(() => searchHsCodes(query, 100), [query]);
  const selectedRow = rows.find((r) => r.code === selected) ?? null;

  const handleSelect = (code: string) => {
    setSelected(code);
    onSelect?.(code);
  };

  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-3">
        <Input
          placeholder="Search code, description or keyword…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
          aria-label="Search HS codes"
        />
        <span className="text-xs text-muted-foreground">
          {rows.length} result{rows.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ScrollArea className="h-[520px] rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="w-24">HS Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-20 text-right">Duty</TableHead>
                <TableHead className="w-20 text-right">SST</TableHead>
                <TableHead className="w-24">Flags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const active = row.code === selected;
                return (
                  <TableRow
                    key={row.code}
                    onClick={() => handleSelect(row.code)}
                    className={`cursor-pointer ${active ? 'bg-accent' : 'hover:bg-muted/50'}`}
                  >
                    <TableCell className="font-mono text-xs">{formatHsCode(row.code)}</TableCell>
                    <TableCell className="text-sm">
                      <span className="line-clamp-1">{row.description}</span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">{rateText(row.dutyRate)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{rateText(row.salesTaxRate)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {row.controlled ? <Badge variant="outline" className="text-[10px]">CTRL</Badge> : null}
                        {row.importQuota ? <Badge variant="outline" className="text-[10px]">QUOTA</Badge> : null}
                        {row.hazardous ? <Badge variant="outline" className="text-[10px]">HAZ</Badge> : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    No HS codes match “{query}”.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </ScrollArea>

        <aside className="rounded-md border p-4">
          {selectedRow ? (
            <div className="space-y-3">
              <div>
                <div className="font-mono text-lg font-semibold">{formatHsCode(selectedRow.code)}</div>
                <Badge className={KIND_STYLES[selectedRow.kind]}>{selectedRow.kind}</Badge>
              </div>
              <p className="text-sm">{selectedRow.description}</p>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-muted-foreground">Chapter</dt>
                  <dd className="font-medium">
                    {selectedRow.chapter} — {HS_CHAPTER_TITLES[selectedRow.chapter] ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Heading</dt>
                  <dd className="font-mono font-medium">{selectedRow.heading}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Import duty</dt>
                  <dd className="font-medium">{rateText(selectedRow.dutyRate)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Sales tax</dt>
                  <dd className="font-medium">{rateText(selectedRow.salesTaxRate)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Excise</dt>
                  <dd className="font-medium">{rateText(selectedRow.exciseRate)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Total incidence</dt>
                  <dd className="font-semibold text-primary">{rateText(totalTaxRate(selectedRow))}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">UoM</dt>
                  <dd className="font-medium">{selectedRow.uom}</dd>
                </div>
              </dl>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Keywords</div>
                <div className="flex flex-wrap gap-1">
                  {selectedRow.keywords.map((k) => (
                    <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>
                  ))}
                </div>
              </div>
              <Button size="sm" className="w-full" onClick={() => onSelect?.(selectedRow.code)}>
                Use this code
              </Button>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <span>Select an HS code to inspect duty, tax and control treatment.</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default HsCodeCatalog;
