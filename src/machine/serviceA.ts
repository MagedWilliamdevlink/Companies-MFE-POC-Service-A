import { assign, createActor, setup, transition } from "xstate";

const stateMachine = setup({
  types: {
    context: {} as {
      isFormValid: boolean;
      isReviewed: boolean;
      isPaymentCompleted: boolean;
      isShippingValid: boolean;
      isRequestComplete: boolean;
    },
    events: {} as
      | { type: "PAYMENT_SUCCEEDED" }
      | { type: "PAYMENT_FAILED" }
      | { type: "NEXT"; validStep: boolean }
      | { type: "PREVIOUS" },
  },
  guards: {
    isFormValid: ({ context, event }) => {
      // console.log(event);
      if (event.type === "NEXT" && event?.validStep) {
        return true;
      }
      return false;
    },
    isReviewed: ({ context, event }) => {
      // Add your guard condition here
      if (event.type === "NEXT" && event?.validStep) {
        // fetch to backend
        return true;
      }
      return false;
    },
    isPaymentCompleted: ({ context, event }) => {
      // console.log("isPaymentCompleted", event);
      if (event.type === "PAYMENT_SUCCEEDED") {
        return true;
      }
      // Add your guard condition here
      return false;
    },
    isShippingValid: ({ context, event }) => {
      // console.log("isShippingValid", event);
      if (event.type === "NEXT" && event?.validStep) {
        return true;
      }
      // Add your guard condition here
      return false;
    },
    hasShippingCompletedInContext: ({ context }) => {
      return (
        context.isShippingValid === true && context.isRequestComplete === true
      );
    },
  },
}).createMachine({
  context: {
    isFormValid: false,
    isReviewed: false,
    isPaymentCompleted: false,
    isShippingValid: false,
    isRequestComplete: false,
  },
  id: "checkoutWorkflow",
  initial: "formEntry",
  states: {
    formEntry: {
      on: {
        NEXT: [
          {
            target: "awaitingReview",
            guard: {
              type: "isFormValid",
            },
            actions: assign({
              isFormValid: true,
            }),
            description: "if the form is valid, move to the next step",
          },
          {
            target: "formEntry",
            description: "if form wasn't valid, user stays on the step",
          },
        ],
      },
      description: "Fill basic form and submit",
    },
    awaitingReview: {
      on: {
        NEXT: [
          {
            target: "paymentRequired",
            guard: {
              type: "isReviewed",
            },
            actions: assign({
              isReviewed: true,
            }),
          },
          {
            target: "awaitingReview",
          },
        ],
      },
      description: "Show submit was successful, waiting for reviewer",
    },
    paymentRequired: {
      on: {
        PAYMENT_SUCCEEDED: {
          target: "shippingRequired",
          actions: assign({
            isPaymentCompleted: true,
          }),
        },
        PAYMENT_FAILED: {
          target: "paymentRequired",
        },
        PREVIOUS: {
          target: "awaitingReview",
        },
      },
      description: "if Step1 reviewed, we show bill summary",
    },
    paymentSuccess: {
      on: {
        NEXT: [
          {
            target: "completed",
            guard: {
              type: "hasShippingCompletedInContext",
            },
          },
          {
            target: "shippingRequired",
          },
        ],
      },
      description: "Show Payment Succeeded with timestamp",
    },
    shippingRequired: {
      on: {
        NEXT: [
          {
            target: "completed",
            guard: {
              type: "isShippingValid",
            },
            actions: assign({
              isShippingValid: true,
              isRequestComplete: true,
            }),
          },
          {
            target: "shippingRequired",
          },
        ],
        PREVIOUS: {
          target: "paymentSuccess",
        },
      },
      description: "Enter shipment address",
    },
    completed: {
      on: {
        PREVIOUS: {
          target: "paymentSuccess",
        },
      },
      description: "Service is complete",
    },
  },
});

// Function to create the checkout machine actor with optional snapshot restoration
export function createCheckoutMachine(snapshot?: any) {
  // console.log("snapshot", snapshot);
  if (snapshot) {
    return createActor(stateMachine, { snapshot }).start();
  }
  return createActor(stateMachine).start();
}
