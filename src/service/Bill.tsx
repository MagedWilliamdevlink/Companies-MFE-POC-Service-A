import Parcel from "single-spa-react/parcel";
import { mountRootParcel } from "single-spa";
import { ButtonParcel } from "../shared-ui";
import { FeeSummaryParcel } from "../common-components";
import { updateRequestStep } from "../requestStorage";

const feeItems = [
  { label: "قيمة رسم السجل التجاري", price: 200 },
  { label: "رسوم نقابة التجاريين", price: 200 },
  { label: "رسوم الهيئة العامة للاستثمار والأسواق الحرة", price: 300 },
  { label: "قيمة رسم الاتحاد العام للغرف", price: 250 },
  { label: "قيمة رسم التوثيق", price: 400 },
];

const handlePayment = (url) => {
  // alert("Payment successful!");
  window.open(url, "_blank");
};

export default function Bill({ form, requestID, checkoutMachine }) {
  return (
    <>
      <Parcel
        config={FeeSummaryParcel}
        mountParcel={mountRootParcel}
        items={feeItems}
        expiryDate="20/6/2025"
        paymentTime="19:55:00"
        onPayment={() => handlePayment("https://google.com")}
      />
      <Parcel
        config={ButtonParcel}
        mountParcel={mountRootParcel}
        size={"sm"}
        variant={"outline"}
        fullWidth={false}
        className={"w-fit"}
        onClick={() => {
          checkoutMachine.send({ type: "PAYMENT_SUCCEEDED" });
          // Get the updated state after the event is processed
          const updatedState = checkoutMachine.getSnapshot();
          // Store the snapshot with updated context
          updateRequestStep(requestID, updatedState.value, {}, updatedState);
        }}
      >
        Pay (success)
      </Parcel>
      <Parcel
        config={ButtonParcel}
        mountParcel={mountRootParcel}
        size={"sm"}
        variant={"outline"}
        fullWidth={false}
        className={"w-fit"}
        onClick={() => {
          checkoutMachine.send({ type: "PAYMENT_FAILED" });
          // Get the updated state after the event is processed
          const updatedState = checkoutMachine.getSnapshot();
          // Store the snapshot with updated context
          updateRequestStep(requestID, updatedState.value, {}, updatedState);
        }}
      >
        Pay (fails)
      </Parcel>
    </>
  );
}
