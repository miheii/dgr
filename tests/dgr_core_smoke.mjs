const { check } = await import("../src/core/index.ts");

const baseEffects = {
  external_effect: false,
  data_change: false,
  money_movement: false,
  permission_change: false,
  production_impact: false,
  customer_facing: false,
  public_visibility: false
};

const cases = [
  {
    name: "READ_ONLY_SUMMARIZE",
    expected: "ALLOW",
    action: {
      tool_name: "docs",
      action_type: "summarize",
      mode: "read",
      environment: "local",
      scope: "single",
      effects: { ...baseEffects },
      reversibility: "reversible",
      tool_trust: "trusted",
      target: "project_docs"
    }
  },
  {
    name: "SEND_WHATSAPP_TO_ALL_CUSTOMERS",
    expected: "REQUIRE_HUMAN_APPROVAL",
    action: {
      tool_name: "whatsapp",
      action_type: "send_whatsapp",
      mode: "execute",
      environment: "production",
      scope: "bulk",
      effects: { ...baseEffects, external_effect: true, customer_facing: true },
      reversibility: "irreversible",
      tool_trust: "trusted",
      target: "all_customers"
    }
  },
  {
    name: "DRAFT_WHATSAPP_TO_OWNER",
    expected: "CONDITIONAL_ALLOW",
    condition: "draft_only",
    action: {
      tool_name: "whatsapp",
      action_type: "send_whatsapp",
      mode: "draft",
      environment: "production",
      scope: "single",
      effects: { ...baseEffects, external_effect: true },
      reversibility: "reversible",
      tool_trust: "trusted",
      target: "owner"
    }
  },
  {
    name: "DELETE_RECORDS_UNKNOWN_SCOPE",
    expected: "ASK_CLARIFICATION",
    missing: "scope",
    action: {
      tool_name: "database",
      action_type: "delete_records",
      mode: "execute",
      environment: "production",
      scope: "unknown",
      effects: { ...baseEffects, data_change: true },
      reversibility: "irreversible",
      tool_trust: "trusted",
      target: "records"
    }
  },
  {
    name: "DELETE_RECORDS_KNOWN_SCOPE",
    expected: "REQUIRE_HUMAN_APPROVAL",
    action: {
      tool_name: "database",
      action_type: "delete_records",
      mode: "execute",
      environment: "production",
      scope: "batch",
      effects: { ...baseEffects, data_change: true },
      reversibility: "irreversible",
      tool_trust: "trusted",
      target: "records"
    }
  },
  {
    name: "DRY_RUN_DELETE",
    expected: "CONDITIONAL_ALLOW",
    condition: "dry_run_only",
    action: {
      tool_name: "database",
      action_type: "delete_records",
      mode: "dry_run",
      environment: "production",
      scope: "batch",
      effects: { ...baseEffects, data_change: true },
      reversibility: "irreversible",
      tool_trust: "trusted",
      target: "records"
    }
  },
  {
    name: "PRODUCTION_DEPLOY",
    expected: "REQUIRE_HUMAN_APPROVAL",
    action: {
      tool_name: "deploy",
      action_type: "deploy",
      mode: "execute",
      environment: "production",
      scope: "single",
      effects: { ...baseEffects, production_impact: true },
      reversibility: "partial",
      tool_trust: "trusted",
      target: "production"
    }
  },
  {
    name: "REFUND_CUSTOMER",
    expected: "REQUIRE_HUMAN_APPROVAL",
    action: {
      tool_name: "stripe",
      action_type: "refund_customer",
      mode: "execute",
      environment: "production",
      scope: "single",
      effects: { ...baseEffects, money_movement: true },
      reversibility: "partial",
      tool_trust: "trusted",
      target: "customer_123"
    }
  },
  {
    name: "GRANT_ADMIN_ROLE",
    expected: "REQUIRE_HUMAN_APPROVAL",
    action: {
      tool_name: "admin",
      action_type: "grant_admin_role",
      mode: "execute",
      environment: "production",
      scope: "single",
      effects: { ...baseEffects, permission_change: true },
      reversibility: "partial",
      tool_trust: "trusted",
      target: "user_123"
    }
  },
  {
    name: "UNTRUSTED_MCP_TOOL",
    expected: "BLOCK",
    action: {
      tool_name: "unknown_mcp_tool",
      action_type: "call_tool",
      mode: "execute",
      environment: "production",
      scope: "single",
      effects: { ...baseEffects },
      reversibility: "unknown",
      tool_trust: "untrusted",
      target: "resource"
    }
  }
];

let passed = 0;

for (const item of cases) {
  const decision = check(item.action);
  const ok =
    decision.decision === item.expected &&
    (!item.condition || decision.conditions.includes(item.condition)) &&
    (!item.missing || decision.missing_information.includes(item.missing));

  if (ok) passed++;

  console.log(`${ok ? "PASS" : "FAIL"} ${item.name}: expected=${item.expected} actual=${decision.decision}`);
}

console.log("");
console.log(`RESULT: ${passed}/${cases.length}`);

if (passed !== cases.length) {
  process.exit(1);
}
