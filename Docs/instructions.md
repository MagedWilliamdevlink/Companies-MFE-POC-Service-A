The following is a state machine, i would like to implement it in `src\ServiceWithStateMachine.tsx`

```jsx
import { setup } from "xstate";

export const machine = setup({
  types: {
    context: {} as {},
    events: {} as
      | { type: "Pay" }
      | { type: "Next" }
      | { type: "Submit" }
      | { type: "previous" }
      | { type: "Payment Failed" }
      | { type: "Payment Succeeded" },
  },
  guards: {
    valid: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    Rviewed: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "pending Review": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "2_1: Payment Completed": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "2_1: Payment Needed": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "New guard": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    Valid: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "not valid": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
  },
}).createMachine({
  context: {},
  id: "Untitled",
  initial: "Step1_1",
  states: {
    Step1_1: {
      on: {
        Submit: [
          {
            target: "Step1_2",
            guard: {
              type: "valid",
            },
            description: "if the form is valid, move to the next step",
          },
          {
            target: "Step1_1",
            description: "if form wasn't valid, user stays on the step",
          },
        ],
      },
      description: "Fill basic form and submit",
    },
    Step1_2: {
      on: {
        Next: [
          {
            target: "Step 2_1",
            guard: {
              type: "Rviewed",
            },
            description:
              "if reviewer have reviewed this form you could move to the next step",
          },
          {
            target: "Step1_2",
            guard: {
              type: "pending Review",
            },
          },
        ],
      },
      description: "Show submit was successful, waiting for reviewer",
    },
    "Step 2_1": {
      on: {
        Pay: [
          {
            target: "Step 2_2",
            guard: {
              type: "2_1: Payment Completed",
            },
          },
          {
            target: "External:Payment",
            guard: {
              type: "2_1: Payment Needed",
            },
          },
        ],
        previous: {
          target: "Step1_2",
        },
      },
      description: "if Step1 reviewed, we show bill summary",
    },
    "Step 2_2": {
      on: {
        previous: {
          target: "Step 2_1",
        },
        Next: {
          target: "Step 3_1",
        },
      },
      description: "Show Payment Succeeded with timestamp",
    },
    "External:Payment": {
      on: {
        "Payment Succeeded": {
          target: "Step 2_2",
          guard: {
            type: "New guard",
          },
        },
        "Payment Failed": {
          target: "Step 2_1",
        },
      },
      description: "Generate url from efinance, user proceeds to pay",
    },
    "Step 3_1": {
      on: {
        Submit: [
          {
            target: "Step 3_2",
            guard: {
              type: "Valid",
            },
          },
          {
            target: "Step 3_1",
            guard: {
              type: "not valid",
            },
          },
        ],
      },
      description: "Enter shipment address",
    },
    "Step 3_2": {
      on: {
        previous: {
          target: "Step 2_1",
        },
      },
      description: "Service is complete",
    },
  },
});

```

# Intro

This project uses Single-SPA and makes heavy use of Parcels, the available parcels are defined in `src\shared-ui.ts`
it's a simple apply to service when user applies to a service a unique id will be generated and will be stored in localstorage, the url will have this id example:

`http://localhost:3000/service-a/REQ-1769335512113-6clalzsnc`

The service has steps and it makes use of state machine to move the request, every time the state changes i want to reflect it in the localstorage of tha request

use the localstorage to store the current step and form data, so if step 1 was filled, i should find it initiallized with the data when i visit later.

using `nuqs` bind the current step to the query param, but if i landed on a step i shouldnt see, priorities the one from the localstorage instead

