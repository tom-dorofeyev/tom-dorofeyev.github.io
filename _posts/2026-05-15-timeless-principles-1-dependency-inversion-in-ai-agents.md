---
layout: post
title: "Timeless Principles #1: Dependency Inversion in AI Agents"
# Approximate original publication date: about five months before October 15, 2026.
date: 2026-05-15
---

Some software engineering principles remain useful even as the tools change. Dependency inversion is one of them:

**Software should depend upon abstractions, not implementations.**

The same principle applies to AI agents.

![Diagram contrasting tightly coupled agent notification logic with a stable notifier interface backed by swappable Telegram, Teams, Slack, and email implementations.]({{ '/assets/images/dependency-inversion-in-ai-agents.jpg' | relative_url }})

## The agent needs to know what, not how

Your agent should know that it needs to notify you when your attention is required. But it should not need to know how that notification reaches you.

Whether you receive a message through Telegram, Teams, Slack, or email is an implementation detail, not part of the agent's core logic.

One way to separate those responsibilities is to give the agent a notification skill:

```text
└── skills/
    └── notify/
        ├── notify.md
        └── notify.mjs
```

Here, `notify.md` describes the interface: when to send a notification, how to invoke it, and what information to provide. The `notify.mjs` file implements the delivery mechanism.

The agent follows the skill's contract. The implementation handles the notification channel.

## Swap the implementation, keep the contract

If we decide to switch from Telegram to Teams, Slack, or email, we can change the implementation in `notify.mjs` without changing the agent logic or skill instructions, as long as the interface stays the same.

Simply putting code in a separate file is not enough. The important boundary is a stable contract that keeps channel-specific details out of the agent's instructions.

**Focus on the interface rather than the implementation.** The agent decides when your attention is needed; the notifier takes care of reaching you.
