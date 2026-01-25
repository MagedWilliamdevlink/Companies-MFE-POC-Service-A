export declare const checkoutMachine: import("xstate").StateMachine<{
    isFormValid: boolean;
    isReviewed: boolean;
    isReviewPending: boolean;
    isPaymentCompleted: boolean;
    isPaymentRequired: boolean;
    isPaymentVerified: boolean;
    isShippingValid: boolean;
    isShippingInvalid: boolean;
}, {
    type: "PAYMENT_SUCCEEDED";
} | {
    type: "PAYMENT_FAILED";
} | {
    type: "NEXT";
} | {
    type: "PREVIOUS";
}, {}, never, never, {
    type: "isFormValid";
    params: unknown;
} | {
    type: "isReviewed";
    params: unknown;
} | {
    type: "isReviewPending";
    params: unknown;
} | {
    type: "isPaymentCompleted";
    params: unknown;
} | {
    type: "isPaymentRequired";
    params: unknown;
} | {
    type: "isPaymentVerified";
    params: unknown;
} | {
    type: "isShippingValid";
    params: unknown;
} | {
    type: "isShippingInvalid";
    params: unknown;
}, never, "completed" | "formEntry" | "awaitingReview" | "billingSummary" | "paymentSuccess" | "externalPayment" | "shippingAddress", string, {}, {}, import("xstate").EventObject, import("xstate").MetaObject, {
    id: "checkoutWorkflow";
    states: {
        readonly formEntry: {};
        readonly awaitingReview: {};
        readonly billingSummary: {};
        readonly paymentSuccess: {};
        readonly externalPayment: {};
        readonly shippingAddress: {};
        readonly completed: {};
    };
}>;
