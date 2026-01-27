import { Form } from "antd";
import Parcel from "single-spa-react/parcel";
import { ButtonParcel } from "../shared-ui";
import { mountRootParcel } from "single-spa";
import { updateRequestStep } from "../requestStorage";

export default function ExternalPayment({ form, requestID, checkoutMachine }) {
  return (
    <>
      we are now in efiniance land
      <Form
        form={form}
        initialValues={{
          inBillingSummary: {
            table: [
              {
                name: "item1",
                price: "00.0000000000",
              },
              {
                name: "item2",
                price: "000.000000000",
              },
            ],
          },
        }}
      >
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
      </Form>
    </>
  );
}
