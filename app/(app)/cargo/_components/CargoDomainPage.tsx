'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BulkCargoForm } from '@/components/cargo/bulk/BulkCargoForm';
import { BulkCargoList } from '@/components/cargo/bulk/BulkCargoList';
import { DryCargoForm } from '@/components/cargo/bulk/dry/DryCargoForm';
import { DryCargoList } from '@/components/cargo/bulk/dry/DryCargoList';
import { LiquidCargoForm } from '@/components/cargo/bulk/liquid/LiquidCargoForm';
import { LiquidCargoList } from '@/components/cargo/bulk/liquid/LiquidCargoList';
import { CargoForm } from '@/components/cargo/core/CargoForm';
import { CargoList, type CargoListRow } from '@/components/cargo/core/CargoList';
import { FczBreakBulkForm } from '@/components/cargo/fcz/FczBreakBulkForm';
import { FczReexportForm } from '@/components/cargo/fcz/FczReexportForm';
import { FczRepackagingForm } from '@/components/cargo/fcz/FczRepackagingForm';
import { FczTranshipmentForm } from '@/components/cargo/fcz/FczTranshipmentForm';
import { FczTranshipmentList } from '@/components/cargo/fcz/FczTranshipmentList';
import { FizFinishedGoodsList } from '@/components/cargo/fiz/FizFinishedGoodsList';
import { FizMachineryForm } from '@/components/cargo/fiz/FizMachineryForm';
import { FizRawMaterialForm } from '@/components/cargo/fiz/FizRawMaterialForm';
import { FizRawMaterialList } from '@/components/cargo/fiz/FizRawMaterialList';
import { HazmatCargoForm } from '@/components/cargo/hazmat/HazmatCargoForm';
import { HazmatCargoList } from '@/components/cargo/hazmat/HazmatCargoList';
import { HazmatSegregationView } from '@/components/ai-composites/cargo/hazmat-segregation-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

interface CargoRecord {
  id: string;
  ref: string;
  kind: string;
  status: string;
  description: string | null;
  hazmat: boolean;
  zoneId: string | null;
  metadata: unknown;
}

export type CargoDomainPageKey =
  | 'analytics'
  | 'bulk'
  | 'bulk-break-bulk'
  | 'bulk-containerized'
  | 'bulk-dry'
  | 'bulk-liquid'
  | 'detail'
  | 'fcz'
  | 'fcz-break-bulk'
  | 'fcz-reexport'
  | 'fcz-repackaging'
  | 'fcz-transhipment'
  | 'fiz'
  | 'fiz-finished-goods'
  | 'fiz-machinery'
  | 'fiz-raw-materials'
  | 'hazmat'
  | 'hazmat-segregation'
  | 'new';

interface CargoDomainPageProps {
  page: CargoDomainPageKey;
  id?: string;
}

const pageDetails: Record<Exclude<CargoDomainPageKey, 'detail'>, { title: string; description: string }> = {
  analytics: { title: 'Cargo Analytics', description: 'Operational summary calculated from cargo records.' },
  bulk: { title: 'Bulk Cargo', description: 'Bulk cargo records and operations.' },
  'bulk-break-bulk': { title: 'Bulk Break Bulk', description: 'Record and review break-bulk cargo.' },
  'bulk-containerized': { title: 'Containerized Cargo', description: 'Containerized cargo records and operations.' },
  'bulk-dry': { title: 'Dry Bulk Cargo', description: 'Record and review dry bulk cargo.' },
  'bulk-liquid': { title: 'Liquid Bulk Cargo', description: 'Record and review liquid bulk cargo.' },
  fcz: { title: 'Free Commercial Zone (FCZ)', description: 'FCZ cargo records and operations.' },
  'fcz-break-bulk': { title: 'FCZ Break Bulk', description: 'Record and review FCZ break-bulk cargo.' },
  'fcz-reexport': { title: 'FCZ Re-export', description: 'Record and review FCZ re-export cargo.' },
  'fcz-repackaging': { title: 'FCZ Repackaging', description: 'Record and review FCZ repackaging cargo.' },
  'fcz-transhipment': { title: 'FCZ Transhipment', description: 'Record and review FCZ transhipment cargo.' },
  fiz: { title: 'Free Industrial Zone (FIZ)', description: 'FIZ cargo records and operations.' },
  'fiz-finished-goods': { title: 'FIZ Finished Goods', description: 'Finished goods cargo records.' },
  'fiz-machinery': { title: 'FIZ Machinery', description: 'Record machinery cargo imports.' },
  'fiz-raw-materials': { title: 'FIZ Raw Materials', description: 'Record and review raw material cargo.' },
  hazmat: { title: 'Hazmat Cargo', description: 'Hazardous cargo records and operations.' },
  'hazmat-segregation': { title: 'Hazmat Segregation', description: 'Review hazardous cargo segregation.' },
  new: { title: 'New Cargo', description: 'Create a cargo record.' },
};

