// components/brokerage/workflow/nodes/index.ts
export { LaneNode } from "./LaneNode";
export { ClientNode } from "./ClientNode";
export { DeclarationNode } from "./DeclarationNode";
export { AgentNode } from "./AgentNode";
export { HumanGateNode } from "./HumanGateNode";
export { ComplianceNode } from "./ComplianceNode";
export { AccreditationNode } from "./AccreditationNode";

import { LaneNode } from "./LaneNode";
import { ClientNode } from "./ClientNode";
import { DeclarationNode } from "./DeclarationNode";
import { AgentNode } from "./AgentNode";
import { HumanGateNode } from "./HumanGateNode";
import { ComplianceNode } from "./ComplianceNode";
import { AccreditationNode } from "./AccreditationNode";

export const brokerageNodeTypes = Object.freeze({
  lane: LaneNode, client: ClientNode, declaration: DeclarationNode,
  agent: AgentNode, "human-gate": HumanGateNode, compliance: ComplianceNode,
  accreditation: AccreditationNode,
});
