import { useSelector } from "@xstate/react";
import Parcel from "single-spa-react/parcel";
import { checkoutMachine } from "./machine/serviceA";
import FormEntry from "./service/formEntry";
import { mountRootParcel } from "single-spa";

import { ButtonParcel } from "./shared-ui";

export default function ServiceComponent() {
  // useSelector tells React to re-render whenever the actor's state changes
  const state = useSelector(checkoutMachine, (snapshot) => snapshot);

  // Now these will update automatically!
  const inFormEntry = state.matches("formEntry");
  const inAwaitingReview = state.matches("awaitingReview");
  const inBillingSummary = state.matches("billingSummary");
  const inPaymentSuccess = state.matches("paymentSuccess");
  const inExternalPayment = state.matches("externalPayment");
  const inShippingAddress = state.matches("shippingAddress");
  const inCompleted = state.matches("completed");

  return (
    <>
      <details>
        <summary>Current Step: {String(state.value)}</summary>
        <pre>{JSON.stringify(state.context, null, 2)}</pre>
      </details>

      {inFormEntry && <FormEntry />}

      {inAwaitingReview && <>Waiting for Application to be Reviewed</>}

      {inBillingSummary && <>Application approved, heres the bill</>}

      {inPaymentSuccess && <>payment successful</>}

      {inExternalPayment && <>we are now in efiniance land</>}

      {inShippingAddress && <>now enter you address to ship the thing</>}

      {inCompleted && <>the request is completed</>}
      <br />

      <div className="flex gap-2 justify-end px-3">
        <Parcel
          config={ButtonParcel}
          mountParcel={mountRootParcel}
          size={"sm"}
          variant={"outline"}
          fullWidth={false}
          className={"w-fit"}
          onClick={() => checkoutMachine.send({ type: "PREVIOUS" })}
        >
          الرجوع
        </Parcel>

        <Parcel
          config={ButtonParcel}
          mountParcel={mountRootParcel}
          size={"sm"}
          fullWidth={false}
          className={"w-fit"}
          onClick={() => checkoutMachine.send({ type: "NEXT" })}
        >
          التالي
        </Parcel>
      </div>
      <br />
    </>
  );
}
