import React, { useState } from "react";
import Parcel from "single-spa-react/parcel";
import { mountRootParcel } from "single-spa";
import {
  VerticalStepperParcel,
  NavigationButtonsParcel,
  FormLabelParcel,
  FormInputParcel,
  FormSelectParcel,
  PaymentTableParcel,
} from "./shared-ui";
import { FeeSummaryParcel } from "./common-components";

// ==========================================
// STYLES - service-a has full control!
// ==========================================
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    direction: "rtl",
    fontFamily: "'Cairo', 'Helvetica Neue', sans-serif",
    backgroundColor: "#f5f7fa",
    height: "100%",
    minHeight: "100%",
  },
  sidebar: {
    width: "25%",
    backgroundColor: "#ffffff",
    borderLeft: "1px solid #e8e8e8",
    padding: "32px 24px",
    flexShrink: 0,
    minHeight: "70vh",
    marginBottom: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f7fa",
  },
  mainContent: {
    flex: 1,
    padding: "32px 48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  contentHeader: {
    textAlign: "right",
    marginBottom: "32px",
    width: "100%",
    maxWidth: "500px",
  },
  stepIndicator: {
    fontSize: "14px",
    color: "#1890ff",
    fontWeight: 500,
    margin: "0 0 8px 0",
  },
  stepTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1a1a2e",
    margin: "8px 0",
  },
  stepSubtitle: {
    fontSize: "14px",
    color: "#8c8c8c",
    margin: 0,
  },
  contentBody: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    flex: 1,
    flexDirection: "column",
  },
  // Form styles
  formContainer: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
  },
  formRow: {
    display: "flex",
    gap: "24px",
    marginBottom: "24px",
  },
  formField: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
};

// ==========================================
// DATA - service-a controls the data
// ==========================================

// Steps configuration
const steps = [
  { title: "الخطوة الأولى" },
  { title: "الخطوة الثانية" },
  { title: "الخطوة الثالثة" },
  { title: "الدفع الالكتروني" },
  { title: "الخطوة الخامسة" },
];

// Fee items for step 4 (payment step)
const feeItems = [
  { label: "قيمة رسم السجل التجاري", price: 200 },
  { label: "رسوم نقابة التجاريين", price: 200 },
  { label: "رسوم الهيئة العامة للاستثمار والأسواق الحرة", price: 300 },
  { label: "قيمة رسم الاتحاد العام للغرف", price: 250 },
  { label: "قيمة رسم التوثيق", price: 400 },
];

// Payment history data for step 3
const paymentHistoryData = [
  {
    id: 1,
    paymentNumber: "9871789",
    beneficiary: "الهيئة العامة للاستثمار",
    date: "25/5/2025",
    status: "success" as const,
    amount: 5000,
  },
  {
    id: 2,
    paymentNumber: "9871790",
    beneficiary: "الهيئة العامة للاستثمار",
    date: "30/5/2025",
    status: "pending" as const,
    amount: 7500,
  },
  {
    id: 3,
    paymentNumber: "9871791",
    beneficiary: "الهيئة العامة للاستثمار",
    date: "01/6/2025",
    status: "failed" as const,
    amount: 10000,
  },
  {
    id: 4,
    paymentNumber: "9871792",
    beneficiary: "الهيئة العامة للاستثمار",
    date: "05/6/2025",
    status: "success" as const,
    amount: 3000,
  },
];

// Step configurations
const stepConfigs = {
  1: {
    title: "بيانات الشركة",
    subtitle: "يرجى إدخال بيانات الشركة",
  },
  2: {
    title: "بيانات المؤسسين",
    subtitle: "يرجى إدخال بيانات المؤسسين",
  },
  3: {
    title: "سجل المدفوعات",
    subtitle: "عرض المدفوعات السابقة",
  },
  4: {
    title: "دفع رسوم العقد",
    subtitle: "من فضلك قم بدفع الرسوم المطلوبة لأتمام عملية الأستخراج",
  },
  5: {
    title: "تم الإرسال",
    subtitle: "تم إرسال الطلب بنجاح",
  },
};

// Company type options
const companyTypeOptions = [
  { label: "شركة ذات مسئولية محدودة", value: "llc" },
  { label: "شركة مساهمة", value: "joint_stock" },
  { label: "شركة تضامنية", value: "partnership" },
  { label: "شركة توصية بسيطة", value: "limited_partnership" },
];

