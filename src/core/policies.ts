import type { Action, CheckOptions, PolicyResult } from "./types.ts";

function hasTarget(action: Action): boolean {
  if (action.target === null || action.target === undefined) return false;
  if (typeof action.target === "string" && action.target.trim() === "") return false;
  return true;
}

function isDestructive(action: Action): boolean {
  const value = `${action.action_type} ${action.tool_name}`.toLowerCase();
  return (
    ["delete", "remove", "destroy", "drop", "truncate", "reset", "wipe", "purge", "overwrite"]
      .some(word => value.includes(word)) ||
    (action.reversibility === "irreversible" && action.effects.data_change)
  );
}

function allEffectsFalse(action: Action): boolean {
  return Object.values(action.effects).every(BooleanValue => BooleanValue === false);
}

export function runPolicies(action: Action, options: CheckOptions = {}): PolicyResult[] {
  const results: PolicyResult[] = [];
  const unknownToolBehavior = options.unknown_tool_behavior ?? "allow";

  if (action.tool_trust === "untrusted") {
    results.push({
      policy: "UNTRUSTED_TOOL_BLOCK",
      decision: "BLOCK",
      risk_level: "critical",
      reason: "Tool is explicitly marked as untrusted."
    });
    return results;
  }

  if (action.mode !== "read" && !hasTarget(action)) {
    results.push({
      policy: "MISSING_TARGET_CLARIFICATION",
      decision: "ASK_CLARIFICATION",
      risk_level: "medium",
      reason: "Execution target is missing.",
      missing_information: ["target"]
    });
    return results;
  }

  const needsScope =
    action.effects.data_change ||
    action.effects.external_effect ||
    action.effects.money_movement ||
    action.effects.permission_change;

  if (action.scope === "unknown" && action.mode !== "dry_run" && needsScope) {
    results.push({
      policy: "UNKNOWN_SCOPE_CLARIFICATION",
      decision: "ASK_CLARIFICATION",
      risk_level: "high",
      reason: "Affected scope is unknown.",
      missing_information: ["scope"]
    });
    return results;
  }

  if (options.deny_tools?.includes(action.tool_name)) {
    results.push({
      policy: "TOOL_ALLOWLIST_DENYLIST",
      decision: "BLOCK",
      risk_level: "high",
      reason: "Tool is explicitly denied."
    });
    return results;
  }

  if (options.allow_tools && !options.allow_tools.includes(action.tool_name)) {
    results.push({
      policy: "TOOL_ALLOWLIST_DENYLIST",
      decision: unknownToolBehavior === "approval" ? "REQUIRE_HUMAN_APPROVAL" : "BLOCK",
      risk_level: "high",
      reason: "Tool is not included in allowlist."
    });
    return results;
  }

  if (action.mode === "draft" && action.effects.external_effect) {
    results.push({
      policy: "DRAFT_COMMUNICATION_CONDITIONAL_ALLOW",
      decision: "CONDITIONAL_ALLOW",
      risk_level: "low",
      reason: "Draft mode is allowed; sending requires approval.",
      conditions: ["draft_only"]
    });
    return results;
  }

  if (action.mode === "dry_run") {
    results.push({
      policy: "DRY_RUN_CONDITIONAL_ALLOW",
      decision: "CONDITIONAL_ALLOW",
      risk_level: "low",
      reason: "Dry-run is allowed; real execution requires approval.",
      conditions: ["dry_run_only"]
    });
    return results;
  }

  if (
    ["local", "dev", "test"].includes(action.environment) &&
    action.mode === "execute" &&
    action.effects.production_impact === false
  ) {
    results.push({
      policy: "SANDBOX_CONDITIONAL_ALLOW",
      decision: "CONDITIONAL_ALLOW",
      risk_level: "low",
      reason: "Sandbox execution is conditionally allowed.",
      conditions: ["sandbox_only"]
    });
    return results;
  }

  if (action.effects.money_movement) {
    results.push({
      policy: "MONEY_MOVEMENT_APPROVAL",
      decision: "REQUIRE_HUMAN_APPROVAL",
      risk_level: "critical",
      reason: "Money movement requires human approval."
    });
  }

  if (action.effects.permission_change) {
    results.push({
      policy: "PERMISSION_CHANGE_APPROVAL",
      decision: "REQUIRE_HUMAN_APPROVAL",
      risk_level: "critical",
      reason: "Permission change requires human approval."
    });
  }

  if (
    action.environment === "production" &&
    (action.effects.data_change || action.effects.production_impact || action.effects.permission_change)
  ) {
    results.push({
      policy: "PRODUCTION_CHANGE_APPROVAL",
      decision: "REQUIRE_HUMAN_APPROVAL",
      risk_level: "high",
      reason: "Production-impacting action requires human approval."
    });
  }

  if (isDestructive(action)) {
    results.push({
      policy: "DESTRUCTIVE_ACTION_APPROVAL",
      decision: "REQUIRE_HUMAN_APPROVAL",
      risk_level: "high",
      reason: "Destructive action requires human approval."
    });
  }

  if (action.effects.external_effect && action.mode === "execute") {
    results.push({
      policy: "EXTERNAL_COMMUNICATION_APPROVAL",
      decision: "REQUIRE_HUMAN_APPROVAL",
      risk_level: "high",
      reason: "External communication requires human approval before execution."
    });
  }

  if (action.effects.customer_facing && action.mode === "execute") {
    results.push({
      policy: "CUSTOMER_FACING_APPROVAL",
      decision: "REQUIRE_HUMAN_APPROVAL",
      risk_level: "high",
      reason: "Customer-facing action requires human approval."
    });
  }

  if (action.effects.public_visibility && action.mode === "execute") {
    results.push({
      policy: "PUBLIC_PUBLISHING_APPROVAL",
      decision: "REQUIRE_HUMAN_APPROVAL",
      risk_level: "high",
      reason: "Public publishing requires human approval."
    });
  }

  if (action.mode === "read" && allEffectsFalse(action)) {
    results.push({
      policy: "READ_ONLY_ALLOW",
      decision: "ALLOW",
      risk_level: "low",
      reason: "Read-only action with no external side effects."
    });
  }

  return results;
}
