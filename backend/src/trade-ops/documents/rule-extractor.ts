import type { ExtractionResult, ExtractedField, ExtractedLineItem, TradeDocKindValue } from './extraction.schema';

/**
 * Deterministic rule-based extraction adapter (Module A).
 *
 * Default, always-available adapter behind the `ExtractionAdapter` interface.
 * It never guesses: a field it cannot match is absent, and every matched
 * field carries the exact source line it was read from so the review UI can
 * highlight provenance. When no text layer exists and no OCR adapter is
 * configured, the service records NEEDS_TEXT instead of inventing content.
 */

export interface AdapterInput {
  title: string;
  text: string;
}

export interface ExtractionAdapter {
  /** Stable adapter id, persisted on every extraction for provenance. */
  readonly name: string; // e.g. "rule@1"
  readonly version: string;
  extract(input: AdapterInput): Promise<ExtractionResult | null>;
}

// ---------------------------------------------------------------------------
// Prompt-injection neutralisation
// ---------------------------------------------------------------------------

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+instructions/i,
  /disregard\s+(the\s+)?(previous|prior|above)\b/i,
  /\byou\s+are\s+(now\s+)?(a|an|the)\b/i,
  /system\s*prompt/i,
  /assistant\s*:/i,
  /\bdo\s+not\s+(tell|inform|mention|reveal)\b/i,
  /<\/?(system|assistant|instruction)>/i,
];

export function findInjectionLines(text: string): string[] {
  return text.split(/\r?\n/).filter((line) => INJECTION_PATTERNS.some((p) => p.test(line)));
}

/** Instruction-like lines are excluded from field parsing entirely. */
export function neutralizeInstructions(text: string): { clean: string; injectionSuspect: boolean } {
  const lines = text.split(/\r?\n/);
  const kept = lines.filter((line) => !INJECTION_PATTERNS.some((p) => p.test(line)));
  return { clean: kept.join('\n'), injectionSuspect: kept.length !== lines.length };
}

// ---------------------------------------------------------------------------
// Kind detection
// ---------------------------------------------------------------------------