// Activity type options
const activityTypeOptions = [
  { label: "تجارة عامة", value: "general_trade" },
  { label: "صناعة", value: "manufacturing" },
  { label: "خدمات", value: "services" },
  { label: "استثمار عقاري", value: "real_estate" },
  { label: "تكنولوجيا المعلومات", value: "it" },
];

const TOTAL_STEPS = 5;

// Form validation
interface FormErrors {
  companyName?: string;
  companyType?: string;
  activityType?: string;
  commercialRegister?: string;
  capital?: string;
}

export default function Root() {
  const [currentStep, setCurrentStep] = useState(4);
  const currentConfig = stepConfigs[currentStep as keyof typeof stepConfigs];

  // Form state for step 1
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: undefined as string | undefined,
    activityType: undefined as string | undefined,
    commercialRegister: "",
    capital: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});

  // Validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.companyName.trim()) {
      errors.companyName = "اسم الشركة مطلوب";
    } else if (formData.companyName.length < 3) {
      errors.companyName = "اسم الشركة يجب أن يكون 3 أحرف على الأقل";
    }

    if (!formData.companyType) {
      errors.companyType = "نوع الشركة مطلوب";
    }

    if (!formData.activityType) {
      errors.activityType = "نوع النشاط مطلوب";
    }

    if (!formData.commercialRegister.trim()) {
      errors.commercialRegister = "رقم السجل التجاري مطلوب";
    } else if (!/^\d+$/.test(formData.commercialRegister)) {
      errors.commercialRegister = "رقم السجل التجاري يجب أن يكون أرقام فقط";
    }

    if (!formData.capital.trim()) {
      errors.capital = "رأس المال مطلوب";
    } else if (!/^\d+$/.test(formData.capital)) {
      errors.capital = "رأس المال يجب أن يكون أرقام فقط";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle field change
  const handleFieldChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormTouched((prev) => ({ ...prev, [field]: true }));

    // Clear error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ==========================================
  // Navigation handlers - service-a controls!
  // ==========================================
  const handleNext = () => {
    // Validate step 1 before proceeding
    if (currentStep === 1) {
      setFormTouched({
        companyName: true,
        companyType: true,
        activityType: true,
        commercialRegister: true,
        capital: true,
      });

      if (!validateForm()) {
        return;
      }
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToServices = () => {
    alert("Navigating back to services...");
  };

  const handlePayment = () => {
    alert("Payment successful!");
    handleNext();
  };

  // ==========================================
  // RENDER - service-a builds the layout!
  // ==========================================
  return (
    <div style={styles.wrapper}>
      {/* ====== SIDEBAR with VerticalStepper ====== */}
      <aside style={styles.sidebar}>
        <Parcel
          config={VerticalStepperParcel}
          mountParcel={mountRootParcel}
          headerTitle="الهلال للاستثمار والتنمية العمرانية"
          headerDescription="خدمة التصديق على محاضر الجمعيات العامة ومجالس الإدارة"
          steps={steps}
          currentStep={currentStep - 1}
        />
      </aside>

      {/* ====== MAIN CONTENT AREA ====== */}
      <div style={styles.mainWrapper}>
        <main style={styles.mainContent}>
          {/* ------ Content Header ------ */}
          <div style={styles.contentHeader}>
            <p style={styles.stepIndicator}>
              الخطوة {currentStep}/{TOTAL_STEPS}
            </p>
            <h1 style={styles.stepTitle}>{currentConfig.title}</h1>
            <p style={styles.stepSubtitle}>{currentConfig.subtitle}</p>
          </div>

          {/* ------ Content Body ------ */}
          <div style={styles.contentBody}>
            {/* Step 1: Company Data Form */}
            {currentStep === 1 && (
              <div style={styles.formContainer}>
                {/* Row 1: Company Name */}
                <div style={styles.formRow}>
                  <div style={styles.formField}>
                    <Parcel
                      config={FormLabelParcel}
                      mountParcel={mountRootParcel}
                      required
                      htmlFor="companyName"
                    >
                      اسم الشركة
                    </Parcel>
                    <Parcel
                      config={FormInputParcel}
                      mountParcel={mountRootParcel}
                      id="companyName"
                      value={formData.companyName}
                      onChange={(value: string) =>
                        handleFieldChange("companyName", value)
                      }
                      placeholder="أدخل اسم الشركة"
                      error={
                        formTouched.companyName
                          ? formErrors.companyName
                          : undefined
                      }
                    />
                  </div>
                </div>

                {/* Row 2: Company Type & Activity Type */}
                <div style={styles.formRow}>
                  <div style={styles.formField}>
                    <Parcel
                      config={FormLabelParcel}
                      mountParcel={mountRootParcel}
                      required
                      htmlFor="companyType"
                    >
                      نوع الشركة
                    </Parcel>
                    <Parcel
                      config={FormSelectParcel}
                      mountParcel={mountRootParcel}
                      id="companyType"
                      value={formData.companyType}
                      onChange={(value: string) =>
                        handleFieldChange("companyType", value)
                      }
                      options={companyTypeOptions}
                      placeholder="اختر نوع الشركة"
                      error={
                        formTouched.companyType
                          ? formErrors.companyType
                          : undefined
                      }
                    />
                  </div>
                  <div style={styles.formField}>
                    <Parcel
                      config={FormLabelParcel}
                      mountParcel={mountRootParcel}
                      required
                      htmlFor="activityType"
                    >
                      نوع النشاط
                    </Parcel>
                    <Parcel
                      config={FormSelectParcel}
                      mountParcel={mountRootParcel}
                      id="activityType"
                      value={formData.activityType}
                      onChange={(value: string) =>
                        handleFieldChange("activityType", value)
                      }
                      options={activityTypeOptions}
                      placeholder="اختر نوع النشاط"
                      error={
                        formTouched.activityType
                          ? formErrors.activityType
                          : undefined
                      }
                    />
                  </div>
                </div>

                {/* Row 3: Commercial Register & Capital */}
                <div style={styles.formRow}>
                  <div style={styles.formField}>
                    <Parcel
                      config={FormLabelParcel}
                      mountParcel={mountRootParcel}
                      required
                      htmlFor="commercialRegister"
                    >
                      رقم السجل التجاري
                    </Parcel>
                    <Parcel
                      config={FormInputParcel}
                      mountParcel={mountRootParcel}
                      id="commercialRegister"
                      value={formData.commercialRegister}
                      onChange={(value: string) =>
                        handleFieldChange("commercialRegister", value)
                      }
                      placeholder="أدخل رقم السجل التجاري"
                      error={
                        formTouched.commercialRegister
                          ? formErrors.commercialRegister
                          : undefined
                      }
                    />
                  </div>
                  <div style={styles.formField}>
                    <Parcel
                      config={FormLabelParcel}
                      mountParcel={mountRootParcel}
                      required
                      htmlFor="capital"
                    >
                      رأس المال (جنيه مصري)
                    </Parcel>
                    <Parcel
                      config={FormInputParcel}
                      mountParcel={mountRootParcel}
                      id="capital"
                      value={formData.capital}
                      onChange={(value: string) =>
                        handleFieldChange("capital", value)
                      }
                      placeholder="أدخل رأس المال"
                      error={
                        formTouched.capital ? formErrors.capital : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Founders Data */}
            {currentStep === 2 && (
              <div style={{ color: "#666", padding: "20px" }}>
                <p>محتوى الخطوة الثانية - بيانات المؤسسين</p>
              </div>
            )}

            {/* Step 3: Payment History Table */}
            {currentStep === 3 && (
              <Parcel
                config={PaymentTableParcel}
                mountParcel={mountRootParcel}
                data={paymentHistoryData}
                title="سجل المدفوعات السابقة"
                showTitle
              />
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <Parcel
                config={FeeSummaryParcel}
                mountParcel={mountRootParcel}
                items={feeItems}
                expiryDate="20/6/2025"
                paymentTime="19:55:00"
                onPayment={handlePayment}
              />
            )}

            {/* Step 5: Success */}
            {currentStep === 5 && (
              <div style={{ color: "#666", padding: "20px" }}>
                <p>تم إرسال الطلب بنجاح!</p>
              </div>
            )}

            {/* ------ Navigation Buttons ------ */}
            <div style={{ marginTop: "auto", paddingTop: "32px" }}>
              <Parcel
                config={NavigationButtonsParcel}
                mountParcel={mountRootParcel}
                onNext={handleNext}
                nextLabel="التالي"
                nextDisabled={currentStep === TOTAL_STEPS}
                nextHidden={currentStep === TOTAL_STEPS}
                onPrevious={handlePrevious}
                previousLabel="الرجوع"
                previousDisabled={currentStep === 1}
                previousHidden={false}
                onBackToServices={handleBackToServices}
                backToServicesLabel="الرجوع إلى الخدمات"
                backToServicesHidden={false}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
