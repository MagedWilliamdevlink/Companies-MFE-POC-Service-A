import { useSelector } from "@xstate/react";
import Parcel from "single-spa-react/parcel";
import { checkoutMachine } from "./machine/serviceA";
import FormEntry from "./service/formEntry";
import { mountRootParcel } from "single-spa";

import { VerticalStepperParcel, ButtonParcel } from "./shared-ui";
import { styles } from "./styles";
import { Form } from "antd";
import { getRequestID, updateRequestStep } from "./requestStorage";

// Steps configuration
const steps = [
  {
    id: "formEntry",
    title: "بيانات الشركة",
    subtitle: "يرجى إدخال بيانات الشركة",
  },
  {
    id: "awaitingReview",
    title: "بيانات المؤسسين",
    subtitle: "يرجى إدخال بيانات المؤسسين",
  },
  {
    id: "billingSummary",
    title: "سجل المدفوعات",
    subtitle: "عرض المدفوعات السابقة",
  },
  {
    id: "paymentSuccess",
    title: "دفع رسوم العقد",
    subtitle: "من فضلك قم بدفع الرسوم المطلوبة لأتمام عملية الأستخراج",
  },
  { id: "shippingAddress", title: "الخطوة الخامسة" },
  { id: "completed", title: "تم الإرسال", subtitle: "تم إرسال الطلب بنجاح" },
];

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

  let CurrentStepOrder = 0;
  const stepsWithStatus = steps.map((s, idx) => {
    if (s.id === state.value) {
      CurrentStepOrder = idx;
      return { ...s, status: "current" };
    }
    return s;
  });

  const currentConfig = steps[CurrentStepOrder];

  const TOTAL_STEPS = steps.length;

  const [form] = Form.useForm();

  const requestID = getRequestID();

  const handleNext = () => {
    form
      .validateFields(true)
      .then((v) => {
        updateRequestStep(requestID, state.value, v, state);
        const moveMachineToNextStep = checkoutMachine.send({
          type: "NEXT",
          validStep: true,
        });
        console.log(moveMachineToNextStep);
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

            {inAwaitingReview && <>Waiting for Application to be Reviewed</>}

            {inBillingSummary && <>Application approved, heres the bill</>}

            {inPaymentSuccess && <>payment successful</>}

            {inExternalPayment && <>we are now in efiniance land</>}

            {inShippingAddress && <>now enter you address to ship the thing</>}

            {inCompleted && <>the request is completed</>}
            <br />

            <div className="flex gap-2 justify-end px-3">
              {state.can({ type: "PREVIOUS" }) && (
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
          </div>
        </main>
      </div>
    </div>
  );
}