const KIND_SIGNALS: Array<[TradeDocKindValue, RegExp]> = [
  // More specific signals first: a packing list commonly references an
  // invoice number, so generic INVOICE must not win on body mentions alone.
  ['PACKING_LIST', /\bpacking\s+list\b/i],
  ['INVOICE', /\bcommercial\s+invoice\b|\binvoice\s+(no|number|#)\b/i],
  ['BOL', /\bbill\s+of\s+lading\b|\bB\/?L\b/i],
  ['CERTIFICATE_OF_ORIGIN', /\bcertificate\s+of\s+origin\b|\bC\/O\b/i],
  ['PERMIT', /\b(import|export)\s+permit\b|\blicence\b|\blicense\b/i],
  ['INSURANCE', /\binsurance\s+certificate\b|\bcertificate\s+of\s+insurance\b/i],
];

export function detectKind(title: string, text: string): TradeDocKindValue {
  // Title beats body: the filename/uploader-declared type is the strongest
  // signal we have without OCR layout data.
  for (const [kind, re] of KIND_SIGNALS) if (re.test(title)) return kind;
  const body = text.slice(0, 4000);
  for (const [kind, re] of KIND_SIGNALS) if (re.test(body)) return kind;
  return 'OTHER';
}

// ---------------------------------------------------------------------------
// Field extraction
// ---------------------------------------------------------------------------

interface FieldSpec {
  name: string;
  patterns: RegExp[]; // tried in order; first wins
  confidence: number; // reflects pattern specificity, never legal certainty
}

const FIELD_SPECS: FieldSpec[] = [
  { name: 'invoiceNumber', patterns: [/\binvoice\s*(?:no\.?|number|#)\s*[:\-]?\s*([A-Za-z0-9\-\/]+)/i], confidence: 0.9 },
  { name: 'invoiceDate', patterns: [/\b(?:invoice\s*)?date\s*[:\-]?\s*(\d{1,4}[-\/.]\d{1,2}[-\/.]\d{1,4})/i], confidence: 0.9 },
  { name: 'poNumber', patterns: [/\b(?:p\.?o\.?|purchase\s+order)\s*(?:no\.?|number|#)?\s*[:\-]?\s*([A-Za-z0-9\-\/]+)/i], confidence: 0.9 },
  { name: 'currency', patterns: [/\bcurrency\s*[:\-]?\s*([A-Z]{3})\b/i, /\btotal[^A-Za-z]{0,3}(?:amount)?\s*[:\-]?\s*([A-Z]{3})\s?[\d,.]+/i], confidence: 0.85 },
  { name: 'incoterm', patterns: [/\bincoterms?\s*[:\-]?\s*([A-Za-z]{3}(?:\s+[A-Za-z]+)?)/i], confidence: 0.9 },
  { name: 'supplier', patterns: [/\b(?:seller|supplier|shipper|from)\s*[:\-]\s*(.+)/i], confidence: 0.8 },
  { name: 'buyer', patterns: [/\b(?:buyer|consignee|purchaser|to)\s*[:\-]\s*(.+)/i], confidence: 0.8 },
  { name: 'countryOfOrigin', patterns: [/\bcountry\s+of\s+(?:origin|manufacture)\s*[:\-]?\s*([A-Za-z .()]+)/i], confidence: 0.9 },
  { name: 'totalAmount', patterns: [/\b(?:grand\s+)?total\s*(?:amount)?\s*(?:due|payable)?\s*[:\-]?\s*([A-Z]{3})?\s*([\d,]+\.\d{2})/i], confidence: 0.85 },
  { name: 'netWeight', patterns: [/\b(?:total\s+)?net\s+(?:weight|mass)\s*[:\-]?\s*([\d,.]+)\s*(kg|kgs|mt|tonnes?)?/i], confidence: 0.85 },
  { name: 'grossWeight', patterns: [/\b(?:total\s+)?gross\s+(?:weight|mass)\s*[:\-]?\s*([\d,.]+)\s*(kg|kgs|mt|tonnes?)?/i], confidence: 0.85 },
  { name: 'totalPackages', patterns: [/\btotal\s+(?:packages|cartons)\s*[:\-]?\s*([\d,.]+)/i], confidence: 0.85 },
  { name: 'bolNumber', patterns: [/\b(?:b\/?l|bill\s+of\s+lading)\s*(?:no\.?|number|#)?\s*[:\-]?\s*([A-Za-z0-9\-]+)/i], confidence: 0.9 },
];

function toNumber(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number(raw.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

export function extractFields(lines: string[]): ExtractedField[] {
  const out: ExtractedField[] = [];
  const seen = new Set<string>();
  for (const spec of FIELD_SPECS) {
    for (const line of lines) {
      for (const re of spec.patterns) {
        const m = re.exec(line);
        if (!m) continue;
        const raw = spec.name === 'totalAmount' ? (m[2] ?? '').trim() : (m[1] ?? '').trim();
        if (!raw || seen.has(spec.name)) continue;
        seen.add(spec.name);
        out.push({
          name: spec.name,
          value: raw,
          confidence: spec.confidence,
          page: null,
          bbox: null,
          sourceText: line.trim(),
        });
        break;
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Line items (invoice & packing list tables)
// ---------------------------------------------------------------------------

const NUM = String.raw`[\d,]+(?:\.\d+)?`;

/** Rows like `Widget A | 100 | PCS | 12.50 | 1250.00` or tab/comma variants. */
const ROW_RE = new RegExp(
  String.raw`^\s*([A-Za-z][A-Za-z0-9 ,.\-()]{2,60}?)\s*[|,\t]\s*(${NUM})\s*(?:[|,\t]\s*([A-Z]{2,3})\s*)?(?:[|,\t]\s*(${NUM}))?(?:\s*[|,\t]\s*(${NUM}))?`,
);

export function extractLineItems(lines: string[], kind: TradeDocKindValue): ExtractedLineItem[] {
  if (kind !== 'INVOICE' && kind !== 'PACKING_LIST') return [];
  const items: ExtractedLineItem[] = [];
  let lineNo = 0;
  for (const raw of lines) {
    const m = ROW_RE.exec(raw);
    if (!m) continue;
    const description = (m[1] ?? '').trim();
    const quantity = toNumber(m[2]);
    if (!description || quantity === null) continue;
    lineNo += 1;
    items.push({
      lineNo,
      description,
      hsCode: null,
      quantity,
      unit: m[3] ?? null,
      unitPrice: toNumber(m[4]),
      amount: toNumber(m[5]),
      origin: null,
      sourceText: raw.trim(),
    });
  }
  return items;
}

/**
 * Arithmetic sanity check: sum of line amounts vs the extracted grand total.
 * A mismatch beyond tolerance becomes a warning for the reviewer — we flag,
 * never silently "fix" either side.
 */
export function arithmeticWarnings(
  fields: ExtractedField[],
  items: ExtractedLineItem[],
  tolerance = 0.01,
): string[] {
  const warnings: string[] = [];
  const totalField = fields.find((f) => f.name === 'totalAmount');
  const amounts = items.map((i) => i.amount).filter((a): a is number => a !== null);
  if (totalField?.value && amounts.length > 0) {
    const declared = toNumber(totalField.value);
    const sum = amounts.reduce((a, b) => a + b, 0);
    if (declared !== null && Math.abs(declared - sum) > Math.max(tolerance, Math.abs(declared) * 0.005)) {
      warnings.push(
        `Line-item sum ${sum.toFixed(2} does not match declared total ${declared.toFixed(2)} — verify before use.`,
      );
    }
  }
  const missingAmounts = items.length - amounts.length;
  if (missingAmounts > 0) {
    warnings.push(`${missingAmounts} line item(s) have no parsed amount — table may be partially unread.`);
  }
  return warnings;
}

// ---------------------------------------------------------------------------
// Concrete adapter
// ---------------------------------------------------------------------------

export class RuleBasedAdapter implements ExtractionAdapter {
  readonly name = 'rule@1';
  readonly version = '1.0.0';

  async extract({ title, text }: AdapterInput): Promise<ExtractionResult | null> {
    if (!text.trim()) return null;
    const { clean, injectionSuspect } = neutralizeInstructions(text);
    const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const detectedKind = detectKind(title, text);
    const fields = extractFields(lines);
    const lineItems = extractLineItems(lines, detectedKind);
    const warnings = arithmeticWarnings(fields, lineItems);
    return { detectedKind, fields, lineItems, warnings, injectionSuspect };
  }
}

export const ruleAdapter = new RuleBasedAdapter();


