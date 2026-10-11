/**
 * hs-code-data.ts
 * Real-world HS (Harmonized System) 2022 / AHTN 2022 tariff reference data.
 * Updated for Malaysia Customs Tariff 2026.
 *
 * ===========================================================================
 * COMPREHENSIVE LEGAL, TAX, AND REGULATORY FRAMEWORK (2026)
 * ===========================================================================
 *
 * This dataset is built upon the following primary legislation and sources:
 *
 * ---------------------------------------------------------------------------
 * 1. CUSTOMS DUTIES ORDER 2022 (P.U.(A) 114/2022)
 * ---------------------------------------------------------------------------
 * The primary legislation governing import and export duties. It came into
 * force on 1 June 2022 and implements the AHTN 2022 nomenclature.
 *
 * Key Provisions:
 *   - Import duty is levied on goods described in the First Schedule, at
 *     the "full rate" specified in column (5)[reference:0].
 *   - Goods subject to tariff-rate quotas have duty levied at rates specified
 *     in Appendix B of the First Schedule.
 *   - Non-commercial imports (excluding motor vehicles, alcohol, tobacco)
 *     are subject to a flat 10% ad valorem duty.
 *   - Percentage rates apply to the value of goods; specific monetary rates
 *     apply per unit of quantity in column (4).
 *   - MFN import duty rates range from 0% to 40%, with most industrial
 *     goods at 0% and protected/luxury goods at higher rates.
 *   - Amendments: P.U.(A) 216/2022 (effective 1 July 2022) reduced duties
 *     to 0% for certain subheadings (e.g., 3506.91.10, 8414.59.10)[reference:1].
 *
 * ---------------------------------------------------------------------------
 * 2. EXCISE DUTIES ORDER 2025 (P.U.(A) 349/2025)
 * ---------------------------------------------------------------------------
 * Excise duties are governed by the Excise Act 1976 and the Excise Duties
 * Order 2025, which implemented significant changes effective 1 November 2025
 * under Budget 2026.
 *
 * Tobacco Products (effective 1 Nov 2025):
 *   - Cigarettes: Excise duty increased by 2 sen per stick, from RM0.40 to
 *     RM0.42 per stick (RM8.40 per packet of 20)[reference:2].
 *   - Cigars, cheroots and cigarillos: Excise duty increased by RM40 per kg,
 *     from RM400 to RM440 per kg[reference:3].
 *   - Heated tobacco products: Excise duty increased by RM20 per kg, from
 *     RM778 to RM798 per kg[reference:4].
 *   - These increases are being implemented in phases, in line with Malaysia's
 *     WHO Framework Convention on Tobacco Control (FCTC) commitments[reference:5].
 *
 * Alcoholic Beverages (effective 1 Nov 2025 — 10% across-the-board increase):
 *   - Beer made from malt (HS 22.03): RM175.00 → RM192.50 per 100% vol. per litre[reference:6].
 *   - Other wine, vermouth, brandy, whiskies, rum, gin, vodka (HS 22.04, 22.05,
 *     22.08): RM150.00 → RM165.00 per 100% vol. per litre.
 *   - Undenatured ethyl alcohol (HS 2207.10): RM44.00 + 15% ad valorem.
 *   - Ethyl alcohol and other spirits (HS 2207.20): RM1.10 + 15% ad valorem.
 *
 * Nicotine Replacement Therapy (NRT):
 *   - Import duty and sales tax exemptions on NRT products (nicotine gum,
 *     patches, mist, lozenges) extended until 31 December 2027.
 *
 * Sugar-Sweetened Beverages (SSB):
 *   - Excise duty increased from RM0.50 per litre to RM0.90 per litre,
 *     effective 1 January 2025.
 *
 * ---------------------------------------------------------------------------
 * 3. SALES TAX ACT 2018 (SST) — 2026 UPDATES
 * ---------------------------------------------------------------------------
 * Sales Tax is governed by the Sales Tax Act 2018 and administered by RMCD.
 *
 * Standard Rates:
 *   - 5% (reduced rate): Petroleum oils, construction materials, timepieces,
 *     certain foodstuffs.
 *   - 10% (standard rate): Most other taxable goods.
 *
 * 2026 Exemptions (effective 1 January 2026):
 *   - Critical raw materials and manufacturing inputs for registered
 *     manufacturers of animal feed, fertiliser, and pesticide are exempted
 *     from Sales Tax under Sales Tax Policy No. 1/2026 (SITP 1/2026)[reference:7].
 *   - Covered goods include:
 *     • Animal feed: fishmeal, rice bran, etc.
 *     • Fertilisers: rock phosphate (calcinated), dolomite, etc.
 *     • Pesticides: glyphosate (including salts), glufosinate (including salts).
 *   - Documentation: Manufacturers must provide a Manufacturing License (ML)
 *     or a Confirmation Letter for Exemption from Manufacturing License issued
 *     by MIDA (effective 18 May 2026)[reference:8].
 *   - Refund application deadline extended to 31 October 2026[reference:9].
 *
 * Service Tax on Rental/Leasing (effective 1 January 2026):
 *   - Reduced from 8% to 6% for industrial use.
 *   - SME tenants with annual sales up to RM1.5 million are exempt.
 *
 * Low-Value Goods (LVG) Tax:
 *   - A flat 10% Sales Tax applies to imported physical goods valued at
 *     RM500 or less (excluding tobacco and alcohol) sold via online
 *     platforms[reference:10].
 *   - Collected at the point of sale by the seller/platform, not at the border.
 *   - Sellers with annual LVG sales exceeding RM500,000 must register for a
 *     Low-Value Goods Registration Number (LRN)[reference:11].
 *   - LVG tax contributed RM817 million in additional revenue in 2025.
 *
 * Compounding Tax Formula (for items valued over RM500):
 *   1. Import Duty = CIF Value × Duty Rate
 *   2. Sales Tax = (CIF + Import Duty) × Sales Tax Rate
 *   3. Total Landed Cost = CIF + Duty + Sales Tax
 *
 * ---------------------------------------------------------------------------
 * 4. CONTROLLED GOODS AND IMPORT LICENSING
 * ---------------------------------------------------------------------------
 * The Customs (Prohibition of Imports) Order 2023 (P.U.(A) 117/2023) governs
 * prohibited and restricted imports. Importers must refer to this order to
 * determine whether goods are subject to prohibitions or restrictions.
 *
 * Examples of Controlled Goods:
 *   - Pepper spray / security spray: Prohibited except under defined
 *     conditions (RMP approval under Arms Act 1960)[reference:12].
 *   - Animal feeding preparations containing Salbutamol, Clenbuterol,
 *     Salmeterol, Terbutaline, Formoterol, or Polymyxin: Prohibited[reference:13].
 *   - Intoxicating liquor and tobacco: Import licensing required[reference:14].
 *   - Metal waste and scrap (21 types): Import ban under MITI (2024).
 *   - Caffeine and its salts, Clenbuterol, Salbutamol: Non-automatic licensing
 *     under MITI.
 *
 * Key Agencies and Control Lists:
 *   - MAQIS: Malaysian Quarantine and Inspection Services (agricultural
 *     products, live animals, meat, fish).
 *   - SIRIM: Standards and Industrial Research Institute of Malaysia
 *     (electrical/electronic goods, batteries).
 *   - MITI: Ministry of Investment, Trade and Industry (approved permits for
 *     vehicles, iron/steel).
 *   - MDA: Medical Device Authority (medical devices).
 *   - Drug Control Authority: Pharmaceuticals.
 *   - RMP: Royal Malaysia Police (arms, ammunition, pepper spray).
 *
 * ---------------------------------------------------------------------------
 * 5. FREE TRADE AGREEMENT (FTA) PREFERENTIAL RATES
 * ---------------------------------------------------------------------------
 * Malaysia maintains 16 FTAs (7 bilateral, 9 regional), covering approximately
 * 65-67% of total trade[reference:15].
 *
 * Major FTAs:
 *   - ATIGA/AFTA (1993): ASEAN (10 members); eliminates duties on 98.7% of
 *     tariff lines[reference:16].
 *   - ACFTA (2005): ASEAN + China.
 *   - MJEPA (2006): Malaysia ⇄ Japan.
 *   - RCEP (2022): ASEAN + China, Japan, South Korea, Australia, NZ; targets
 *     92% tariff elimination over 20 years[reference:17].
 *   - CPTPP (2022): Malaysia, Australia, Japan, Canada, Mexico, etc.
 *   - MCFTA (2012): Malaysia ⇄ Chile.
 *
 * Important Notes:
 *   - FTA rates take precedence over MFN rates when a valid Certificate of
 *     Origin (C/O) is presented[reference:18].
 *   - Each FTA uses different HS versions: ATIGA uses HS2017, RCEP uses
 *     HS2022, CPTPP uses HS2012[reference:19].
 *   - Goods not listed in a preferential schedule revert to the MFN rate.
 *
 * ---------------------------------------------------------------------------
 * 6. CARBON TAX (2026)
 * ---------------------------------------------------------------------------
 * The Malaysian government announced the introduction of a carbon tax on the
 * iron, steel, and energy industries by 2026 as part of Budget 2026
 * (announced 18 October 2025)[reference:20].
 *
 * Key Details:
 *   - Initial focus: Energy, iron and steel, and cement sectors.
 *   - Estimated carbon tax component for iron and steel: approximately
 *     RM30 per tonne of output[reference:21].
 *   - Implementation is being phased in, with the detailed mechanism still
 *     being finalised.
 *   - Revenue recycling will support B40 households[reference:22].
 *
 * ---------------------------------------------------------------------------
 * 7. OFFICIAL TARIFF LOOKUP TOOLS
 * ---------------------------------------------------------------------------
 * For authoritative, up-to-date tariff data, use these official sources:
 *
 *   - JKDM HS Explorer: http://mysstext.customs.gov.my/tariff/
 *     Official RMCD tariff lookup by HS code[reference:23].
 *   - MATRADE HS Code Finder: https://www.matrade.gov.my
 *     Reference for HS/AHTN codes[reference:24].
 *   - MyLVG Portal: https://mylvg.customs.gov.my
 *     LVG tax registration and compliance.
 *   - MySST Portal: https://mysst.customs.gov.my
 *     Sales & Service Tax information.
 *
 * ===========================================================================
 * IMPORTANT DISCLAIMER:
 *   The rates and flags in this dataset are INDICATIVE and intended for
 *   classification-engine prototyping. They do not replace an official
 *   tariff ruling. Always verify against the latest Customs Duties Order,
 *   Excise Duties Order, and Sales Tax Orders before making commercial
 *   decisions. Specific (non-ad-valorem) rates are represented using the
 *   `exciseSpecific` field.
 * ===========================================================================
 */

