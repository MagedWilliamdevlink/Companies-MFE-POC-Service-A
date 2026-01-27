import { useSelector } from "@xstate/react";
import Parcel from "single-spa-react/parcel";
import { createCheckoutMachine } from "./machine/serviceA";
import FormEntry from "./service/formEntry";
import AwaitingReview from "./service/AwaitingReview";
import BillingSummary from "./service/BillingSummary";
import PaymentSuccess from "./service/PaymentSuccess";
import ExternalPayment from "./service/ExternalPayment";
import ShippingAddress from "./service/ShippingAddress";
import Completed from "./service/Completed";
import { mountRootParcel } from "single-spa";
import { useMemo } from "react";

import { VerticalStepperParcel, ButtonParcel } from "./shared-ui";
import { styles } from "./styles";
import { Form } from "antd";
import { getRequestID, getRequest, updateRequestStep } from "./requestStorage";

// Steps configuration
const steps = [
  {
    id: "formEntry",
    completeon: "isFormValid",
    title: "بيانات الشركة",
    subtitle: "يرجى إدخال بيانات الشركة",
  },
  {
    id: "awaitingReview",
    completeon: "isReviewed",
    title: "بيانات المؤسسين",
    subtitle: "يرجى إدخال بيانات المؤسسين",
  },
  {
    id: "billingSummary",
    completeon: "isPaymentCompleted",
    title: "سجل المدفوعات",
    subtitle: "عرض المدفوعات السابقة",
  },
  {
    id: "paymentSuccess",
    completeon: "isPaymentCompleted",
    title: "دفع رسوم العقد",
    subtitle: "من فضلك قم بدفع الرسوم المطلوبة لأتمام عملية الأستخراج",
  },
  {
    id: "shippingAddress",
    completeon: "isShippingValid",
    title: "الخطوة الخامسة",
  },
  {
    id: "completed",
    completeon: "isRequestComplete",
    title: "تم الإرسال",
    subtitle: "تم إرسال الطلب بنجاح",
  },
];

export default function ServiceComponent() {
  const requestID = getRequestID();
  const initialRequest = getRequest(requestID);

  // Create the machine actor with stored snapshot if available
  const checkoutMachine = useMemo(() => {
    const storedSnapshot = initialRequest?.machineSnapshot;
    // Only use snapshot if it exists and is not null
    return createCheckoutMachine(storedSnapshot || undefined);
  }, [initialRequest?.machineSnapshot]);

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

  let CurrentStepOrder = 0;
  const stepsWithStatus = steps.map((s, idx) => {
    if (state.context[s.completeon] === true) {
      return { ...s, status: "finish" };
    }
    if (s.id === state.value) {
      CurrentStepOrder = idx;
      return { ...s, status: "current" };
    }
    return s;
  });

  const currentConfig = steps[CurrentStepOrder];

  const TOTAL_STEPS = steps.length;

  const [form] = Form.useForm();

  const handlePrevious = () => {
    // console.log("must go back");
    checkoutMachine.send({ type: "PREVIOUS" });
    const updatedState = checkoutMachine.getSnapshot();
    // Store the snapshot with updated context
    updateRequestStep(requestID, updatedState.value, {}, updatedState);
  };

  const handleNext = () => {
    form
      .validateFields(true)
      .then((v) => {
        // console.log("v", v);
        // Send the event to update the machine context first
        checkoutMachine.send({
          type: "NEXT",
          validStep: true,
        });
        // Get the updated state after the event is processed
        const updatedState = checkoutMachine.getSnapshot();
        // Store the snapshot with updated context
        updateRequestStep(requestID, updatedState.value, v, updatedState);
      })
      .catch((e) => {
        console.log("validation error", e);
      });
  };

  return (
    <div style={styles.wrapper}>
      {/* ====== SIDEBAR with VerticalStepper ====== */}
      <aside style={styles.sidebar}>
        <Parcel
          config={VerticalStepperParcel}
          mountParcel={mountRootParcel}
          headerTitle="الهلال للاستثمار والتنمية العمرانية"
          headerDescription="خدمة التصديق على محاضر الجمعيات العامة ومجالس الإدارة"
          steps={stepsWithStatus}
        />
      </aside>
      {/* ====== MAIN CONTENT AREA ====== */}
      <div style={styles.mainWrapper}>
        <main style={styles.mainContent}>
          {/* ------ Content Header ------ */}
          <div style={styles.contentHeader}>
            <p style={styles.stepIndicator}>
              الخطوة {CurrentStepOrder}/{TOTAL_STEPS}
            </p>
            <h1 style={styles.stepTitle}>{currentConfig?.title || ""}</h1>
            <p style={styles.stepSubtitle}>{currentConfig?.subtitle || ""}</p>
          </div>

          {/* ------ Content Body ------ */}
          <div style={styles.contentBody}>
            <details>
              <summary>Current Step: {String(state.value)}</summary>
              <pre>{JSON.stringify(state.context, null, 2)}</pre>
            </details>

            {inFormEntry && <FormEntry form={form} />}

            {inAwaitingReview && (
              <>
                <FormEntry form={form} isReadonly={true} />
                <AwaitingReview form={form} />
              </>
            )}

            {inBillingSummary && <BillingSummary form={form} />}

            {inPaymentSuccess && <PaymentSuccess form={form} />}

            {inExternalPayment && (
              <ExternalPayment
                form={form}
                requestID={requestID}
                state={state}
                checkoutMachine={checkoutMachine}
              />
            )}

            {inShippingAddress && <ShippingAddress form={form} />}

            {inCompleted && <Completed />}
            <br />
          </div>
          <div className="flex gap-2 justify-end px-3 w-full">
            {state.can({ type: "PREVIOUS" }) && (
              <Parcel
                config={ButtonParcel}
                mountParcel={mountRootParcel}
                size={"sm"}
                variant={"outline"}
                fullWidth={false}
                className={"w-fit"}
                onClick={handlePrevious}
              >
                الرجوع
              </Parcel>
            )}

            {state.can({ type: "NEXT" }) && (
              <Parcel
                config={ButtonParcel}
                mountParcel={mountRootParcel}
                size={"sm"}
                fullWidth={false}
                className={"w-fit"}
                onClick={handleNext}
              >
                التالي
              </Parcel>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
