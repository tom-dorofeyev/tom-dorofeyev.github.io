---
layout: post
title: "Timeless Principles #2: Strategy Pattern in AI Agents"
# Approximate original publication date: one week after Timeless Principles #1.
date: 2026-05-22
---

**Select the relevant algorithm at runtime.**

The strategy pattern is another timeless software engineering principle that applies to AI agents. In this case, the strategy is the workflow an orchestrator chooses to handle a request.

![Diagram showing an orchestrator evaluating a request and selecting either a complex feature workflow with architectural planning or a scoped change workflow, both retaining implementation, review, and Definition of Done validation.]({{ '/assets/images/strategy-pattern-in-ai-agents.jpg' | relative_url }})

## Not every task needs the same workflow

An orchestrator should handle different tasks in different ways. When given a request, it shouldn't be forced through the entire feature implementation workflow by default.

If a change is scoped to a small set of files, there's no need for an expensive architecture plan or a high-reasoning phase when the task doesn't warrant it. But you still want the iteration between the implementer, the reviewer, and Definition of Done (DoD) validation.

The goal is to avoid unnecessary overhead, not to skip quality checks.

## Separate workflows into skills

The approach: **separate your workflows into skills.** Let the orchestrator evaluate the task and select the relevant skill at runtime.

A complex feature might need architectural planning before implementation. A small, well-understood change can take a more focused path. Both workflows can retain the implementation, review, and validation loop.

The orchestrator decides which workflow fits the request. The selected skill defines how to carry it out.

**Choose the workflow that fits the task—not the same workflow for every task.**
