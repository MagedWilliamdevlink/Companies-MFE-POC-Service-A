import { assign, createActor, setup, transition } from "xstate";
import { getSavedRequestById } from "../requestStorage";

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
    hasPaymentCompletedInContext: ({ context }) => {
      return context.isPaymentCompleted === true;
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
            target: "billingSummary",
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
    billingSummary: {
      on: {
        NEXT: [
          {
            target: "paymentSuccess",
            guard: {
              type: "hasPaymentCompletedInContext",
            },
          },
          {
            target: "externalPayment",
          },
        ],
        PREVIOUS: {
          target: "awaitingReview",
        },
      },
      description: "if Step1 reviewed, we show bill summary",
    },
    externalPayment: {
      on: {
        PAYMENT_SUCCEEDED: {
          target: "paymentSuccess",
          actions: assign({
            isPaymentCompleted: true,
          }),
        },
        PAYMENT_FAILED: {
          target: "billingSummary",
          actions: assign({
            isPaymentCompleted: false,
          }),
        },
      },
      description: "Generate url from provider, user proceeds to pay",
    },
    paymentSuccess: {
      on: {
        NEXT: {
          target: "shippingAddress",
        },
        PREVIOUS: {
          target: "billingSummary",
        },
      },
      description: "Show Payment Succeeded with timestamp",
    },
    shippingAddress: {
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
            target: "shippingAddress",
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
          target: "billingSummary",
        },
      },
      description: "Service is complete",
    },
  },
});

export function predictNextTurnAction(predictionStateMachine) {
  if (predictionStateMachine) {
    const currentState = predictionStateMachine.getSnapshot();
    const [nextState] = transition(predictionStateMachine.logic, currentState, {
      type: "NEXT",
    });
    return nextState.value;
  }
}

// Function to create the checkout machine actor with optional snapshot restoration
export function createCheckoutMachine(snapshot?: any) {
  // console.log("snapshot", snapshot);
  if (snapshot) {
    return createActor(stateMachine, { snapshot }).start();
  }
  return createActor(stateMachine).start();
}
