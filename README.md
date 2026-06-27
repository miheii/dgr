
# DGR — Tool-call guard for AI agents

Stop maintaining the same tool-call wrapper in every AI project.

DGR is a tiny local deterministic SDK that checks risky AI tool actions before execution.

No cloud.
No dashboard.
No AI reasoning.
No enterprise platform.

Just one reusable decision layer:

```ts
const decision = check(action);
```

---

## Why DGR exists

Every AI agent project eventually grows a wrapper around tool calls.

At first it is small:

```ts
if (toolName === "send_email") {
    requireApproval();
}
```

Then more tools appear.

Then production matters.

Then customers are involved.

Then money movement appears.

Then someone adds database writes.

Then MCP tools arrive.

And suddenly every project contains dozens of repeated decision checks.

Typical wrapper logic starts looking like this:

```ts
if (targetMissing) askClarification();

if (toolDenied) block();

if (externalSend) requireApproval();

if (destructiveAction) requireApproval();

if (productionChange) requireApproval();

if (moneyMovement) requireApproval();

if (permissionChange) requireApproval();

if (dryRun) allowConditionally();

auditDecision();
```

The framework changes.

The wrapper grows.

The decision logic repeats.

DGR extracts that repeated decision logic into one deterministic SDK.

---

## The core idea

```ts
const decision = check(action);
```

DGR receives one normalized action and returns one deterministic decision.

Possible decisions:

- ALLOW
- BLOCK
- ASK_CLARIFICATION
- CONDITIONAL_ALLOW
- REQUIRE_HUMAN_APPROVAL

You keep your framework.

You keep your tools.

You keep your approval UI.

You only stop rewriting the same decision logic.

---

## Design philosophy

DGR is intentionally small.

It does not execute tools.

It does not replace your framework.

It does not become an agent.

It does not make business decisions.

It only determines whether a tool action is ready to execute safely.


# DGR — Tool-call guard for AI agents

Stop writing the same tool-call wrapper in every AI project.

DGR is a tiny deterministic SDK that evaluates AI tool actions before execution.

It helps AI applications decide whether an action should:

- execute immediately;
- require human approval;
- ask for clarification;
- execute only under specific conditions;
- be blocked completely.

DGR is intentionally small.

It is not an AI framework.

It is not an agent.

It is not an orchestration platform.

It is one reusable decision layer.

---

# Why DGR?

Every AI application eventually implements the same logic.

Before executing a tool call it asks questions like:

- Can this action execute?
- Is human approval required?
- Is important information missing?
- Is this action destructive?
- Is production affected?
- Is this an external customer action?

Developers rewrite this logic repeatedly.

Different frameworks.

Different tools.

Different wrappers.

The same decisions.

DGR extracts this repeated logic into one deterministic SDK.

---

# Before DGR

```ts
if (tool === "send_email") {
    if (!userConfirmed) {
        return "require approval";
    }
}

if (tool === "delete_database") {
    if (!scopeSpecified) {
        return "ask clarification";
    }
}

if (tool === "refund") {
    if (amount > 0) {
        return "require approval";
    }
}

// hundreds of similar rules...
```

---

# After DGR

```ts
import { check } from "@dgr/core";

const decision = check(action);

switch (decision.outcome) {
    case "ALLOW":
        break;

    case "CONDITIONAL_ALLOW":
        break;

    case "ASK_CLARIFICATION":
        break;

    case "REQUIRE_HUMAN_APPROVAL":
        break;

    case "BLOCK":
        break;
}
```

One function.

One deterministic decision.

Reusable everywhere.


---

# Installation

```bash
npm install @dgr/core
```

---

# Quick start

```ts
import { check } from "@dgr/core";

const action = {
    type: "SEND_EMAIL",
    recipient: "customer@example.com"
};

const decision = check(action);

console.log(decision.outcome);
```

---

# Five possible outcomes

Every action resolves to exactly one outcome.

| Outcome | Meaning |
|---------|---------|
| ALLOW | Execute immediately |
| CONDITIONAL_ALLOW | Execute only if additional conditions are satisfied |
| ASK_CLARIFICATION | More information is required |
| REQUIRE_HUMAN_APPROVAL | Human confirmation is required |
| BLOCK | Execution must not continue |

These outcomes remain stable across every supported framework.

---

# Examples

DGR already includes examples for common AI tool actions.

- Bulk email
- WhatsApp broadcast
- Customer refund
- Database delete
- Production deployment
- Admin permission changes

The goal is simple:

Replace hundreds of lines of repeated wrapper logic with one deterministic decision engine.


---

# Design goals

DGR is intentionally opinionated.

Its design follows a few simple principles.

## Deterministic

The same input should always produce the same decision.

No randomness.

No hidden reasoning.

---

## Local first

DGR works entirely offline.

The core should never require:

- cloud services
- hosted APIs
- user accounts
- dashboards
- databases

---

## Framework agnostic

DGR belongs to no specific ecosystem.

The core is independent.

Adapters may exist for:

- AI SDK
- FastMCP
- LangChain
- n8n

---

## Transparent

Every decision should be explainable.

If DGR blocks an action, developers should know why.

If DGR asks for clarification, developers should know what information is missing.

If DGR requires approval, developers should know what triggered it.

---

## Small core

The core should stay small forever.

Everything else belongs outside the core:

- adapters
- integrations
- documentation
- migration guides
- examples

The value of DGR comes from clarity, not size.


---

# Roadmap

The initial goal of DGR is deliberately narrow.

## Phase 1

Build a deterministic tool-call decision layer.

Completed:

- Deterministic policy engine
- Local SDK
- Smoke tests
- Wrapper replacement demo
- Standalone project
- npm packaging
- Documentation

---

## Phase 2

Improve developer experience.

Planned:

- explain()
- inspectAction()
- Shadow Mode
- Better diagnostics
- Additional examples

---

## Phase 3

Framework adapters.

Potential adapters include:

- AI SDK
- FastMCP
- LangChain
- n8n

Adapters extend DGR.

They do not change the core.

---

# Philosophy

DGR should never become a general AI platform.

It should never become an autonomous agent.

It should never replace developer judgment.

Its only responsibility is to evaluate whether an AI tool action is ready to execute.

Nothing more.

Nothing less.

---

# License

MIT

---

# Contributing

Contributions are welcome.

Please read:

- CONTRIBUTING.md
- DESIGN_PRINCIPLES.md
- SECURITY.md
- VISION.md

before opening a pull request.

---

# The vision

Success is not measured by the number of features.

Success is measured by one simple outcome:

A developer deletes a custom tool-call wrapper,

installs DGR,

writes:

```ts
const decision = check(action);
```

and never has to rewrite that decision logic again.

That is the vision.

