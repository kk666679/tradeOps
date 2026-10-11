export type ZoneType = 'FIZ' | 'FCZ' | 'BONDED' | 'FTZ';
export interface Zone { id: string; code: string; name: string; type: ZoneType; country: string; }
export interface ZoneTenant { id: string; zoneId: string; name: string; leaseFrom: string; leaseTo: string; }
export interface GatePass { id: string; zoneId: string; ref: string; direction: 'in' | 'out'; issuedAt: string; }
export interface ZoneMovement { id: string; fromZone: string; toZone: string; cargoRef: string; status: 'pending' | 'in_transit' | 'arrived' | 'held'; }
export interface BondedStock { id: string; zoneId: string; hs: string; qty: number; value: number; enteredAt: string; }
export interface ExemptionScheme { id: string; code: string; description: string; }
export interface ExemptionClaim { id: string; schemeId: string; amount: number; status: 'claimed' | 'approved' | 'rejected'; }
export interface ZoneInventorySlot { id: string; zoneId: string; location: string; sku: string; qty: number; }
