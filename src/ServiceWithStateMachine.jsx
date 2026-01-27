import { useSelector } from "@xstate/react";
import Parcel from "single-spa-react/parcel";
import { createCheckoutMachine } from "./machine/serviceA";
import FormEntry from "./service/FormEntry";
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
            {/* <details>
              <summary>Current Step: {String(state.value)}</summary>
              <pre>{JSON.stringify(state.context, null, 2)}</pre>
            </details>*/}

            {inFormEntry && <FormEntry form={form} />}

            {inAwaitingReview && (
              <>
                <FormEntry form={form} isReadonly={true} />
                <AwaitingReview form={form} state={state} />
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

          {/* ------ CTA ------ */}
          <div className="flex gap-3 justify-end px-3 w-full">
            {state.can({ type: "PREVIOUS" }) && (
              <Parcel
                config={ButtonParcel}
                mountParcel={mountRootParcel}
                variant={"outline"}
                fullWidth={false}
                onClick={handlePrevious}
              >
                <span
                  style={{
                    minWidth: "122px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.5759 0.965204C5.41969 1.12141 5.41969 1.37468 5.5759 1.53089L8.90322 4.8582C9.1552 5.11019 8.97674 5.54105 8.62038 5.54105L0.400062 5.54105C0.179148 5.54105 6.22844e-05 5.72013 6.23037e-05 5.94105L6.24086e-05 7.14105C6.24279e-05 7.36196 0.179148 7.54105 0.400062 7.54105L8.62038 7.54105C8.97674 7.54105 9.15521 7.9719 8.90322 8.22389L5.57591 11.5512C5.4197 11.7074 5.4197 11.9607 5.5759 12.1169L6.42422 12.9652C6.58043 13.1214 6.8337 13.1214 6.9899 12.9652L13.1312 6.82389C13.2874 6.66768 13.2874 6.41441 13.1312 6.2582L6.9899 0.116889C6.83369 -0.0393213 6.58043 -0.0393213 6.42422 0.116889L5.5759 0.965204Z"
                      fill="url(#paint0_linear_7598_1389)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_7598_1389"
                        x1="0.368027"
                        y1="5.88875"
                        x2="13.7486"
                        y2="6.55777"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#1C4C9F" />
                        <stop offset="1" stopColor="#285EBE" />
                      </linearGradient>
                    </defs>
                  </svg>
                  الرجوع
                </span>
              </Parcel>
            )}

            {state.can({ type: "NEXT" }) && (
              <Parcel
                config={ButtonParcel}
                mountParcel={mountRootParcel}
                fullWidth={false}
                onClick={handleNext}
              >
                <span
                  style={{
                    minWidth: "122px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  التالي
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.67214 12.1168C7.82835 11.9606 7.82835 11.7074 7.67214 11.5511L4.34483 8.22383C4.09284 7.97184 4.27131 7.54099 4.62767 7.54099H12.848C13.0689 7.54099 13.248 7.3619 13.248 7.14099V5.94098C13.248 5.72007 13.0689 5.54098 12.848 5.54098H4.62767C4.27131 5.54098 4.09284 5.11013 4.34483 4.85814L7.67214 1.53083C7.82835 1.37462 7.82835 1.12135 7.67214 0.965141L6.82383 0.116827C6.66762 -0.0393827 6.41435 -0.0393827 6.25814 0.116827L0.116827 6.25814C-0.0393832 6.41435 -0.0393827 6.66762 0.116827 6.82383L6.25814 12.9651C6.41435 13.1214 6.66762 13.1214 6.82383 12.9651L7.67214 12.1168Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </Parcel>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