const formKindByPage: Partial<Record<CargoDomainPageKey, string>> = {
  'bulk-break-bulk': 'BREAK_BULK',
  'bulk-containerized': 'CONTAINERIZED',
  'bulk-dry': 'DRY_BULK',
  'bulk-liquid': 'LIQUID_BULK',
  'fcz-break-bulk': 'BREAK_BULK',
  'fcz-reexport': 'GENERAL',
  'fcz-repackaging': 'GENERAL',
  'fcz-transhipment': 'GENERAL',
  'fiz-machinery': 'GENERAL',
  'fiz-raw-materials': 'GENERAL',
  'fiz-finished-goods': 'GENERAL',
  hazmat: 'HAZMAT',
};

const cargoKinds = new Set([
  'GENERAL',
  'BULK',
  'DRY_BULK',
  'LIQUID_BULK',
  'BREAK_BULK',
  'CONTAINERIZED',
  'HAZMAT',
]);

function getRows(records: CargoRecord[]): CargoListRow[] {
  return records.map((record) => ({
    id: record.id,
    ref: record.ref,
    status: record.status,
    zone: recordZone(record),
    meta: record.description ?? metadataSummary(record.metadata),
  }));
}

function metadataSummary(metadata: unknown) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return undefined;
  const values = (metadata as { values?: unknown }).values;
  if (!values || typeof values !== 'object' || Array.isArray(values)) return undefined;
  const { hs, qty } = values as { hs?: unknown; qty?: unknown };
  const details = [
    typeof hs === 'string' && hs ? `HS ${hs}` : undefined,
    typeof qty === 'string' && qty ? `Qty ${qty}` : undefined,
  ].filter(Boolean);
  return details.length ? details.join(' · ') : undefined;
}

function metadataFields(record: CargoRecord) {
  if (!record.metadata || typeof record.metadata !== 'object' || Array.isArray(record.metadata)) return {};
  return record.metadata as { form?: unknown; values?: unknown };
}

function recordZone(record: CargoRecord): 'FIZ' | 'FCZ' | undefined {
  const { values } = metadataFields(record);
  if (!values || typeof values !== 'object' || Array.isArray(values)) return undefined;
  const zone = (values as { zone?: unknown }).zone;
  return zone === 'FIZ' || zone === 'FCZ' ? zone : undefined;
}

function matchesForm(record: CargoRecord, form: CargoDomainPageKey) {
  return metadataFields(record).form === form;
}

function recordsForPage(records: CargoRecord[], page: CargoDomainPageKey) {
  switch (page) {
    case 'fiz':
      return records.filter((record) => recordZone(record) === 'FIZ');
    case 'fcz':
      return records.filter((record) => recordZone(record) === 'FCZ');
    case 'fiz-raw-materials':
    case 'fiz-machinery':
    case 'fiz-finished-goods':
      return records.filter((record) => matchesForm(record, page) && recordZone(record) === 'FIZ');
    case 'fcz-break-bulk':
    case 'fcz-reexport':
    case 'fcz-repackaging':
    case 'fcz-transhipment':
      return records.filter((record) => matchesForm(record, page) && recordZone(record) === 'FCZ');
    case 'hazmat':
    case 'hazmat-segregation':
      return records.filter((record) => record.kind === 'HAZMAT' || record.hazmat);
    case 'bulk':
      return records.filter((record) => ['BULK', 'DRY_BULK', 'LIQUID_BULK', 'BREAK_BULK', 'CONTAINERIZED'].includes(record.kind));
    case 'bulk-break-bulk':
      return records.filter((record) => record.kind === 'BREAK_BULK');
    case 'bulk-containerized':
      return records.filter((record) => record.kind === 'CONTAINERIZED');
    case 'bulk-dry':
      return records.filter((record) => record.kind === 'DRY_BULK');
    case 'bulk-liquid':
      return records.filter((record) => record.kind === 'LIQUID_BULK');
    default:
      return records;
  }
}

