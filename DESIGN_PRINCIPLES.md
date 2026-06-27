# DGR Design Principles

## 1. Small core

DGR Core must stay small.

The core exists for one purpose:

```ts
check(action) -> decision
```

Anything that does not directly support this purpose should stay outside the core.

---

## 2. Deterministic only

DGR Core must be deterministic.

No LLM calls.

No hidden reasoning.

No probabilistic decisions.

Same input should produce the same decision.

---

## 3. Local first

DGR Core must run locally.

It must not require:

- cloud services
- hosted APIs
- databases
- dashboards
- user accounts
- network access

A developer should be able to use DGR offline.

---

## 4. Framework agnostic

DGR must not belong to one AI framework.

The core should work with any system that can provide a normalized Action.

Adapters can exist for specific ecosystems.

The core must remain independent.

---

## 5. Action in. Decision out.

The public mental model must stay simple:

```text
Action
  |
  v
check(action)
  |
  v
Decision
```

No workflow ownership.

No execution ownership.

No approval UI ownership.

---

## 6. Replace repeated decision logic

DGR should replace repeated pre-tool-execution decision logic.

It should not replace:

- tool execution
- framework lifecycle
- business logic
- authentication
- approval routing
- workflow orchestration

DGR replaces the reusable decision layer inside wrappers.

---

## 7. Explain every decision

Every non-trivial decision must be explainable.

Developers should understand:

- which policy matched
- which action field caused the result
- why execution was blocked, delayed, clarified, or approved
- what safer alternative exists

No mysterious decisions.

---

## 8. Shadow before enforcement

Developers should be able to try DGR without breaking production.

Shadow Mode must allow teams to observe what DGR would decide before enforcing anything.

Trust comes before enforcement.

---

## 9. Stability before features

A stable small API is more valuable than many features.

New features should be rejected by default unless they clearly strengthen the core promise.

The question for every feature:

Does this help a developer replace repeated wrapper logic faster?

If not, defer it.

---

## 10. No platform drift

DGR Core must not drift into:

- dashboard
- cloud runtime
- enterprise console
- policy marketplace
- compliance platform
- approval inbox
- workflow builder

These may become future products only after real adoption.

They do not belong in Core.

---

## 11. Adapters outside core

Framework-specific code must live outside the core.

Adapters may handle:

- AI SDK lifecycle
- FastMCP middleware
- LangChain middleware
- n8n workflow routing

But core must stay clean.

---

## 12. Metadata over magic

DGR should not pretend to understand every action automatically.

Developers provide normalized Action metadata.

DGR evaluates that metadata.

No magical inference in Core.

---

## 13. Clear failure states

DGR should not return vague results.

Every action should resolve to one of:

- ALLOW
- CONDITIONAL_ALLOW
- ASK_CLARIFICATION
- REQUIRE_HUMAN_APPROVAL
- BLOCK

The decision contract must stay stable.

---

## 14. Adoption before expansion

The first goal is not to build a large ecosystem.

The first goal is one real developer replacing one real wrapper.

Only after real usage signals should DGR expand.

---

## 15. Boring is good

DGR Core should be boring infrastructure.

Predictable.

Typed.

Tested.

Small.

Easy to remove.

Easy to trust.

That is the product.
