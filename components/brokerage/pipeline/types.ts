// components/brokerage/pipeline/types.ts
import type { CustomsChannel, CustomsFormCode, Declaration, DeclarationFlag, PipelineColumnDef } from "../types";
export type { PipelineColumnDef };

export interface PipelineProps {
  declarations: Declaration[];
  columns: PipelineColumnDef[];
  onCardClick?: (declaration: Declaration) => void;
  onCardDragEnd?: (declaration: Declaration, toColumnId: string) => void;
  className?: string;
}

export interface PipelineFiltersState {
  search: string;
  forms: Set<CustomsFormCode>;
  flags: Set<DeclarationFlag>;
  channels: Set<CustomsChannel>;
}
