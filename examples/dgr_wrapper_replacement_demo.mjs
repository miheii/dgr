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

function beforeCustomWhatsappWrapper(toolCall) {
  if (!toolCall.target) {
    return {
      decision: "ASK_CLARIFICATION",
      reason: "Missing recipient target"
    };
  }

  if (toolCall.mode === "draft") {
    return {
      decision: "CONDITIONAL_ALLOW",
      reason: "Draft only",
      conditions: ["draft_only"]
    };
  }

  const isExternal = toolCall.channel === "whatsapp";
  const isBulk = toolCall.target === "all_customers";

  if (isExternal || isBulk) {
    return {
      decision: "REQUIRE_HUMAN_APPROVAL",
      reason: "External bulk WhatsApp requires approval"
    };
  }

  return {
    decision: "ALLOW",
    reason: "Low-risk message"
  };
}

function afterDgrWhatsappWrapper(toolCall) {
  return check({
    tool_name: "whatsapp",
    action_type: "send_whatsapp",
    mode: toolCall.mode,
    environment: "production",
    scope: toolCall.target === "all_customers" ? "bulk" : "single",
    target: toolCall.target,
    tool_trust: "trusted",
    reversibility: toolCall.mode === "draft" ? "reversible" : "irreversible",
    effects: {
      ...baseEffects,
      external_effect: true,
      customer_facing: true
    }
  });
}

function beforeCustomDeleteWrapper(toolCall) {
  if (!toolCall.target) {
    return {
      decision: "ASK_CLARIFICATION",
      reason: "Missing delete target"
    };
  }

  if (toolCall.scope === "unknown") {
    return {
      decision: "ASK_CLARIFICATION",
      reason: "Affected scope is unknown"
    };
  }

  if (toolCall.mode === "dry_run") {
    return {
      decision: "CONDITIONAL_ALLOW",
      reason: "Dry-run only",
      conditions: ["dry_run_only"]
    };
  }

  if (toolCall.action_type.includes("delete")) {
    return {
      decision: "REQUIRE_HUMAN_APPROVAL",
      reason: "Destructive action requires approval"
    };
  }

  return {
    decision: "ALLOW",
    reason: "Allowed"
  };
}

function afterDgrDeleteWrapper(toolCall) {
  return check({
    tool_name: "database",
    action_type: toolCall.action_type,
    mode: toolCall.mode,
    environment: "production",
    scope: toolCall.scope,
    target: toolCall.target,
    tool_trust: "trusted",
    reversibility: "irreversible",
    effects: {
      ...baseEffects,
      data_change: true,
      production_impact: true
    }
  });
}

function beforeCustomRefundWrapper(toolCall) {
  if (!toolCall.customerId) {
    return {
      decision: "ASK_CLARIFICATION",
      reason: "Missing customer"
    };
  }

  if (toolCall.amount > 0) {
    return {
      decision: "REQUIRE_HUMAN_APPROVAL",
      reason: "Refund requires approval"
    };
  }

  return {
    decision: "ALLOW",
    reason: "Allowed"
  };
}

function afterDgrRefundWrapper(toolCall) {
  return check({
    tool_name: "stripe",
    action_type: "refund_customer",
    mode: "execute",
    environment: "production",
    scope: "single",
    target: toolCall.customerId,
    tool_trust: "trusted",
    reversibility: "partial",
    effects: {
      ...baseEffects,
      external_effect: true,
      data_change: true,
      money_movement: true,
      production_impact: true,
      customer_facing: true
    }
  });
}

const demos = [
  {
    name: "WHATSAPP_BULK_SEND",
    before: beforeCustomWhatsappWrapper({
      channel: "whatsapp",
      mode: "execute",
      target: "all_customers"
    }),
    after: afterDgrWhatsappWrapper({
      channel: "whatsapp",
      mode: "execute",
      target: "all_customers"
    }),
    expected: "REQUIRE_HUMAN_APPROVAL"
  },
  {
    name: "WHATSAPP_DRAFT",
    before: beforeCustomWhatsappWrapper({
      channel: "whatsapp",
      mode: "draft",
      target: "owner"
    }),
    after: afterDgrWhatsappWrapper({
      channel: "whatsapp",
      mode: "draft",
      target: "owner"
    }),
    expected: "CONDITIONAL_ALLOW"
  },
  {
    name: "DELETE_UNKNOWN_SCOPE",
    before: beforeCustomDeleteWrapper({
      action_type: "delete_records",
      mode: "execute",
      scope: "unknown",
      target: "records"
    }),
    after: afterDgrDeleteWrapper({
      action_type: "delete_records",
      mode: "execute",
      scope: "unknown",
      target: "records"
    }),
    expected: "ASK_CLARIFICATION"
  },
  {
    name: "DRY_RUN_DELETE",
    before: beforeCustomDeleteWrapper({
      action_type: "delete_records",
      mode: "dry_run",
      scope: "batch",
      target: "records"
    }),
    after: afterDgrDeleteWrapper({
      action_type: "delete_records",
      mode: "dry_run",
      scope: "batch",
      target: "records"
    }),
    expected: "CONDITIONAL_ALLOW"
  },
  {
    name: "REFUND_CUSTOMER",
    before: beforeCustomRefundWrapper({
      customerId: "customer_123",
      amount: 50
    }),
    after: afterDgrRefundWrapper({
      customerId: "customer_123",
      amount: 50
    }),
    expected: "REQUIRE_HUMAN_APPROVAL"
  }
];

let passed = 0;

console.log("");
console.log("DGR WRAPPER REPLACEMENT DEMO");
console.log("=====================================");
console.log("");

for (const demo of demos) {
  const beforeDecision = demo.before.decision;
  const afterDecision = demo.after.decision;

  const ok =
    beforeDecision === demo.expected &&
    afterDecision === demo.expected;

  if (ok) passed++;

  console.log(`${ok ? "PASS" : "FAIL"} ${demo.name}`);
  console.log(`  before custom wrapper: ${beforeDecision}`);
  console.log(`  after DGR check():     ${afterDecision}`);
  console.log("");
}

console.log("=====================================");
console.log(`RESULT: ${passed}/${demos.length}`);

if (passed !== demos.length) {
  process.exit(1);
}
