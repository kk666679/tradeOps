import type { DeclarationSubmission } from "../types";

export const SAMPLE_K1: DeclarationSubmission = {
  draftRef: "DRAFT-K1-2026-0001",
  idempotencyKey: "idem-dev-0001-0000000000000000",
  tenantId: "demo-pool",
  brokerCode: "EK/PPG/2026/00842",
  formCode: "K1",
  procedureCode: "4000",
  portOfEntry: "PG",
  importerName: "Meridian Electronics Sdn Bhd",
  importerRegistration: "201801004821-K",
  exporterName: "Shenzhen Micro Components Ltd",
  exporterCountry: "CN",
  blNumber: "MSCU1234567",
  invoiceNumber: "INV-2026-00123",
  invoiceDate: "2026-01-15",
  currency: "USD",
  totalFOB: 95_000,
  totalFreight: 3_200,
  totalInsurance: 180,
  totalCIFMYR: 486_300,
  lineItems: [
    {
      lineNumber: 1, hsCode: "85444200", description: "Connectors for optical fibres",
      quantity: 1200, uom: "PCS", unitValueMYR: 380, countryOfOrigin: "CN",
      preferenceScheme: "ACFTA",
    },
    {
      lineNumber: 2, hsCode: "85369090", description: "Connection and contact elements",
      quantity: 480, uom: "PCS", unitValueMYR: 62, countryOfOrigin: "CN",
      preferenceScheme: "ACFTA",
    },
  ],
};
