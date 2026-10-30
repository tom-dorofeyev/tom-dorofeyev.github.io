---
layout: post
title: "Sagalicious: Orchestration-Based Sagas in TypeScript"
date: 2026-10-30
---

I built an open-source library a while ago and made the classic developer mistake:

**I never told anyone about it.**

It's called [**Sagalicious**](https://github.com/tom-dorofeyev/sagalicious). It's a small TypeScript library for orchestration-based sagas, with automatic compensation when part of a workflow fails.

## The payment went through. Shipping failed.

Take an order workflow:

1. Create the order.
2. Charge the payment.
3. Reserve inventory.
4. Ship the order.

If shipping fails, the customer has still been charged and the inventory is still reserved. Stopping the workflow leaves those earlier actions in place.

A saga gives those steps compensating actions: release the inventory, refund the payment, and cancel the order. The orchestrator coordinates the steps and triggers compensation when the workflow fails.

You still define what each compensation does. Refunding a payment, for example, requires its own logic. Sagalicious handles the orchestration.

![Sagalicious illustration showing a successful order workflow and, after shipping fails, compensation that releases inventory, refunds payment, and cancels the order.]({{ '/assets/images/sagalicious.jpg' | relative_url }})

A shoutout to my brother [Anton Dorofeyev](https://www.linkedin.com/in/anton-dor5/): his article on two-phase commit transactions with MongoDB at [coding4dummies.net](https://coding4dummies.net/) was part of the inspiration for building this in the first place.

Maybe nobody needs it. Maybe a few people do.

Either way, I probably should've shared it sooner. 😄

If you're working on a workflow like this, [the code is on GitHub](https://github.com/tom-dorofeyev/sagalicious).