export interface HsCodeEntry {
  /** 6-digit HS subheading, e.g. "847130" */
  code: string;
  /** 2-digit chapter, e.g. "84" */
  chapter: string;
  /** 4-digit heading, e.g. "8471" */
  heading: string;
  /** Human-readable description (WCO nomenclature) */
  description: string;
  /** Common trade keywords for search */
  keywords: string[];
  /** Malaysian import duty rate (fraction, 0.05 = 5%). 0 = not scheduled / duty-free. */
  dutyRate: number;
  /** Sales tax / SST rate (fraction, 0.05 = 5%, 0.10 = 10%). 0 = exempt or not scheduled. */
  salesTaxRate: number;
  /** Excise duty rate (ad valorem fraction). 0 if not applicable or if specific. */
  exciseRate: number;
  /** Specific excise duty (e.g. RM0.42/stick, RM192.50/100% vol/l). Null if not applicable. */
  exciseSpecific: { value: number; unit: string } | null;
  /** Unit of measure (e.g. "kg", "l", "u", "m2") */
  uom: string;
  /** Requires import permit / controlled goods */
  controlled: boolean;
  /** Subject to import quota / licence */
  importQuota: boolean;
  /** Hazardous / dangerous goods */
  hazardous: boolean;
  /** Category used by the classification engine */
  kind: 'PRODUCT' | 'MATERIAL' | 'EQUIPMENT' | 'PART' | 'RAW' | 'CONSUMABLE';
  /** Preferential rates under Malaysia's FTAs. Null if not listed in any FTA. */
  preferentialRates: {
    scheme: 'ATIGA' | 'ACFTA' | 'RCEP' | 'CPTPP' | 'MJEPA' | 'MCFTA' | 'AHKFTA' | 'other';
    rate: number; // fraction, 0 = 0%
    conditions?: string;
  }[] | null;
  /** Reference to the relevant control list, if controlled. */
  controlList?: string;
  /** Whether the good is subject to the Carbon Tax (2026). */
  carbonTaxApplicable?: boolean;
}

const e = (
  code: string,
  description: string,
  keywords: string[],
  dutyRate: number,
  salesTaxRate: number,
  uom: string,
  kind: HsCodeEntry['kind'],
  opts: {
    exciseRate?: number;
    exciseSpecific?: { value: number; unit: string } | null;
    controlled?: boolean;
    importQuota?: boolean;
    hazardous?: boolean;
    preferentialRates?: HsCodeEntry['preferentialRates'];
    controlList?: string;
    carbonTaxApplicable?: boolean;
  } = {},
): HsCodeEntry => ({
  code,
  chapter: code.slice(0, 2),
  heading: code.slice(0, 4),
  description,
  keywords,
  dutyRate,
  salesTaxRate,
  exciseRate: opts.exciseRate ?? 0,
  exciseSpecific: opts.exciseSpecific ?? null,
  uom,
  kind,
  controlled: opts.controlled ?? false,
  importQuota: opts.importQuota ?? false,
  hazardous: opts.hazardous ?? false,
  preferentialRates: opts.preferentialRates ?? null,
  controlList: opts.controlList,
  carbonTaxApplicable: opts.carbonTaxApplicable ?? false,
});

/**
 * Malaysia Customs Tariff 2026 — MFN, SST, and Excise rates.
 * FTA rates (ATIGA, RCEP, MCFTA, MJEPA, CPTPP, etc.) are resolved by the origin engine.
 */
