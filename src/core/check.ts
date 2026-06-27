import type { Action, CheckOptions, Decision, DecisionType, PolicyResult, RiskLevel } from "./types.ts";
import { runPolicies } from "./policies.ts";
import { createAuditEvent } from "./audit.ts";

const decisionPriority: Record<DecisionType, number> = {
  BLOCK: 5,
  ASK_CLARIFICATION: 4,
  REQUIRE_HUMAN_APPROVAL: 3,
  CONDITIONAL_ALLOW: 2,
  ALLOW: 1
};

const riskPriority: Record<RiskLevel, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

function resolvePolicy(results: PolicyResult[]): PolicyResult {
  if (results.length === 0) {
    return {
      policy: "DEFAULT_ALLOW",
      decision: "ALLOW",
      risk_level: "low",
      reason: "No policy blocked or escalated the action."
    };
  }

  return [...results].sort((a, b) => {
    const byDecision = decisionPriority[b.decision] - decisionPriority[a.decision];
    if (byDecision !== 0) return byDecision;
    return riskPriority[b.risk_level] - riskPriority[a.risk_level];
  })[0];
}

export function check(action: Action, options: CheckOptions = {}): Decision {
  const results = runPolicies(action, options);
  const winner = resolvePolicy(results);

  const conditions = results.flatMap(r => r.conditions ?? []);
  const missingInformation = results.flatMap(r => r.missing_information ?? []);
  const triggeredPolicies = results.map(r => r.policy);

  const decision: Decision = {
    decision: winner.decision,
    allowed: winner.decision === "ALLOW" || winner.decision === "CONDITIONAL_ALLOW",
    risk_level: winner.risk_level,
    reason: winner.reason,
    conditions,
    missing_information: missingInformation,
    triggered_policies: triggeredPolicies
  };

  if (decision.decision !== "ALLOW") {
    decision.audit_id = `dgr_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    if (options.onAudit) {
      options.onAudit(createAuditEvent(action, decision));
    }
  }

  return decision;
}
