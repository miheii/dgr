import type { Action, AuditEvent, Decision } from "./types.ts";

export function createAuditEvent(action: Action, decision: Decision): AuditEvent {
  return {
    audit_id: decision.audit_id ?? `dgr_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    action_id: action.action_id,
    agent_id: action.agent_id,
    tool_name: action.tool_name,
    action_type: action.action_type,
    decision: decision.decision,
    reason: decision.reason,
    risk_level: decision.risk_level,
    triggered_policies: decision.triggered_policies,
    timestamp: new Date().toISOString()
  };
}