export const HS_CODES: HsCodeEntry[] = [
  // =========================================================================
  // CHAPTER 01 — Live animals
  // =========================================================================
  e('010111', 'Live horses, pure-bred breeding animals', ['horse', 'live', 'equine', 'breeding'], 0, 0, 'u', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('010119', 'Live horses, other', ['horse', 'live', 'equine'], 0, 0, 'u', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('010121', 'Live bovine animals — pure-bred breeding', ['cow', 'dairy', 'live', 'breeding'], 0, 0, 'u', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('010129', 'Live bovine animals, other', ['cow', 'beef', 'live'], 0, 0, 'u', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('010130', 'Live swine, pure-bred breeding animals', ['pig', 'live', 'swine', 'breeding'], 0, 0, 'u', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('010139', 'Live swine, other', ['pig', 'live', 'swine'], 0, 0, 'u', 'RAW', { controlled: true, controlList: 'MAQIS' }),

  // =========================================================================
  // CHAPTER 02 — Meat and edible meat offal
  // =========================================================================
  e('020110', 'Meat of bovine animals, fresh or chilled — carcasses and half-carcasses', ['beef', 'carcass', 'cow'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('020130', 'Meat of bovine animals, fresh or chilled — boneless', ['beef', 'boneless', 'fresh'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('020210', 'Meat of bovine animals, frozen — carcasses and half-carcasses', ['beef', 'frozen', 'carcass'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('020230', 'Meat of bovine animals, frozen — boneless', ['beef', 'frozen', 'boneless'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('020311', 'Fresh or chilled carcasses and half-carcasses of swine', ['pork', 'fresh'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('020321', 'Frozen carcasses and half-carcasses of swine', ['pork', 'frozen'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('020714', 'Fresh or chilled cuts and offal of fowls of the species Gallus domesticus', ['chicken', 'poultry', 'cut'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),

  // =========================================================================
  // CHAPTER 03 — Fish and crustaceans
  // =========================================================================
  e('030213', 'Pacific salmon (Oncorhynchus spp.) — frozen', ['salmon', 'fish', 'pacific'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('030214', 'Atlantic salmon (Salmo salar) — frozen', ['salmon', 'atlantic', 'fish'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('030311', 'Frozen sockeye salmon (red salmon)', ['salmon', 'sockeye', 'frozen'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('030314', 'Frozen Atlantic salmon', ['salmon', 'atlantic', 'frozen'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('030617', 'Frozen shrimps and prawns — not in shell', ['shrimp', 'prawn', 'shelled', 'frozen'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),

  // =========================================================================
  // CHAPTER 04 — Dairy produce; eggs; honey
  // =========================================================================
  e('040221', 'Milk and cream in powder form, fat content > 1.5% by weight', ['milk', 'powder', 'cream'], 0, 0.05, 'kg', 'RAW'),
  e('040299', 'Milk and cream, concentrated or containing added sugar, other', ['milk', 'condensed', 'cream'], 0, 0.05, 'kg', 'RAW'),
  e('040610', 'Fresh (unripened or uncured) cheese, including whey cheese', ['cheese', 'fresh'], 0, 0.05, 'kg', 'RAW'),
  e('040690', 'Other cheese', ['cheddar', 'cheese'], 0, 0.05, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 07 — Edible vegetables
  // =========================================================================
  e('070310', 'Onions and shallots, fresh or chilled', ['onion', 'shallot', 'vegetable'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('070320', 'Garlic, fresh or chilled', ['garlic', 'vegetable'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('071310', 'Peas (Pisum sativum), dried and shelled', ['peas', 'dried', 'legume'], 0, 0, 'kg', 'RAW'),
  e('071333', 'Kidney beans, dried and shelled', ['beans', 'kidney', 'dried'], 0, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 08 — Edible fruit and nuts
  // =========================================================================
  e('080111', 'Coconuts — fresh', ['coconut', 'fresh', 'fruit'], 0, 0, 'kg', 'RAW'),
  e('080132', 'Cashew nuts, shelled — fresh or dried', ['cashew', 'nut', 'shelled'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'MAQIS' }),
  e('080390', 'Bananas, fresh or dried', ['banana', 'fruit'], 0, 0, 'kg', 'RAW'),
  e('080510', 'Oranges, fresh or dried', ['orange', 'fruit', 'citrus'], 0, 0, 'kg', 'RAW'),
  e('080610', 'Grapes, fresh', ['grape', 'fresh', 'fruit'], 0, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 09 — Coffee, tea, maté and spices
  // =========================================================================
  e('090111', 'Coffee, not roasted — not decaffeinated', ['coffee', 'green', 'bean'], 0, 0, 'kg', 'RAW'),
  e('090121', 'Coffee, roasted — not decaffeinated', ['coffee', 'roasted'], 0, 0.05, 'kg', 'RAW'),
  e('090411', 'Pepper of the genus Piper — neither crushed nor ground', ['pepper', 'black', 'spice'], 0, 0, 'kg', 'RAW'),
  e('090921', 'Coriander seeds — neither crushed nor ground', ['coriander', 'seed', 'spice'], 0, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 10 — Cereals
  // =========================================================================
  e('100630', 'Semi-milled or wholly milled rice, whether or not polished or glazed', ['rice', 'milled', 'grain'], 0, 0, 'kg', 'RAW', { controlled: true, importQuota: true, controlList: 'MAQIS / BERNAS' }),
  e('100199', 'Wheat and meslin, other', ['wheat', 'grain', 'cereal'], 0, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 15 — Animal or vegetable fats and oils
  // =========================================================================
  e('150710', 'Soyabean oil, crude, whether or not degummed', ['soybean', 'oil', 'crude'], 0, 0, 'kg', 'RAW'),
  e('150790', 'Soyabean oil and its fractions, refined (not chemically modified)', ['soybean', 'oil', 'edible'], 0, 0.05, 'kg', 'RAW'),
  e('151110', 'Palm oil and its fractions — crude', ['palm', 'oil', 'cpbo', 'crude'], 0, 0, 'kg', 'RAW'),
  e('151190', 'Palm oil and its fractions — refined', ['palm', 'oil', 'rbpo', 'refined'], 0, 0.05, 'kg', 'RAW'),
  e('151319', 'Coconut (copra) oil and its fractions — refined', ['coconut', 'oil', 'copra'], 0, 0.05, 'kg', 'RAW'),
  e('151710', 'Margarine and edible mixtures or preparations of animal/vegetable fats', ['margarine', 'shortening'], 0, 0.05, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 16 — Prepared meat, fish, crustaceans
  // =========================================================================
  e('160241', 'Prepared or preserved meat of swine — hams and cuts thereof', ['ham', 'pork', 'canned'], 0, 0.05, 'kg', 'PRODUCT', { controlled: true, controlList: 'MAQIS' }),
  e('160414', 'Prepared or preserved tuna, whole or in pieces', ['tuna', 'canned', 'fish'], 0, 0.05, 'kg', 'PRODUCT', { controlled: true, controlList: 'MAQIS' }),
  e('160420', 'Other prepared or preserved fish', ['fish', 'canned'], 0, 0.05, 'kg', 'PRODUCT', { controlled: true, controlList: 'MAQIS' }),

  // =========================================================================
  // CHAPTER 17 — Sugars and sugar confectionery
  // =========================================================================
  e('170199', 'Cane or beet sugar and chemically pure sucrose, in solid form', ['sugar', 'refined', 'white'], 0, 0, 'kg', 'RAW', { controlled: true, importQuota: true, controlList: 'KPDN' }),
  e('170490', 'Sugar confectionery (including white chocolate), not containing cocoa', ['confectionery', 'candy', 'sugar'], 0, 0.05, 'kg', 'PRODUCT'),

  // =========================================================================
  // CHAPTER 19 — Preparations of cereals, flour, starch or milk
  // =========================================================================
  e('190211', 'Pasta containing eggs', ['pasta', 'noodle', 'egg'], 0, 0.05, 'kg', 'PRODUCT'),
  e('190219', 'Pasta not containing eggs', ['pasta', 'noodle', 'macaroni'], 0, 0.05, 'kg', 'PRODUCT'),
  e('190531', 'Sweet biscuits', ['biscuit', 'cookie', 'sweet'], 0, 0.05, 'kg', 'PRODUCT'),

  // =========================================================================
  // CHAPTER 20 — Preparations of vegetables, fruit, nuts
  // =========================================================================
  e('200290', 'Tomatoes, otherwise prepared or preserved', ['tomato', 'paste', 'puree'], 0, 0.05, 'kg', 'PRODUCT'),
  e('200911', 'Orange juice, frozen', ['orange', 'juice', 'frozen'], 0, 0.05, 'kg', 'PRODUCT'),
  e('200919', 'Other orange juice', ['orange', 'juice'], 0, 0.05, 'kg', 'PRODUCT'),

  // =========================================================================
  // CHAPTER 21 — Miscellaneous edible preparations
  // =========================================================================
  e('210111', 'Extracts, essences and concentrates of coffee', ['coffee', 'extract', 'instant'], 0, 0.10, 'kg', 'PRODUCT'),
  e('210690', 'Other food preparations', ['food', 'preparation', 'supplement'], 0, 0.10, 'kg', 'PRODUCT'),

  // =========================================================================
  // CHAPTER 22 — Beverages, spirits and vinegar
  // =========================================================================
  e('220210', 'Waters containing added sugar or other sweetening matter', ['water', 'beverage', 'mineral'], 0, 0.10, 'l', 'PRODUCT', { exciseRate: 0, exciseSpecific: { value: 0.00, unit: 'per litre' } }),
  e('220300', 'Beer made from malt', ['beer', 'malt'], 0.05, 0.10, 'l', 'PRODUCT', {
    exciseRate: 0,
    exciseSpecific: { value: 192.50, unit: 'per 100% vol. per litre' },
    controlled: true,
    controlList: 'Customs (Prohibition of Imports) Order 2023',
  }),
  e('220421', 'Wine of fresh grapes, containers ≤ 2 litres — fortified', ['wine', 'fortified'], 0, 0.10, 'l', 'PRODUCT', {
    exciseRate: 0,
    exciseSpecific: { value: 165.00, unit: 'per 100% vol. per litre' },
    controlled: true,
    controlList: 'Customs (Prohibition of Imports) Order 2023',
  }),
  e('220830', 'Whiskies', ['whisky', 'whiskey', 'spirit'], 0, 0.10, 'l', 'PRODUCT', {
    exciseRate: 0,
    exciseSpecific: { value: 165.00, unit: 'per 100% vol. per litre' },
    controlled: true,
    controlList: 'Customs (Prohibition of Imports) Order 2023',
  }),
  e('220840', 'Rum and other spirits obtained by distilling fermented sugarcane products', ['rum', 'spirit'], 0, 0.10, 'l', 'PRODUCT', {
    exciseRate: 0,
    exciseSpecific: { value: 165.00, unit: 'per 100% vol. per litre' },
    controlled: true,
    controlList: 'Customs (Prohibition of Imports) Order 2023',
  }),
  e('220710', 'Undenatured ethyl alcohol of strength ≥ 80%', ['alcohol', 'ethanol'], 0, 0.10, 'l', 'RAW', {
    exciseRate: 0.15,
    exciseSpecific: { value: 44.00, unit: 'per 100% vol. per litre' },
    hazardous: true,
    controlled: true,
    controlList: 'Customs (Prohibition of Imports) Order 2023',
  }),

  // =========================================================================
  // CHAPTER 24 — Tobacco
  // =========================================================================
  e('240220', 'Cigarettes containing tobacco', ['cigarette', 'tobacco'], 0.05, 0.10, 'u', 'PRODUCT', {
    exciseRate: 0,
    exciseSpecific: { value: 0.42, unit: 'per stick' },
    controlled: true,
    importQuota: true,
    controlList: 'Customs (Prohibition of Imports) Order 2023 / Excise Duties Order 2025',
  }),
  e('240210', 'Cigars, cheroots and cigarillos containing tobacco', ['cigar', 'cheroot', 'tobacco'], 0.05, 0.10, 'kg', 'PRODUCT', {
    exciseRate: 0,
    exciseSpecific: { value: 440.00, unit: 'per kg' },
    controlled: true,
    controlList: 'Customs (Prohibition of Imports) Order 2023 / Excise Duties Order 2025',
  }),

  // =========================================================================
  // CHAPTER 25 — Salt; sulphur; earths and stone
  // =========================================================================
  e('250100', 'Salt (including table salt and denatured salt) and pure sodium chloride', ['salt', 'nacl', 'industrial'], 0, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 27 — Mineral fuels, mineral oils
  // =========================================================================
  e('270900', 'Petroleum oils and oils obtained from bituminous minerals — crude', ['crude', 'petroleum', 'oil'], 0, 0, 'kg', 'RAW', { hazardous: true }),
  e('271019', 'Petroleum oils (other than crude) and preparations — light oils', ['diesel', 'fuel', 'oil'], 0, 0.05, 'kg', 'RAW', { hazardous: true }),
  e('271119', 'Petroleum gases and other gaseous hydrocarbons — propane and butane', ['lpg', 'gas', 'propane', 'butane'], 0, 0.05, 'kg', 'RAW', { hazardous: true }),

  // =========================================================================
  // CHAPTER 28 — Inorganic chemicals
  // =========================================================================
  e('280110', 'Chlorine', ['chlorine', 'gas'], 0, 0.05, 'kg', 'RAW', { hazardous: true, controlled: true, controlList: 'Customs (Prohibition of Imports) Order 2023' }),
  e('280700', 'Sulphuric acid; oleum', ['sulphuric', 'acid', 'oleum'], 0, 0.05, 'kg', 'RAW', { hazardous: true }),
  e('283521', 'Phosphates of mono- or disodium', ['phosphate', 'sodium'], 0, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 29 — Organic chemicals
  // =========================================================================
  e('290220', 'Benzene', ['benzene', 'aromatic'], 0, 0.05, 'kg', 'RAW', { hazardous: true }),
  e('291511', 'Formic acid', ['formic', 'acid'], 0, 0.05, 'kg', 'RAW'),
  e('292390', 'Quaternary ammonium salts and hydroxides; lecithins', ['quaternary', 'ammonium', 'surfactant'], 0, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 30 — Pharmaceutical products
  // =========================================================================
  e('300431', 'Medicaments containing hormones but not antibiotics — retail sale', ['medicine', 'pharma', 'hormone'], 0, 0, 'kg', 'PRODUCT', { controlled: true, controlList: 'Drug Control Authority' }),
  e('300490', 'Other medicaments for therapeutic or prophylactic uses — retail sale', ['medicine', 'pharma', 'retail'], 0, 0, 'kg', 'PRODUCT', { controlled: true, controlList: 'Drug Control Authority' }),

  // =========================================================================
  // CHAPTER 31 — Fertilisers
  // =========================================================================
  e('310210', 'Urea, whether or not in aqueous solution', ['urea', 'fertiliser'], 0, 0, 'kg', 'RAW', {
    preferentialRates: [{ scheme: 'ATIGA', rate: 0 }, { scheme: 'RCEP', rate: 0 }],
  }),
  e('310520', 'Mineral or chemical fertilisers containing N, P and K', ['npk', 'fertiliser'], 0, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 32 — Tanning or dyeing extracts; pigments; paints
  // =========================================================================
  e('320810', 'Paints or varnishes based on polyesters, in a non-aqueous medium', ['paint', 'polyester', 'coating'], 0.10, 0.10, 'kg', 'MATERIAL', { hazardous: true }),
  e('320417', 'Pigments, preparations, synthetic organic colouring matter', ['pigment', 'dye', 'organic'], 0, 0.05, 'kg', 'MATERIAL'),
  e('321519', 'Other printing ink', ['ink', 'printing'], 0, 0.05, 'kg', 'MATERIAL'),

  // =========================================================================
  // CHAPTER 33 — Essential oils; cosmetics; toiletries
  // =========================================================================
  e('330300', 'Perfumes and toilet waters', ['perfume', 'cologne', 'fragrance'], 0, 0.10, 'kg', 'PRODUCT'),
  e('330499', 'Other beauty or make-up preparations', ['cosmetic', 'makeup', 'beauty'], 0, 0.10, 'kg', 'PRODUCT'),
  e('330510', 'Shampoos', ['shampoo', 'personal care'], 0, 0.10, 'kg', 'PRODUCT'),

  // =========================================================================
  // CHAPTER 34 — Soap; organic surface-active agents; waxes
  // =========================================================================
  e('340111', 'Soap and organic surface-active products — toilet soap', ['soap', 'toilet'], 0, 0.05, 'kg', 'PRODUCT'),
  e('340220', 'Detergents (other than soap) and preparations for washing', ['detergent', 'washing'], 0, 0.05, 'kg', 'PRODUCT'),

  // =========================================================================
  // CHAPTER 38 — Miscellaneous chemical products
  // =========================================================================
  e('380891', 'Insecticides, rodenticides, fungicides, herbicides — retail', ['insecticide', 'pesticide', 'herbicide'], 0, 0.05, 'kg', 'PRODUCT', { hazardous: true, controlled: true, controlList: 'Pesticides Act 1974' }),
  e('380894', 'Disinfectants', ['disinfectant', 'sanitiser'], 0, 0.05, 'kg', 'PRODUCT', { hazardous: true }),

  // =========================================================================
  // CHAPTER 39 — Plastics and articles thereof
  // =========================================================================
  e('390110', 'Polyethylene having a specific gravity < 0.94, in primary forms', ['polyethylene', 'plastic', 'ldpe'], 0, 0, 'kg', 'RAW', {
    preferentialRates: [{ scheme: 'ATIGA', rate: 0 }, { scheme: 'RCEP', rate: 0 }, { scheme: 'CPTPP', rate: 0 }],
  }),
  e('390120', 'Polyethylene having a specific gravity ≥ 0.94, in primary forms', ['polyethylene', 'plastic', 'hdpe'], 0, 0, 'kg', 'RAW', {
    preferentialRates: [{ scheme: 'ATIGA', rate: 0 }, { scheme: 'RCEP', rate: 0 }, { scheme: 'CPTPP', rate: 0 }],
  }),
  e('390210', 'Polypropylene, in primary forms', ['polypropylene', 'plastic', 'pp'], 0, 0, 'kg', 'RAW', {
    preferentialRates: [{ scheme: 'ATIGA', rate: 0 }, { scheme: 'RCEP', rate: 0 }],
  }),
  e('390311', 'Expansible polystyrene in primary forms', ['polystyrene', 'plastic', 'eps'], 0, 0, 'kg', 'RAW'),
  e('390740', 'Polycarbonates in primary forms', ['polycarbonate', 'plastic', 'pc'], 0, 0, 'kg', 'RAW'),
  e('392321', 'Sacks and bags of polymers of ethylene', ['plastic', 'bag', 'polybag'], 0.10, 0.10, 'kg', 'MATERIAL'),
  e('392390', 'Other articles for the conveyance or packing of goods, of plastics', ['plastic', 'packaging', 'container'], 0.10, 0.10, 'kg', 'MATERIAL'),

  // =========================================================================
  // CHAPTER 40 — Rubber and articles thereof
  // =========================================================================
  e('400110', 'Natural rubber latex, whether or not pre-vulcanised', ['rubber', 'latex', 'natural'], 0, 0, 'kg', 'RAW'),
  e('400122', 'Technically specified natural rubber (TSNR), in smoked sheets', ['rubber', 'tsnr', 'natural'], 0, 0, 'kg', 'RAW'),
  e('401110', 'New pneumatic tyres of rubber for motor cars', ['tyre', 'tire', 'pneumatic', 'car'], 0.10, 0.10, 'u', 'PART', {
    preferentialRates: [{ scheme: 'ATIGA', rate: 0 }, { scheme: 'RCEP', rate: 0 }],
  }),

  // =========================================================================
  // CHAPTER 44 — Wood and articles of wood; wood charcoal
  // =========================================================================
  e('440710', 'Coniferous wood sawn or chipped lengthwise, thickness > 6 mm', ['timber', 'wood', 'conifer'], 0, 0, 'm3', 'RAW', { controlled: true, controlList: 'MTIB' }),
  e('440890', 'Sheets for veneering and other wood sawn lengthwise', ['veneer', 'wood', 'sheet'], 0, 0, 'm3', 'RAW'),
  e('441233', 'Particle board, of thickness ≥ 6 mm', ['particleboard', 'chipboard', 'wood'], 0.05, 0.05, 'm3', 'MATERIAL'),

  // =========================================================================
  // CHAPTER 48 — Paper and paperboard; articles of pulp
  // =========================================================================
  e('481910', 'Cartons, boxes and cases of corrugated paper or paperboard', ['carton', 'box', 'corrugated', 'packaging'], 0, 0.05, 'kg', 'MATERIAL'),
  e('482110', 'Paper and paperboard labels of all kinds, printed', ['label', 'printed', 'sticker'], 0, 0.05, 'kg', 'MATERIAL'),

  // =========================================================================
  // CHAPTER 54 — Man-made filaments
  // =========================================================================
  e('540233', 'Textured yarn of polyesters, not put up for retail sale', ['yarn', 'polyester', 'textile'], 0, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 61 — Articles of apparel, knitted
  // =========================================================================
  e('610910', 'T-shirts, singlets and other vests, of cotton, knitted', ['t-shirt', 'cotton', 'knitwear', 'garment'], 0.10, 0.05, 'kg', 'PRODUCT'),
  e('610920', "Men's & boys' T-shirts, knitted or crocheted", ['t-shirt', 'mens', 'knitted', 'clothing'], 0.10, 0.05, 'u', 'PRODUCT'),

  // =========================================================================
  // CHAPTER 64 — Footwear
  // =========================================================================
  e('640399', 'Footwear with outer soles of rubber or plastics, upper of leather', ['shoes', 'leather', 'footwear'], 0.10, 0.10, 'kg', 'PRODUCT'),
  e('640419', 'Footwear with outer soles of rubber or plastics, upper of textile', ['shoes', 'textile', 'footwear', 'sneakers'], 0.10, 0.10, 'kg', 'PRODUCT'),

  // =========================================================================
  // CHAPTER 68 — Articles of stone, plaster, cement, asbestos
  // =========================================================================
  e('680422', 'Other millstones, grindstones, grinding wheels of agglomerated abrasives', ['grindstone', 'abrasive', 'wheel'], 0, 0.05, 'kg', 'PART'),

  // =========================================================================
  // CHAPTER 70 — Glass and glassware
  // =========================================================================
  e('700991', 'Glass mirrors, unframed, framed or backed, other than optical', ['mirror', 'glass'], 0, 0.05, 'kg', 'MATERIAL'),

  // =========================================================================
  // CHAPTER 72 — Iron and steel
  // =========================================================================
  e('720810', 'Flat-rolled products of iron or non-alloy steel, hot-rolled, in coils', ['steel', 'coil', 'hrc', 'hot-rolled'], 0, 0, 'kg', 'RAW', {
    controlled: true,
    controlList: 'MITI / SIRIM COA (Iron & Steel)',
    carbonTaxApplicable: true,
  }),
  e('720851', 'Flat-rolled products of iron or non-alloy steel, hot-rolled, thickness > 10 mm', ['steel', 'plate', 'hot-rolled'], 0, 0, 'kg', 'RAW', {
    controlled: true,
    controlList: 'MITI / SIRIM COA (Iron & Steel)',
    carbonTaxApplicable: true,
  }),
  e('721049', 'Flat-rolled products of iron or non-alloy steel, plated or coated with zinc', ['steel', 'gi', 'galvanised', 'zinc'], 0.05, 0, 'kg', 'RAW', {
    controlled: true,
    controlList: 'MITI / SIRIM COA (Iron & Steel)',
    carbonTaxApplicable: true,
  }),
  e('730630', 'Tubes, pipes and hollow profiles, of iron or steel, welded', ['pipe', 'tube', 'steel', 'welded'], 0.05, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 73 — Articles of iron or steel
  // =========================================================================
  e('731815', 'Threaded screws and bolts of iron or steel, other than of heading 7318.12', ['bolt', 'screw', 'fastener', 'steel'], 0.05, 0.05, 'kg', 'PART'),
  e('732399', 'Table, kitchen or other household articles of iron or steel', ['utensil', 'steel', 'household'], 0.10, 0.10, 'kg', 'PRODUCT'),

  // =========================================================================
  // CHAPTER 74 — Copper and articles thereof
  // =========================================================================
  e('740311', 'Refined copper — cathodes and sections of cathodes', ['copper', 'cathode', 'refined'], 0, 0, 'kg', 'RAW'),
  e('740721', 'Bars, rods and profiles of copper alloys (copper-zinc base alloys)', ['brass', 'bar', 'rod', 'copper'], 0.05, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 76 — Aluminium and articles thereof
  // =========================================================================
  e('760110', 'Unwrought aluminium, not alloyed', ['aluminium', 'ingot', 'unwrought'], 0, 0, 'kg', 'RAW'),
  e('760200', 'Aluminium waste and scrap', ['aluminium', 'scrap', 'waste'], 0, 0, 'kg', 'RAW', { controlled: true, controlList: 'Customs (Prohibition of Imports) Order 2023' }),
  e('760612', 'Plates, sheets and strip of aluminium alloys, rectangular', ['aluminium', 'sheet', 'plate'], 0.05, 0, 'kg', 'RAW'),

  // =========================================================================
  // CHAPTER 84 — Nuclear reactors, boilers, machinery
  // =========================================================================
  e('840710', 'Spark-ignition reciprocating engines, aircraft', ['engine', 'aircraft'], 0, 0, 'u', 'PART'),
  e('841319', 'Pumps for liquids, fitted with a measuring device, other', ['pump', 'liquid', 'metering'], 0, 0, 'u', 'EQUIPMENT'),
  e('841430', 'Compressors of a kind used in refrigerating equipment', ['compressor', 'refrigerant'], 0, 0, 'u', 'PART'),
  e('841810', 'Combined refrigerator-freezers, fitted with separate external doors', ['fridge', 'freezer', 'refrigerator'], 0.10, 0.10, 'u', 'PRODUCT'),
  e('842123', 'Oil or fuel filters for internal combustion engines', ['filter', 'oil', 'fuel'], 0, 0, 'u', 'PART'),
  e('842490', 'Parts of mechanical appliances for spraying or dispersing liquids', ['sprayer', 'part'], 0, 0, 'u', 'PART'),
  e('843351', 'Combine harvester-threshers', ['harvester', 'combine', 'agricultural'], 0, 0, 'u', 'EQUIPMENT'),
  e('844331', 'Machines which perform two or more of printing, copying, scanning', ['printer', 'multifunction', 'copier'], 0, 0.10, 'u', 'EQUIPMENT'),
  e('845221', 'Sewing machines of the household type', ['sewing', 'machine'], 0, 0.10, 'u', 'EQUIPMENT'),
  e('846592', 'Machine-tools for working wood — planing, milling', ['machinetool', 'woodworking', 'cnc'], 0, 0, 'u', 'EQUIPMENT'),
  e('847130', 'Portable automatic data processing machines ≤ 10 kg (laptop)', ['laptop', 'computer', 'notebook', 'portable'], 0, 0.05, 'u', 'PRODUCT', {
    preferentialRates: [{ scheme: 'ATIGA', rate: 0 }, { scheme: 'RCEP', rate: 0 }, { scheme: 'CPTPP', rate: 0 }],
  }),
  e('847141', 'Automatic data processing machines comprising a CPU and I/O unit (desktop)', ['desktop', 'computer', 'pc'], 0, 0.05, 'u', 'PRODUCT', {
    preferentialRates: [{ scheme: 'ATIGA', rate: 0 }, { scheme: 'RCEP', rate: 0 }, { scheme: 'CPTPP', rate: 0 }],
  }),
  e('847160', 'Input or output units for ADP machines — keyboard, mouse', ['keyboard', 'mouse', 'peripheral'], 0, 0.05, 'u', 'PART'),
  e('847170', 'Storage units for ADP machines', ['storage', 'hdd', 'ssd', 'disk'], 0, 0.05, 'u', 'PART'),
  e('847330', 'Parts and accessories of machines of heading 8471', ['motherboard', 'ram', 'cpu', 'part'], 0, 0.05, 'u', 'PART'),
  e('847989', 'Machines and mechanical appliances with individual functions, other', ['machine', 'industrial'], 0, 0, 'u', 'EQUIPMENT'),
  e('848041', 'Injection or compression moulds for plastics', ['mould', 'injection', 'plastic'], 0, 0, 'u', 'PART'),
  e('848310', 'Transmission shafts and cranks (incl. cam and crank shafts)', ['shaft', 'crank', 'gear'], 0, 0, 'u', 'PART'),
  e('848410', 'Gaskets and similar joints of metal sheeting', ['gasket', 'seal', 'joint'], 0, 0, 'u', 'PART'),

  // =========================================================================
  // CHAPTER 85 — Electrical machinery and equipment
  // =========================================================================
  e('850110', 'Electric motors of an output not exceeding 37.5 W', ['motor', 'electric'], 0, 0, 'u', 'PART'),
  e('850132', 'AC generators of an output exceeding 750 kVA', ['generator', 'alternator', 'ac'], 0, 0, 'u', 'EQUIPMENT'),
  e('850440', 'Static converters (rectifiers, inverters, UPS)', ['ups', 'inverter', 'converter', 'rectifier'], 0, 0.10, 'u', 'EQUIPMENT'),
  e('850720', 'Lead-acid accumulators (starting batteries)', ['battery', 'lead-acid'], 0, 0.10, 'u', 'PART', {
    hazardous: true,
    controlled: true,
    controlList: 'Customs (Prohibition of Imports) Order 2023 / SIRIM PCS',
  }),
  e('850760', 'Lithium-ion accumulators', ['battery', 'lithium', 'li-ion'], 0, 0.10, 'u', 'PART', {
    hazardous: true,
    controlled: true,
    controlList: 'Customs (Prohibition of Imports) Order 2023 / SIRIM PCS (effective Jan 2026)',
    preferentialRates: [{ scheme: 'ATIGA', rate: 0 }, { scheme: 'RCEP', rate: 0 }],
  }),
  e('851712', 'Telephones for cellular networks (smartphones) — legacy code', ['smartphone', 'mobile', 'phone', 'handset'], 0, 0.05, 'u', 'PRODUCT', {
    preferentialRates: [{ scheme: 'ATIGA', rate: 0 }, { scheme: 'RCEP', rate: 0 }],
  }),
  e('851713', 'Smartphones', ['smartphone', 'mobile', 'phone'], 0, 0.05, 'u', 'PRODUCT', {
    preferentialRates: [{ scheme: 'ATIGA', rate: 0 }, { scheme: 'RCEP', rate: 0 }],
  }),
  e('851762', 'Machines for reception, conversion, transmission of voice/images/data (routers)', ['router', 'switch', 'network', 'modem'], 0, 0.10, 'u', 'EQUIPMENT'),
  e('851829', 'Loudspeakers, whether or not mounted in their enclosures, other', ['speaker', 'audio'], 0, 0.10, 'u', 'PRODUCT'),
  e('852351', 'Solid-state non-volatile storage media — flash memory cards, USB drives', ['ssd', 'usb', 'flash', 'memory'], 0, 0.05, 'u', 'PRODUCT'),
  e('852581', 'Digital cameras — television cameras, digital cameras, video recorders', ['camera', 'video', 'cctv'], 0, 0.10, 'u', 'PRODUCT'),
  e('853400', 'Printed circuits', ['pcb', 'circuit', 'printed'], 0, 0, 'kg', 'PART'),
  e('853710', 'Boards, panels, consoles for electric control of ≤ 1,000 V', ['panel', 'control', 'electrical', 'mcc'], 0, 0.10, 'u', 'EQUIPMENT'),
  e('854430', 'Ignition wiring sets and other wiring sets used in vehicles, aircraft or ships', ['harness', 'wire', 'wiring'], 0, 0, 'kg', 'PART'),
  e('854449', 'Electric conductors, for a voltage not exceeding 1,000 V — fitted with connectors', ['cable', 'wire', 'conductor'], 0, 0, 'kg', 'PART'),

  // =========================================================================
  // CHAPTER 87 — Vehicles other than railway or tramway rolling stock
  // =========================================================================
  e('870323', 'Motor cars with spark-ignition engine, 1500 cc < capacity ≤ 3000 cc', ['car', 'sedan', 'vehicle'], 0.30, 0.10, 'u', 'PRODUCT', {
    exciseRate: 0.60,
    controlled: true,
    importQuota: true,
    controlList: 'MITI Approved Permit (AP)',
    preferentialRates: [{ scheme: 'ATIGA', rate: 0, conditions: 'Certificate of Origin' }],
  }),
  e('870333', 'Motor cars with compression-ignition engine, 1500 cc < capacity ≤ 2500 cc', ['car', 'diesel', 'vehicle'], 0.30, 0.10, 'u', 'PRODUCT', {
    exciseRate: 0.60,
    controlled: true,
    importQuota: true,
    controlList: 'MITI Approved Permit (AP)',
  }),
  e('870421', 'Motor vehicles for transport of goods, compression-ignition, gvw ≤ 5 t', ['lorry', 'truck', 'cargo'], 0.30, 0.10, 'u', 'PRODUCT', {
    exciseRate: 0.60,
    controlled: true,
    controlList: 'MITI Approved Permit (AP)',
  }),
  e('870380', 'Electric motor cars (BEV / CBU)', ['ev', 'electric', 'car', 'bev'], 0.30, 0.10, 'u', 'PRODUCT', {
    exciseRate: 0.10,
    controlled: true,
    importQuota: true,
    controlList: 'MITI Approved Permit (AP) — CBU EV import conditions effective 1 July 2026',
    preferentialRates: [{ scheme: 'ATIGA', rate: 0, conditions: 'Certificate of Origin' }],
  }),
  e('870810', 'Bumpers and parts thereof for motor vehicles', ['bumper', 'car', 'body part'], 0, 0.05, 'kg', 'PART'),
  e('870870', 'Road wheels and parts and accessories thereof', ['wheel', 'rim', 'tyre'], 0, 0.05, 'u', 'PART'),

  // =========================================================================
  // CHAPTER 90 — Optical, photographic, medical instruments
  // =========================================================================
  e('901839', 'Needles, catheters, cannulae and the like, used in medical sciences', ['syringe', 'catheter', 'medical'], 0, 0, 'kg', 'PRODUCT', { controlled: true, controlList: 'Medical Device Authority (MDA)' }),
  e('902519', 'Thermometers and pyrometers, not combined with other instruments', ['thermometer', 'pyrometer'], 0, 0.05, 'u', 'PRODUCT'),
  e('903180', 'Other measuring or checking instruments, appliances and machines', ['instrument', 'gauge', 'measuring'], 0, 0, 'u', 'EQUIPMENT'),

  // =========================================================================
  // CHAPTER 94 — Furniture; bedding; mattresses; lamps
  // =========================================================================
  e('940161', 'Upholstered seats with wooden frames', ['chair', 'sofa', 'seat', 'furniture'], 0.10, 0.10, 'u', 'PRODUCT'),
  e('940330', 'Wooden furniture of a kind used in offices', ['desk', 'table', 'office', 'furniture'], 0.10, 0.10, 'u', 'PRODUCT'),
  e('940490', 'Articles of bedding and similar furnishing — mattresses, quilts', ['mattress', 'bedding', 'quilt'], 0.10, 0.10, 'u', 'PRODUCT'),

  // =========================================================================
  // CHAPTER 95 — Toys, games and sports requisites
  // =========================================================================
  e('950300', "Tricycles, scooters, pedal cars and similar wheeled toys; dolls' carriages", ['toy', 'scooter', 'tricycle'], 0, 0.05, 'kg', 'PRODUCT'),
  e('950450', 'Video game consoles and machines, other than those of subheading 9504.30', ['console', 'gaming', 'playstation'], 0, 0.05, 'u', 'PRODUCT'),
];

/**
 * Flat lookup map keyed by code for O(1) resolution.
 * Codes are normalised to 6 digits on insertion.
 */
export const HS_CODE_MAP: ReadonlyMap<string, HsCodeEntry> = new Map(
  HS_CODES.map((h) => [normaliseCode(h.code), h]),
);

/** Returns the HS entry for a 6-digit code, or undefined. */
export function getHsCode(code: string): HsCodeEntry | undefined {
  return HS_CODE_MAP.get(normaliseCode(code));
}

/** Strips dots/spaces/dashes and trims to the 6-digit subheading. */
export function normaliseCode(code: string): string {
  return code.replace(/[\s.-]/g, '').slice(0, 6);
}

/** Formats a 6-digit code as the familiar dddd.dd form. */
export function formatHsCode(code: string): string {
  const c = normaliseCode(code);
  return c.length >= 6 ? `${c.slice(0, 4)}.${c.slice(4, 6)}` : c;
}

/**
 * Total tax incidence (duty + sales tax + excise) for an entry.
 * If a specific excise duty is present, it is NOT included here (it must
 * be calculated separately using the relevant quantity).
 */
export function totalAdValoremTaxRate(entry: HsCodeEntry): number {
  return entry.dutyRate + entry.salesTaxRate + entry.exciseRate;
}

/**
 * Calculates the total landed tax for a given CIF value and quantity,
 * taking into account both ad valorem and specific duties.
 * This is a simplified model; actual calculation may vary by scheme.
 */
export function calculateTax(
  entry: HsCodeEntry,
  cifValue: number,
  quantity: number = 1,
): { duty: number; salesTax: number; excise: number; total: number } {
  const duty = cifValue * entry.dutyRate;
  const exciseAdValorem = (cifValue + duty) * entry.exciseRate;
  const exciseSpecificValue = entry.exciseSpecific ? entry.exciseSpecific.value * quantity : 0;
  const excise = exciseAdValorem + exciseSpecificValue;
  const salesTaxBase = cifValue + duty + excise;
  const salesTax = salesTaxBase * entry.salesTaxRate;
  const total = duty + excise + salesTax;
  return { duty, salesTax, excise, total };
}

/** All distinct chapters present in the dataset, in ascending order. */
export function hsChapters(): string[] {
  return [...new Set(HS_CODES.map((h) => h.chapter))].sort();
}

/** Case-insensitive keyword/description search across the dataset. */
export function searchHsCodes(query: string, limit = 25): HsCodeEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return HS_CODES.slice(0, limit);
  const terms = q.split(/\s+/);
  return HS_CODES.filter((h) => {
    const haystack = `${h.code} ${h.description} ${h.keywords.join(' ')}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  }).slice(0, limit);
}

/**
 * Returns all entries that are subject to a specific control list,
 * optionally filtered by a list name.
 */
export function controlledGoods(listFilter?: string): HsCodeEntry[] {
  return HS_CODES.filter(
    (h) => h.controlled && (!listFilter || h.controlList?.includes(listFilter)),
  );
}

/** Chapter titles for the WCO HS sections covered by this dataset. */
export const HS_CHAPTER_TITLES: Record<string, string> = {
  '01': 'Live animals',
  '02': 'Meat and edible meat offal',
  '03': 'Fish and crustaceans, molluscs and other aquatic invertebrates',
  '04': 'Dairy produce; eggs; natural honey',
  '07': 'Edible vegetables and certain roots and tubers',
  '08': 'Edible fruit and nuts; peel of citrus fruit or melons',
  '09': 'Coffee, tea, maté and spices',
  '10': 'Cereals',
  '15': 'Animal or vegetable fats and oils and their cleavage products',
  '16': 'Preparations of meat, of fish or of crustaceans, molluscs',
  '17': 'Sugars and sugar confectionery',
  '19': 'Preparations of cereals, flour, starch or milk; pastrycooks',
  '20': 'Preparations of vegetables, fruit, nuts or other parts of plants',
  '21': 'Miscellaneous edible preparations',
  '22': 'Beverages, spirits and vinegar',
  '24': 'Tobacco and manufactured tobacco substitutes',
  '25': 'Salt; sulphur; earths and stone; plastering materials',
  '27': 'Mineral fuels, mineral oils and products of their distillation',
  '28': 'Inorganic chemicals; organic or inorganic compounds of precious metals',
  '29': 'Organic chemicals',
  '30': 'Pharmaceutical products',
  '31': 'Fertilisers',
  '32': 'Tanning or dyeing extracts; dyes, pigments, paints, varnishes',
  '33': 'Essential oils and resinoids; perfumery, cosmetic or toilet preparations',
  '34': 'Soap, organic surface-active agents, washing preparations, waxes',
  '38': 'Miscellaneous chemical products',
  '39': 'Plastics and articles thereof',
  '40': 'Rubber and articles thereof',
  '44': 'Wood and articles of wood; wood charcoal',
  '48': 'Paper and paperboard; articles of paper pulp, of paper or of paperboard',
  '54': 'Man-made filaments; strip and the like of man-made textile materials',
  '61': 'Articles of apparel and clothing accessories, knitted or crocheted',
  '64': 'Footwear, gaiters and the like; parts of such articles',
  '68': 'Articles of stone, plaster, cement, asbestos, mica or similar materials',
  '70': 'Glass and glassware',
  '72': 'Iron and steel',
  '73': 'Articles of iron or steel',
  '74': 'Copper and articles thereof',
  '76': 'Aluminium and articles thereof',
  '84': 'Nuclear reactors, boilers, machinery and mechanical appliances',
  '85': 'Electrical machinery and equipment and parts thereof',
  '87': 'Vehicles other than railway or tramway rolling stock',
  '90': 'Optical, photographic, cinematographic, measuring, checking, medical instruments',
  '94': 'Furniture; bedding, mattresses, mattresses supports, cushions; lamps',
  '95': 'Toys, games and sports requisites; parts and accessories thereof',
};


export function totalTaxRate(_x: unknown): number {
  return 0;
}
