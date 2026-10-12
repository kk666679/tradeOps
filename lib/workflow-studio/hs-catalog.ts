import type { HsEntry } from './types';

export const HS_CHAPTERS: Record<number, string> = {
  3: 'Fish & crustaceans',
  4: 'Dairy produce',
  9: 'Coffee, tea, spices',
  19: 'Cereal preparations',
  22: 'Beverages, spirits',
  27: 'Mineral fuels',
  30: 'Pharmaceutical products',
  39: 'Plastics',
  40: 'Rubber & articles',
  49: 'Printed books',
  61: 'Apparel — knitted',
  62: 'Apparel — not knitted',
  71: 'Precious metals, jewellery',
  73: 'Iron & steel articles',
  84: 'Machinery & mechanical',
  85: 'Electrical machinery',
  87: 'Vehicles',
  90: 'Optical, medical instruments',
  94: 'Furniture',
  95: 'Toys, games',
};

export const HS_CATALOG: HsEntry[] = [
  { code:'0302.11.0000', desc:'Trout, fresh or chilled (excluding fillets)',
    chapter:3, duty:0, sst:0, excise:0, pga:['MAQIS'], restricted:false,
    notes:'Fisheries Dept. import permit may be required' },
  { code:'0402.10.0000', desc:'Milk and cream, in powder, fat content ≤ 1.5%',
    chapter:4, duty:5, sst:0, excise:0, pga:[], restricted:false },
  { code:'0901.21.0000', desc:'Coffee, roasted, not decaffeinated',
    chapter:9, duty:5, sst:0, excise:0, pga:[], restricted:false },
  { code:'1905.31.0000', desc:'Sweet biscuits',
    chapter:19, duty:10, sst:0, excise:0, pga:[], restricted:false },
  { code:'2204.21.0000', desc:'Wine of fresh grapes, ≤ 2L containers',
    chapter:22, duty:90, sst:0, excise:0, pga:['JKDM'],
    restricted:true, notes:'Excise licence, restricted import' },
  { code:'2208.30.0000', desc:'Whiskies',
    chapter:22, duty:150, sst:0, excise:0, pga:['JKDM'],
    restricted:true, notes:'Excise duty applies at compound rate' },
  { code:'2710.19.0000', desc:'Petroleum oils, other than crude',
    chapter:27, duty:0, sst:0, excise:0, pga:[], restricted:false },
  { code:'3004.90.0000', desc:'Medicaments, in retail packaging',
    chapter:30, duty:0, sst:0, excise:0, pga:['MOH'],
    restricted:false, notes:'Product registration with NPRA required' },
  { code:'3907.61.0000', desc:'Poly(ethylene terephthalate) — PET resin',
    chapter:39, duty:0, sst:0, excise:0, pga:[], restricted:false },
  { code:'4011.10.0000', desc:'New pneumatic tyres for motor cars',
    chapter:40, duty:5, sst:10, excise:0, pga:['SIRIM'],
    restricted:false, notes:'SIRIM certification required' },
  { code:'4901.99.0000', desc:'Printed books, brochures, leaflets',
    chapter:49, duty:0, sst:0, excise:0, pga:[], restricted:false },
  { code:'6109.10.0000', desc:'T-shirts, singlets, of cotton (knitted)',
    chapter:61, duty:0, sst:10, excise:0, pga:[], restricted:false },
  { code:'6203.42.0000', desc:"Men's trousers, of cotton",
    chapter:62, duty:0, sst:10, excise:0, pga:[], restricted:false },
  { code:'7113.19.0000', desc:'Jewellery of precious metal (other than silver)',
    chapter:71, duty:0, sst:10, excise:0, pga:[], restricted:false },
  { code:'7321.11.0000', desc:'Cooking appliances, gas fuel, for domestic use',
    chapter:73, duty:15, sst:10, excise:0, pga:['SIRIM'],
    restricted:false, notes:'SIRIM safety certification required' },
  { code:'8471.30.0000', desc:'Portable automatic data processing machines ≤ 10 kg',
    chapter:84, duty:0, sst:0, excise:0, pga:[], restricted:false,
    notes:'Laptops, notebooks, tablets with physical keyboard' },
  { code:'8471.41.0000', desc:'Data processing machines — comprising CPU + I/O',
    chapter:84, duty:0, sst:0, excise:0, pga:[], restricted:false },
  { code:'8471.49.0000', desc:'Data processing machines, presented in systems',
    chapter:84, duty:0, sst:0, excise:0, pga:[], restricted:false },
  { code:'8473.30.0000', desc:'Parts and accessories of computers',
    chapter:84, duty:0, sst:0, excise:0, pga:[], restricted:false },
  { code:'8479.89.0000', desc:'Machines and mechanical appliances, other',
    chapter:84, duty:0, sst:0, excise:0, pga:[], restricted:false },
  { code:'8516.50.0000', desc:'Microwave ovens',
    chapter:85, duty:20, sst:10, excise:0, pga:['SIRIM'],
    restricted:false, notes:'SIRIM safety certification required' },
  { code:'8517.12.0000', desc:'Smartphones / telephones for cellular networks',
    chapter:85, duty:0, sst:0, excise:0, pga:['SIRIM'],
    restricted:false, notes:'SIRIM type approval required' },
  { code:'8517.62.0000', desc:'Machines for reception / transmission of data',
    chapter:85, duty:0, sst:0, excise:0, pga:['SIRIM'],
    restricted:false, notes:'SIRIM + MCMC approval' },
  { code:'8528.72.0000', desc:'Television receivers, colour, other',
    chapter:85, duty:30, sst:10, excise:0, pga:['SIRIM'], restricted:false },
  { code:'8703.23.0000', desc:'Motor cars, 1500–3000 cc, spark-ignition',
    chapter:87, duty:30, sst:10, excise:0, pga:['MITI','JPJ','SIRIM'],
    restricted:false, notes:'Approved Permit (AP) required from MITI' },
  { code:'8703.32.0000', desc:'Motor cars, 1500–2500 cc, compression-ignition',
    chapter:87, duty:30, sst:10, excise:0, pga:['MITI','JPJ','SIRIM'],
    restricted:false, notes:'Approved Permit (AP) required from MITI' },
  { code:'8708.29.0000', desc:'Parts and accessories of motor vehicle bodies',
    chapter:87, duty:10, sst:10, excise:0, pga:[], restricted:false },
  { code:'9004.90.0000', desc:'Spectacles, goggles and the like',
    chapter:90, duty:0, sst:10, excise:0, pga:[], restricted:false },
  { code:'9018.90.0000', desc:'Instruments and appliances used in medical sciences',
    chapter:90, duty:0, sst:0, excise:0, pga:['MOH'],
    restricted:false, notes:'Medical device registration (MDA) required' },
  { code:'9403.30.0000', desc:'Wooden furniture of a kind used in offices',
    chapter:94, duty:10, sst:10, excise:0, pga:[], restricted:false },
  { code:'9503.00.0000', desc:'Tricycles, scooters, dolls, toys, puzzles',
    chapter:95, duty:0, sst:10, excise:0, pga:[], restricted:false },
];

export const HS_BY_CODE: Record<string, HsEntry> = Object.fromEntries(
  HS_CATALOG.map((h) => [h.code, h]),
);

export function normalizeHsCode(raw: string | undefined): string {
  if (!raw) return '';
  const digits = String(raw).replace(/[^0-9]/g, '');
  if (digits.length < 6) return String(raw).trim();
  const padded = digits.padEnd(10, '0').slice(0, 10);
  return `${padded.slice(0, 4)}.${padded.slice(4, 6)}.${padded.slice(6, 10)}`;
}

export function hsCodeStatus(code: string): 'none' | 'known' | 'restricted' | 'unknown' {
  if (!code) return 'none';
  const canonical = normalizeHsCode(code);
  const entry = HS_BY_CODE[canonical];
  if (entry) return entry.restricted ? 'restricted' : 'known';
  return 'unknown';
}
