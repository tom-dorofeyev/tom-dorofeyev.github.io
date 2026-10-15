---
layout: post
title: "AI Coding Agents: Look at the Big Picture"
# Approximate original publication date: about two months before October 15, 2026.
date: 2026-08-18
---

Everybody keeps quoting Uncle Bob saying he doesn't read the code his agents generate anymore.

But if you've been keeping up with his experiments with AI, there's important context behind that statement.

![Illustration of Uncle Bob controlling coding-agent marionettes, with software quality measurements depicted in the background.]({{ '/assets/images/ai-coding-agents-and-quality-gates.jpg' | relative_url }})

## The constraints behind the quote

He surrounded his coding agents with strict, deterministic constraints designed to keep them from drifting:

- Gherkin-style acceptance testing
- Cyclomatic complexity measurement
- Coverage measurement
- Mutation testing
- Code duplication measurement

He watches those measurements closely and makes sure his agents stay in line.

The point isn't simply that he stopped reading generated code. It's the checks and constraints around the agents that make the context important.

**Always remember to look at the big picture.**
