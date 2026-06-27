# DGR — Tool-call guard for AI agents

Stop writing the same tool-call wrapper in every AI project.

DGR is a small local deterministic SDK that checks risky AI tool actions before execution.

It helps decide whether a tool action should be:

- allowed
- blocked
- sent for human approval
- clarified before execution
- allowed only under safe conditions

No cloud.
No dashboard.
No AI reasoning.
No workflow engine.

Just:

    const decision = check(action);

---

## Install

Until the npm package is published, install directly from GitHub:

    npm install github:miheii/dgr

After npm publication, installation will be:

    npm install @dgr/core

---

## Requirements

- Node.js 22+
- npm
- ESM import support

---

## Quick start

Create `test.mjs`:

    import { check } from "@dgr/core";

    const action = {
      tool_name: "email",
      action_type: "send_email",
      mode: "execute",
      environment: "production",
      scope: "single",
      target: "customer@example.com",
      tool_trust: "trusted",
      reversibility: "irreversible",
      effects: {
        external_effect: true,
        data_change: false,
        money_movement: false,
        permission_change: false,
        production_impact: false,
        customer_facing: true,
        public_visibility: false
      }
    };

    const decision = check(action);

    console.log(decision);

Run:

    node test.mjs

Expected result:

    {
      decision: "REQUIRE_HUMAN_APPROVAL",
      allowed: false,
      risk_level: "high",
      reason: "External communication requires human approval before execution."
    }

That is DGR.

One normalized action in.

One deterministic decision out.

---

## Why DGR exists

Every AI agent project eventually grows a wrapper around tool calls.

At first it is small:

    if (toolName === "send_email") {
      requireApproval();
    }

Then more tools appear.

Then production matters.

Then customers are involved.

Then money movement appears.

Then someone adds database writes.

Then MCP tools arrive.

And suddenly every project contains repeated decision logic:

    if (targetMissing) askClarification();
    if (toolDenied) block();
    if (externalSend) requireApproval();
    if (destructiveAction) requireApproval();
    if (productionChange) requireApproval();
    if (moneyMovement) requireApproval();
    if (permissionChange) requireApproval();
    if (dryRun) allowConditionally();
    auditDecision();

The framework changes.

The wrapper grows.

The decision logic repeats.

DGR extracts that repeated decision logic into one deterministic SDK.

---

## Before DGR

    if (tool === "send_email") {
      if (!userConfirmed) {
        return requireApproval();
      }
    }

    if (tool === "delete_database") {
      if (!scopeSpecified) {
        return askClarification();
      }

      return requireApproval();
    }

    if (tool === "refund") {
      if (amount > 0) {
        return requireApproval();
      }
    }

    if (tool === "grant_admin") {
      return requireApproval();
    }

    auditDecision();

---

## After DGR

    import { check } from "@dgr/core";

    const decision = check(action);

    switch (decision.decision) {
      case "ALLOW":
        execute();
        break;

      case "CONDITIONAL_ALLOW":
        executeSafely();
        break;

      case "ASK_CLARIFICATION":
        askUser(decision.missing_information);
        break;

      case "REQUIRE_HUMAN_APPROVAL":
        requestApproval(decision.reason);
        break;

      case "BLOCK":
        stop(decision.reason);
        break;
    }

Same behavior.

Less repeated code.

Portable across projects.

---

## Decision outcomes

DGR returns one of five stable decisions.

| Decision | Meaning |
|---|---|
| ALLOW | The action can execute immediately |
| CONDITIONAL_ALLOW | The action can execute only under safe conditions |
| ASK_CLARIFICATION | Required information is missing |
| REQUIRE_HUMAN_APPROVAL | Human approval is required before execution |
| BLOCK | The action must not execute |

---

## Action shape

DGR evaluates normalized action metadata.

Minimum practical action:

    {
      tool_name: "email",
      action_type: "send_email",
      mode: "execute",
      environment: "production",
      scope: "single",
      target: "customer@example.com",
      tool_trust: "trusted",
      reversibility: "irreversible",
      effects: {
        external_effect: true,
        data_change: false,
        money_movement: false,
        permission_change: false,
        production_impact: false,
        customer_facing: true,
        public_visibility: false
      }
    }

DGR does not execute the action.

It only evaluates whether execution should continue.

---

## What DGR checks

Current core policies cover common risky action patterns:

- missing target
- unknown destructive scope
- tool allowlist
- tool denylist
- external communication
- destructive actions
- production impact
- money movement
- permission changes
- customer-facing actions
- public visibility
- draft mode
- dry-run mode
- sandbox mode
- untrusted tools
- audit metadata

---

## Run locally

Clone the repository:

    git clone https://github.com/miheii/dgr.git

Enter the project:

    cd dgr

Install dependencies:

    npm install

Run tests:

    npm test

Build:

    npm run build

Verify package:

    npm pack --dry-run

Expected:

    RESULT: 10/10
    RESULT: 5/5

---

## What DGR is not

DGR is not:

- an AI agent
- an AI framework
- a workflow engine
- an approval UI
- a dashboard
- a cloud service
- an identity provider
- an enterprise policy platform

DGR is only the reusable decision layer before tool execution.

---

## Design principles

DGR Core is:

- local first
- deterministic
- framework agnostic
- small
- testable
- explainable
- easy to remove

The same input should produce the same decision.

No hidden network calls.

No LLM reasoning inside Core.

---

## Current status

DGR v0.1.0 is an early standalone release.

Confirmed:

- local tests pass
- wrapper replacement demo passes
- TypeScript build works
- npm package builds
- GitHub install works
- GitHub Actions CI passes

---

## Roadmap

Near-term:

- improve examples
- add explain()
- add inspectAction()
- add Shadow Mode
- add AI SDK adapter
- add FastMCP adapter

Later:

- LangChain adapter
- n8n node
- DGR Doctor
- commercial audit layer

---

## Contributing

Please read:

- CONTRIBUTING.md
- DESIGN_PRINCIPLES.md
- SECURITY.md
- VISION.md

before opening a pull request.

---

## License

MIT
