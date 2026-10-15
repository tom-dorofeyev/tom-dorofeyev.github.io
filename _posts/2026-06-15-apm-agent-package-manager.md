---
layout: post
title: "APM: Agent Package Manager"
# Approximate original publication date: about four months before October 15, 2026.
date: 2026-06-15
---

It feels like not enough people are aware of this tool yet: **APM (Agent Package Manager)**.

Microsoft has released an open-source tool that treats your AI agent configurations like code dependencies. You declare your team's prompts, instructions, skills, and MCP servers in an `apm.yml` file, then deploy them across different environments.

## Declare once, choose your client

Your team's agent setup shouldn't have to be rebuilt every time someone chooses a different client.

APM lets you select a deployment target based on your tool of choice:

- Prefer OpenCode? Use `--target opencode`.
- Like Copilot better? Use `--target copilot`.

The idea is simple: manage your agent configuration as a shared set of dependencies, rather than maintaining separate setups by hand for every environment.

## My agent orchestration setup

I've shared my own setup in [td-agentcraft-kit on GitHub](https://github.com/tom-dorofeyev/td-agentcraft-kit).

If you're exploring how to manage and share an agent orchestration setup, take a look.
