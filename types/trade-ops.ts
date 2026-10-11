export type DeclarationStatus = 'draft' | 'submitted' | 'assessed' | 'released' | 'cancelled';
export type ChannelType = 'green' | 'yellow' | 'red';
export type ValuationMethod = 'CIF' | 'FOB' | 'transaction' | 'fallback';
export interface DeclarationLine { id: string; hs: string; description: string; qty: number; value: number; origin: string; }
export interface TradeDeclaration { id: string; ref: string; status: DeclarationStatus; lines: DeclarationLine[]; }
export interface HsCode { code: string; description: string; dutyRate: number; }
export interface DutyBreakdown { duty: number; salesTax: number; excise: number; total: number; }
export interface Permit { id: string; code: string; authority: string; validFrom: string; validTo: string; }
export interface ClearanceRecord { id: string; declarationId: string; channel: ChannelType; releasedAt?: string; }
export interface OriginRule { id: string; agreement: string; rule: string; }
export interface ComplianceFinding { id: string; severity: 'low' | 'medium' | 'high'; message: string; }
