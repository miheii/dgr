# Contributing to DGR

Thank you for your interest in contributing to DGR.

## Philosophy

DGR intentionally has a very small scope.

Before proposing a feature, ask one question:

> Does this help developers replace repeated pre-tool-execution decision logic?

If the answer is "no", it probably does not belong in the core.

## Core principles

Every contribution should preserve these properties:

- deterministic behavior
- local-first execution
- framework independence
- explainable decisions
- stable public API
- small core

## Before opening a Pull Request

Please make sure that:

- all existing tests pass
- new behavior includes tests
- documentation is updated when necessary
- public APIs remain backward compatible whenever possible

## What belongs in Core

Examples:

- decision policies
- decision contract
- action schema
- deterministic evaluation
- explanations
- audit hooks

## What does NOT belong in Core

Examples:

- dashboards
- cloud services
- workflow engines
- AI reasoning
- hosted infrastructure
- enterprise management features
- framework-specific integrations

These should live in adapters or separate packages.

## Code style

Prefer:

- readable code
- explicit logic
- deterministic behavior
- small focused functions

Avoid unnecessary abstractions.

## Issues

Bug reports should include:

- expected behavior
- actual behavior
- reproduction steps
- environment
- DGR version

Feature requests should explain:

- the repeated decision logic being solved
- why it belongs in the core
- why it cannot live in an adapter

## Thank you

Every contribution helps make AI tool execution safer and more predictable.
