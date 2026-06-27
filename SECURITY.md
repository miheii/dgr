# Security Policy

## Purpose

DGR is a local deterministic SDK for checking risky AI tool actions before execution.

Because DGR may be used near sensitive operations such as external communication, database mutation, production deployment, refunds, permission changes, and MCP tool calls, security reports are taken seriously.

## Supported versions

At this early stage, only the latest version is supported.

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## What to report

Please report security issues related to:

- incorrect ALLOW decisions for clearly dangerous actions
- bypasses of BLOCK decisions
- unsafe approval logic
- unsafe clarification logic
- unexpected execution-side effects
- vulnerabilities in action normalization
- vulnerabilities in audit callback handling
- unsafe examples
- package integrity or supply-chain concerns

## What is out of scope

DGR Core does not execute tools.

The following are generally outside the scope of DGR Core security reports:

- bugs in third-party AI frameworks
- bugs in external tools executed after DGR
- misuse of DGR by an application
- business authorization mistakes
- approval UI vulnerabilities
- workflow engine vulnerabilities
- cloud dashboard issues

## Important boundary

DGR Core is not:

- an MCP security scanner
- a prompt injection defense system
- a PII scanner
- a secret scanner
- an enterprise policy engine
- an identity provider
- an approval platform

DGR only evaluates normalized action metadata and returns a deterministic decision.

## Reporting process

Please do not disclose security issues publicly before they are reviewed.

For now, report issues directly to the maintainer.

Maintainer:

Michael Gutman

If a public GitHub repository exists, GitHub Security Advisories should be preferred.

## Response expectations

This project is currently early-stage open source.

The goal is to acknowledge serious reports quickly, reproduce them, add deterministic tests, and patch the behavior.

## Security philosophy

DGR security depends on:

- deterministic core
- no hidden network calls
- no LLM reasoning
- explicit action metadata
- stable decision contract
- testable policies
- transparent explanations

The safest DGR decision is one that developers can understand, test, and reproduce.
