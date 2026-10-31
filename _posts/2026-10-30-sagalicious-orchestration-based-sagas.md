---
layout: post
title: "Sagalicious: Orchestration-Based Sagas in TypeScript"
date: 2026-10-30
---

I built an open-source library a while ago and made the classic developer mistake:

**I never told anyone about it.**

It's called [**Sagalicious**](https://github.com/tom-dorofeyev/sagalicious). It's a small TypeScript library for workflows where several operations need to succeed together, and earlier actions need compensation if something fails.

## The payment went through. Shipping failed.

Take an order workflow:

1. Create the order.
2. Charge the payment.
3. Reserve inventory.
4. Ship the order.

If shipping fails, the customer has still been charged and the inventory is still reserved. Stopping the workflow leaves those earlier actions in place.

A saga pairs those steps with compensating actions: release the inventory, refund the payment, and cancel the order. An orchestrator runs the workflow and triggers compensation on failure.

You write the actions and their compensations. Sagalicious coordinates when they run.

![Sagalicious illustration showing a successful order workflow and, after shipping fails, compensation that releases inventory, refunds payment, and cancels the order.]({{ '/assets/images/sagalicious.jpg' | relative_url }})

## Pair an action with its compensation

Install the package in your Node.js project:

```sh
npm install sagalicious
```

For an order that already exists, payment, inventory, and shipping each need different data. Define a command DTO for each action:

```typescript
import { createSaga, type Command } from 'sagalicious';
import { payments, inventory, shipping } from './order-services';

interface PaymentCommand extends Command {
  type: 'payment';
  data: {
    paymentId: string;
    customerId: string;
    amountCents: number;
    currency: string;
  };
}

interface InventoryCommand extends Command {
  type: 'inventory';
  data: {
    reservationId: string;
    items: { sku: string; quantity: number }[];
  };
}

interface ShippingCommand extends Command {
  type: 'shipping';
  data: {
    shipmentId: string;
    orderId: string;
    addressId: string;
  };
}
```

The `type` selects a handler. The `data` property is our DTO design, not a required Sagalicious field: the library passes the command object to the handler as-is.

Now register the handlers with the [functional API](https://github.com/tom-dorofeyev/sagalicious#quick-start):

```typescript
const checkout = createSaga()
  .handler<PaymentCommand>('payment', {
    execute: async ({ data }) => {
      await payments.charge(data);
    },
    rollback: async ({ data }) => {
      await payments.refund(data.paymentId);
    },
  })
  .handler<InventoryCommand>('inventory', {
    execute: async ({ data }) => {
      await inventory.reserve(data);
    },
    rollback: async ({ data }) => {
      await inventory.release(data.reservationId);
    },
  })
  .handler<ShippingCommand>('shipping', {
    execute: async ({ data }) => {
      await shipping.createShipment(data);
    },
    rollback: async ({ data }) => {
      await shipping.cancel(data.shipmentId);
    },
  })
  .build();
```

Each handler gets the data it needs to do its job and undo it if something goes wrong. The payment, inventory, and shipping services are examples you'd replace with your own application code.

## Run the workflow

Build a list of those DTOs in execution order:

```typescript
type CheckoutCommand =
  | PaymentCommand
  | InventoryCommand
  | ShippingCommand;

const commands: CheckoutCommand[] = [
  {
    type: 'payment',
    data: {
      paymentId: 'pay-123',
      customerId: 'customer-456',
      amountCents: 4999,
      currency: 'USD',
    },
  },
  {
    type: 'inventory',
    data: {
      reservationId: 'reservation-123',
      items: [{ sku: 'keyboard-01', quantity: 1 }],
    },
  },
  {
    type: 'shipping',
    data: {
      shipmentId: 'shipment-123',
      orderId: 'order-123',
      addressId: 'address-789',
    },
  },
];

try {
  const transaction = await checkout.execute(commands);
  console.log(transaction.status); // COMPLETED
} catch (error) {
  console.error('Checkout failed:', error);
}
```

If booking the shipment fails, Sagalicious undoes the completed steps in reverse order: release the inventory, then refund the payment. The failed shipping step and any steps that haven't started are skipped. The original error then reaches the `catch` block.

For recovery, you can configure a [transaction repository](https://github.com/tom-dorofeyev/sagalicious#persistence) backed by your database. It stores the workflow and its status. If compensation fails, the remaining rollbacks stop and the transaction stays pending, giving your application a record to investigate and recover from. The repository supports recovery; your application still needs to handle retries and restore consistency.

## Finally sharing it

A shoutout to my brother [Anton Dorofeyev](https://www.linkedin.com/in/anton-dor5/): his article on two-phase commit transactions with MongoDB at [coding4dummies.net](https://coding4dummies.net/) was part of the inspiration for building this in the first place.

Maybe nobody needs it. Maybe a few people do.

Either way, I probably should've shared it sooner. 😄

If you have a workflow with actions that need compensation, [install Sagalicious](https://www.npmjs.com/package/sagalicious) and try wiring up a pair of handlers. The [source and API documentation are on GitHub](https://github.com/tom-dorofeyev/sagalicious).
