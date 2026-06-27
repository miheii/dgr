# Changelog

All notable changes to DGR will be documented in this file.

The format is based on Keep a Changelog, but kept intentionally simple for the early OSS phase.

---

## [0.1.0] - 2026-06-25

### Added

- Created standalone DGR project foundation.
- Added deterministic DGR Core.
- Added `check(action) -> decision`.
- Added canonical decision states:
  - ALLOW
  - CONDITIONAL_ALLOW
  - ASK_CLARIFICATION
  - REQUIRE_HUMAN_APPROVAL
  - BLOCK
- Added initial policy engine.
- Added canonical policies for:
  - read-only actions
  - missing target clarification
  - unknown scope clarification
  - tool allowlist / denylist
  - destructive action approval
  - external communication approval
  - draft conditional allow
  - dry-run conditional allow
  - sandbox conditional allow
  - production change approval
  - money movement approval
  - permission change approval
  - customer-facing action approval
  - public publishing approval
  - untrusted tool block
  - non-ALLOW audit callback
- Added smoke test suite.
- Added wrapper replacement demo.
- Added project README.
- Added project vision.
- Added design principles.
- Added MIT license.

### Verified

- DGR Core smoke tests pass:
  - RESULT: 10/10
- Wrapper replacement demo passes:
  - RESULT: 5/5

### Notes

This version is the first standalone foundation of DGR.

DGR is intentionally local, deterministic, small, and framework-agnostic.

It does not include:

- cloud
- dashboard
- approval UI
- workflow engine
- enterprise policy management
- hosted audit storage
- LLM reasoning

The main purpose of this release is to prove one thing:

Developers can replace repeated pre-tool-execution decision logic with one reusable local SDK.
