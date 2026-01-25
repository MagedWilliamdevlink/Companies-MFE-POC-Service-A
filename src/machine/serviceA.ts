import { createActor, setup, transition } from "xstate";
import { getSavedRequestById } from "../requestStorage";

const stateMachine = setup({
  types: {
    context: {} as {
      isFormValid: boolean;
      isReviewed: boolean;
      isReviewPending: boolean;
      isPaymentCompleted: boolean;
      isPaymentRequired: boolean;
      isPaymentVerified: boolean;
      isShippingValid: boolean;
      isShippingInvalid: boolean;
    },
    events: {} as
      | { type: "PAYMENT_SUCCEEDED" }
      | { type: "PAYMENT_FAILED" }
      | { type: "NEXT" }
      | { type: "PREVIOUS" },
  },
  guards: {
    isFormValid: ({ context, event }) => {
      // Add your guard condition here
      const request = getSavedRequestById();
      if (request.formData.hasOwnProperty("formEntry")) {
        context.isFormValid = true;
      }
      return true;
    },
    isReviewed: ({ context, event }) => {
      // Add your guard condition here
      return true;
    },
    isReviewPending: ({ context, event }) => {
      // Add your guard condition here
      return true;
    },
    isPaymentCompleted: ({ context, event }) => {
      // Add your guard condition here
      return true;
    },
    isPaymentRequired: ({ context, event }) => {
      // Add your guard condition here
      return true;
    },
    isPaymentVerified: ({ context, event }) => {
      // Add your guard condition here
      return true;
    },
    isShippingValid: ({ context, event }) => {
      // Add your guard condition here
      return true;
    },
    isShippingInvalid: ({ context, event }) => {
      // Add your guard condition here
      return true;
    },
  },
}).createMachine({
  context: {
    isFormValid: false,
    isReviewed: false,
    isReviewPending: false,
    isPaymentCompleted: false,
    isPaymentRequired: false,
    isPaymentVerified: false,
    isShippingValid: false,
    isShippingInvalid: false,
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
          },
          {
            target: "awaitingReview",
            guard: {
              type: "isReviewPending",
            },
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
              type: "isPaymentCompleted",
            },
          },
          {
            target: "externalPayment",
            guard: {
              type: "isPaymentRequired",
            },
          },
        ],
        PREVIOUS: {
          target: "awaitingReview",
        },
      },
      description: "if Step1 reviewed, we show bill summary",
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
    externalPayment: {
      on: {
        PAYMENT_SUCCEEDED: {
          target: "paymentSuccess",
          guard: {
            type: "isPaymentVerified",
          },
        },
        PAYMENT_FAILED: {
          target: "billingSummary",
        },
      },
      description: "Generate url from provider, user proceeds to pay",
    },
    shippingAddress: {
      on: {
        NEXT: [
          {
            target: "completed",
            guard: {
              type: "isShippingValid",
            },
          },
          {
            target: "shippingAddress",
            guard: {
              type: "isShippingInvalid",
            },
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

export const checkoutMachine = createActor(stateMachine).start();

export const predicatedNextState: string =
  predictNextTurnAction(checkoutMachine);
