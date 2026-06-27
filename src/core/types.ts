export type DecisionType =
  | "ALLOW"
  | "BLOCK"
  | "ASK_CLARIFICATION"
  | "CONDITIONAL_ALLOW"
  | "REQUIRE_HUMAN_APPROVAL";

export type Mode = "read" | "draft" | "dry_run" | "execute";

export type Environment =
  | "local"
  | "dev"
  | "test"
  | "staging"
  | "production"
  | "unknown";

export type Scope = "single" | "batch" | "bulk" | "unknown";

export type Reversibility =
  | "reversible"
  | "partial"
  | "irreversible"
  | "unknown";

export type ToolTrust = "trusted" | "untrusted" | "unknown";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type EffectFlags = {
  external_effect: boolean;
  data_change: boolean;
  money_movement: boolean;
  permission_change: boolean;
  production_impact: boolean;
  customer_facing: boolean;
  public_visibility: boolean;
};

export type Action = {
  action_id?: string;
  agent_id?: string;
  tool_name: string;
  action_type: string;
  mode: Mode;
  environment: Environment;
  scope: Scope;
  effects: EffectFlags;
  reversibility: Reversibility;
  tool_trust: ToolTrust;
  target?: unknown;
  metadata?: Record<string, unknown>;
};

export type PolicyResult = {
  policy: string;
  decision: DecisionType;
  risk_level: RiskLevel;
  reason: string;
  conditions?: string[];
  missing_information?: string[];
};

export type Decision = {
  decision: DecisionType;
  allowed: boolean;
  risk_level: RiskLevel;
  reason: string;
  conditions: string[];
  missing_information: string[];
  triggered_policies: string[];
  audit_id?: string;
};

export type AuditEvent = {
  audit_id: string;
  action_id?: string;
  agent_id?: string;
  tool_name: string;
  action_type: string;
  decision: DecisionType;
  reason: string;
  risk_level: RiskLevel;
  triggered_policies: string[];
  timestamp: string;
};

export type CheckOptions = {
  allow_tools?: string[];
  deny_tools?: string[];
  unknown_tool_behavior?: "allow" | "block" | "approval";
  onAudit?: (event: AuditEvent) => void;
};
