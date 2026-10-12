// components/brokerage/registry.ts
import type { CustomsFormCode, EjenType, RegulatoryControl } from "./types";
import {
  ACCREDITATION_STATUS_META, DECLARATION_FORM_META, DECLARATION_STATUS_COLOR,
  DECLARATION_STATUS_LABEL, EJEN_TYPE_COLOR, FLAG_META, REGISTRATION_BAND_META,
} from "./constants";
import { JKDM_CONTROL_CATALOG } from "./regulatory";

export interface EjenTypeDescriptor {
  code: EjenType; label: string; labelMs: string;
  description: string; color: string; legalRef: string;
}

export const EJEN_TYPE_REGISTRY: Record<EjenType, EjenTypeDescriptor> = {
  penghantaran: {
    code: "penghantaran", label: "Forwarding Agent", labelMs: "Ejen Penghantaran",
    description: "Manages declaration and release of cargo from customs control. New applications frozen except for IILS-approved companies.",
    color: EJEN_TYPE_COLOR.penghantaran, legalRef: "Customs Act 1967 §90(1)(i)",
  },
  perkapalan: {
    code: "perkapalan", label: "Shipping Agent", labelMs: "Ejen Perkapalan",
    description: "Manages matters relating to the entry or departure of vessels. New applications remain open.",
    color: EJEN_TYPE_COLOR.perkapalan, legalRef: "Customs Act 1967 §90(1)(ii)",
  },
  pengangkut_barang: {
    code: "pengangkut_barang", label: "Freight Forwarder", labelMs: "Ejen Pengangkut Barang",
    description: "Manages declaration of sea and air manifests. Not subject to the interview requirement, and not subject to Bumiputera participation requirements (unless also a Forwarding Agent).",
    color: EJEN_TYPE_COLOR.pengangkut_barang, legalRef: "Customs Act 1967 §90(1)(iii)",
  },
};

export const DECLARATION_FORM_REGISTRY = DECLARATION_FORM_META;
export const ACCREDITATION_REGISTRY = ACCREDITATION_STATUS_META;
export const BUMPUTERA_REGISTRY = REGISTRATION_BAND_META;
export const FLAG_REGISTRY = FLAG_META;
export const DECLARATION_STATUS_REGISTRY = {
  label: DECLARATION_STATUS_LABEL,
  color: DECLARATION_STATUS_COLOR,
};

/** Look up a control by ID from the active catalog. */
export function findControl(
  id: string,
  catalog: RegulatoryControl[] = JKDM_CONTROL_CATALOG
): RegulatoryControl | undefined {
  return catalog.find((c) => c.id === id);
}

export function getFormMeta(code: CustomsFormCode) {
  return DECLARATION_FORM_META[code];
}
