---
layout: post
title: "td-agentcraft-kit: Treat Your Agent Setup Like Software"
date: 2026-11-05
---

An AI coding agent can write code. But what tells it when the work is actually done?

The code exists? The tests pass? Someone checked that it solves the problem you asked it to solve?

Those are different things.

[**td-agentcraft-kit**](https://github.com/tom-dorofeyev/td-agentcraft-kit) is my open-source kit for bringing engineering discipline to AI-assisted development.

The central idea isn't a particular set of agents or a clever prompt. It's this: **make code quality an explicit, verifiable part of the work, not something you hope the model takes care of.**

## Credit where it's due

A big influence on this approach was following Robert C. Martin (Uncle Bob) as he shared his experiments with AI on Twitter/X, from [trying AI-generated code and examining its mistakes](https://x.com/unclebobmartin/status/1961077788338737470) to [surrounding coding agents with tests, quality metrics, and other constraints](https://x.com/unclebobmartin/status/2080257779395154409).

What stuck with me wasn't the idea of letting an agent write everything unchecked. It was the discipline around the agent: define the constraints, measure the results, and make the work prove itself.

td-agentcraft-kit is my own evolving setup, not his system. But that influence deserves credit.

## "Write clean code" isn't a quality gate

You can tell an agent to follow SOLID, avoid duplication, and keep things simple.

You should. But an instruction isn't evidence that it happened.

"The code looks good" and "the code passed defined checks" are different claims.

The approach behind the kit is to turn expectations into explicit criteria wherever possible:

- Define the behavior the change must satisfy.
- Verify that behavior with tests.
- Use static analysis to catch mechanically detectable problems.
- Measure complexity and duplication rather than relying only on impressions.
- Require a passing build and test suite before calling the work done.

An agent saying "done" shouldn't be the acceptance criterion.

## Put deterministic checks around probabilistic work

The model can take different paths to a solution. The acceptance criteria shouldn't change just because it produced a convincing explanation.

That's where deterministic checks matter: use tools with explicit rules and repeatable pass/fail results to constrain work produced by a probabilistic system.

If a required check fails, the work isn't done. If a check couldn't run, that is a gap to report, not a pass to assume.

But let's be precise: **deterministic checks do not make code quality fully deterministic.**

Tests can miss requirements. Low complexity doesn't prove a good abstraction. A duplication score doesn't tell you whether two pieces of code should change together.

The measurements support engineering judgment. They don't replace it. Review still needs to ask whether the change solves the right problem, respects architectural boundaries, and avoids unnecessary machinery.

And instructions telling an agent to run checks aren't enforcement by themselves. Checks that must block delivery belong in your build and CI too.

## The setup deserves the same discipline

If Markdown defines how an agent works, that Markdown affects your software.

It deserves clear responsibilities, minimal duplication, and maintainable boundaries. Shared rules shouldn't drift across a dozen copied prompts. More instructions and more agents aren't automatically better.

Single responsibility. Separation of concerns. DRY. YAGNI.

The file extension changed. The engineering principles didn't.

The kit's structure has changed before and will change again. That's fine. The point is to improve the mechanism without losing the standard: small, understandable changes backed by evidence.

## Principles here, implementation in the repository

The [td-agentcraft-kit repository](https://github.com/tom-dorofeyev/td-agentcraft-kit) has the current setup and installation instructions. Those details belong alongside the implementation, where they can evolve with it.

The idea worth keeping is simpler: **don't ask an agent to convince you the code is clean. Define what you can verify, run the checks, and use judgment for what they can't tell you.**