export function CargoDomainPage({ page, id }: CargoDomainPageProps) {
  const utils = trpc.useUtils();
  const queryEnabled = page !== 'new' && page !== 'detail';
  const cargoQuery = trpc.cargo.main.list.useQuery({ take: 100 }, { enabled: queryEnabled });
  const detailQuery = trpc.cargo.main.byId.useQuery(
    { id: id ?? '' },
    { enabled: page === 'detail' && Boolean(id) },
  );
  const createCargo = trpc.cargo.main.create.useMutation({
    onSuccess: async () => {
      await utils.cargo.main.list.invalidate();
    },
  });
  const [submitError, setSubmitError] = useState<string>();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const allRecords = (cargoQuery.data ?? []) as CargoRecord[];
  const records = recordsForPage(allRecords, page);
  const rows = getRows(records);

  async function handleSubmit(values: Record<string, unknown>) {
    const ref = String(values.ref ?? '').trim();
    if (!ref) {
      setSubmitError('Enter a cargo reference before saving.');
      setSubmitSuccess(false);
      return;
    }

    setSubmitError(undefined);
    setSubmitSuccess(false);
    const kindValue = page === 'new' ? String(values.kind ?? 'GENERAL') : formKindByPage[page] ?? 'GENERAL';
    const kind = cargoKinds.has(kindValue) ? kindValue : 'GENERAL';
    const description = typeof values.description === 'string' ? values.description.trim() || null : null;
    const routeZone = page.startsWith('fiz-') ? 'FIZ' : page.startsWith('fcz-') ? 'FCZ' : undefined;
    const formValues = {
      ...values,
      ...(typeof values.zone === 'string' && values.zone ? {} : routeZone ? { zone: routeZone } : {}),
    };

    try {
      await createCargo.mutateAsync({
        ref,
        kind,
        description,
        hazmat: page === 'hazmat' || kind === 'HAZMAT',
        metadata: JSON.parse(JSON.stringify({ form: page, values: formValues })),
      });
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not save the cargo record.');
    }
  }

  function renderForm() {
    const props = { onSubmit: handleSubmit, submitting: createCargo.isPending };
    switch (page) {
      case 'new':
        return <CargoForm {...props} />;
      case 'bulk-break-bulk':
        return <BulkCargoForm {...props} initial={{ zone: '' }} />;
      case 'fcz-break-bulk':
        return <FczBreakBulkForm {...props} zone="FCZ" />;
      case 'bulk-containerized':
        return <BulkCargoForm {...props} initial={{ zone: '' }} />;
      case 'bulk-dry':
        return <DryCargoForm {...props} initial={{ zone: '' }} />;
      case 'bulk-liquid':
        return <LiquidCargoForm {...props} initial={{ zone: '' }} />;
      case 'fcz-reexport':
        return <FczReexportForm {...props} zone="FCZ" />;
      case 'fcz-repackaging':
        return <FczRepackagingForm {...props} zone="FCZ" />;
      case 'fcz-transhipment':
        return <FczTranshipmentForm {...props} zone="FCZ" />;
      case 'fiz-machinery':
        return <FizMachineryForm {...props} zone="FIZ" />;
      case 'fiz-raw-materials':
        return <FizRawMaterialForm {...props} zone="FIZ" />;
      case 'fiz-finished-goods':
        return <CargoForm {...props} initial={{ kind: 'GENERAL' }} />;
      case 'hazmat':
        return <HazmatCargoForm {...props} initial={{ zone: '' }} />;
      default:
        return null;
    }
  }

  function renderCargoList() {
    if (cargoQuery.error) return null;
    if (cargoQuery.isPending) {
      return <p className="py-6 text-center text-sm text-muted-foreground">Loading cargo records…</p>;
    }
    if (page === 'fiz-raw-materials') {
      return <FizRawMaterialList rows={rows} empty="No cargo records yet." />;
    }
    if (page === 'fiz-finished-goods') {
      return <FizFinishedGoodsList rows={rows} empty="No cargo records yet." />;
    }
    if (page === 'hazmat') {
      return <HazmatCargoList rows={rows} empty="No hazardous cargo records yet." />;
    }
    if (page === 'fcz-transhipment') {
      return <FczTranshipmentList rows={rows} empty="No cargo records yet." />;
    }
    if (page === 'bulk-dry') {
      return <DryCargoList rows={rows} empty="No dry bulk cargo records yet." />;
    }
    if (page === 'bulk-liquid') {
      return <LiquidCargoList rows={rows} empty="No liquid bulk cargo records yet." />;
    }
    if (page === 'bulk' || page === 'bulk-break-bulk' || page === 'bulk-containerized') {
      return <BulkCargoList rows={rows} empty="No matching bulk cargo records yet." />;
    }
    return <CargoList rows={rows} empty="No cargo records yet." />;
  }

  function renderContent() {
    switch (page) {
      case 'new':
        return renderForm();
      case 'detail':
        return (
          <div className="space-y-4">
            {detailQuery.isPending && <p className="text-sm text-muted-foreground">Loading cargo record…</p>}
            {detailQuery.error && <p role="alert" className="text-sm text-destructive">{detailQuery.error.message}</p>}
            {!detailQuery.isPending && !detailQuery.error && !detailQuery.data && (
              <p role="status" className="text-sm text-muted-foreground">No cargo record was found for ID {id}.</p>
            )}
            {detailQuery.data && (
              <Card>
                <CardHeader><CardTitle>{detailQuery.data.ref}</CardTitle></CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>Status: {detailQuery.data.status}</p>
                  <p>Type: {detailQuery.data.kind}</p>
                  {detailQuery.data.description && <p>Description: {detailQuery.data.description}</p>}
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 'analytics': {
        const count = (status: string) => records.filter((record) => record.status === status).length;
        return (
          <div className="space-y-6">
            {!cargoQuery.isPending && !cargoQuery.error && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Total records', records.length],
                ['Draft', count('DRAFT')],
                ['In storage', count('IN_STORAGE')],
                ['Held', count('HELD')],
              ].map(([label, value]) => (
                <Card key={label}>
                  <CardHeader><CardTitle className="text-sm">{label}</CardTitle></CardHeader>
                  <CardContent className="text-2xl font-semibold">{value}</CardContent>
                </Card>
              ))}
            </div>}
            {renderCargoList()}
          </div>
        );
      }
      case 'fiz':
        return <>{renderMetrics(records, !cargoQuery.isPending && !cargoQuery.error)}{renderCargoList()}</>;
      case 'fiz-machinery':
        return <>{renderForm()}{renderCargoList()}</>;
      case 'fiz-raw-materials':
        return <>{renderForm()}{renderCargoList()}</>;
      case 'fiz-finished-goods':
        return <>{renderForm()}{renderCargoList()}</>;
      case 'hazmat':
        return <>{renderMetrics(records, !cargoQuery.isPending && !cargoQuery.error)}{renderForm()}{renderCargoList()}</>;
      case 'hazmat-segregation':
        return <><HazmatSegregationView zone="FIZ" />{renderCargoList()}</>;
      case 'fcz':
        return <>{renderMetrics(records, !cargoQuery.isPending && !cargoQuery.error)}{renderCargoList()}</>;
      case 'fcz-break-bulk':
      case 'fcz-reexport':
      case 'fcz-repackaging':
        return <>{renderForm()}{renderCargoList()}</>;
      case 'fcz-transhipment':
        return <>{renderForm()}{renderCargoList()}</>;
      case 'bulk':
        return <>{renderMetrics(records, !cargoQuery.isPending && !cargoQuery.error)}{renderCargoList()}</>;
      case 'bulk-dry':
        return <>{renderMetrics(records, !cargoQuery.isPending && !cargoQuery.error)}{renderForm()}{renderCargoList()}</>;
      case 'bulk-liquid':
        return <>{renderMetrics(records, !cargoQuery.isPending && !cargoQuery.error)}{renderForm()}{renderCargoList()}</>;
      case 'bulk-containerized':
      case 'bulk-break-bulk':
        return <>{renderMetrics(records, !cargoQuery.isPending && !cargoQuery.error)}{renderForm()}{renderCargoList()}</>;
    }
  }

  const header = page === 'detail'
    ? { title: `Cargo ${id ?? ''}`, description: `Cargo record details (ID: ${id ?? ''}).` }
    : pageDetails[page];

  return (
    <div className="space-y-6">
      <PageHeader title={header.title} description={header.description} />
      {cargoQuery.error && (
        <div role="alert" className="flex items-center justify-between gap-4 rounded-md border border-destructive/40 p-4 text-sm">
          <span>Could not load cargo records from cargo.main: {cargoQuery.error.message}</span>
          <button type="button" className="underline" onClick={() => void cargoQuery.refetch()}>Retry</button>
        </div>
      )}
      {renderContent()}
      {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
      {submitSuccess && <p role="status" className="text-sm text-muted-foreground">Cargo record saved.</p>}
    </div>
  );
}

function renderMetrics(records: CargoRecord[], ready: boolean) {
  if (!ready) return null;
  const statuses = [
    ['Records', records.length],
    ['Received', records.filter((record) => record.status === 'RECEIVED').length],
    ['In storage', records.filter((record) => record.status === 'IN_STORAGE').length],
    ['Held', records.filter((record) => record.status === 'HELD').length],
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statuses.map(([label, value]) => (
        <Card key={label}>
          <CardHeader><CardTitle className="text-sm">{label}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
