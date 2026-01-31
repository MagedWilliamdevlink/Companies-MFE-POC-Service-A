!(screenshot)[/screenshot.png]

:::mermaid
%% Generated with Stately Studio
stateDiagram-v2
  state "checkoutWorkflow" as checkoutWorkflow {
    [*] --> formEntry

    formEntry --> awaitingReview : NEXT [isFormValid]
    formEntry --> formEntry : NEXT

    awaitingReview --> paymentRequired : NEXT [isReviewed]
    awaitingReview --> awaitingReview : NEXT

    paymentRequired --> shippingRequired : PAYMENT_SUCCEEDED
    paymentRequired --> paymentRequired : PAYMENT_FAILED
    paymentRequired --> awaitingReview : PREVIOUS

    shippingRequired --> completed : NEXT [isShippingValid]
    shippingRequired --> shippingRequired : NEXT

    state "formEntry\n\nFill basic form and submit" as formEntry
    state "awaitingReview\n\nShow submit was successful, waiting for reviewer" as awaitingReview
    state "paymentRequired\n\nIf step 1 reviewed, show bill summary" as paymentRequired
    state "shippingRequired\n\nEnter shipment address" as shippingRequired
    state "completed\n\nService is complete" as completed
  }
:::
