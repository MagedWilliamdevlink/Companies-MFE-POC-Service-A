import React, { useState, useEffect, useRef } from "react";
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
import {
  getRequest,
  createRequest,
  updateRequestStep,
  type RequestData,
} from "./requestStorage";

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
  // Get requestId from URL or mount point data attribute
  const getRequestId = (): string | null => {
    if (typeof window === "undefined") return null;
    
    // Try to get from mount point data attribute first
    const mountPoint = document.querySelector('[data-request-id]');
    if (mountPoint) {
      const requestId = mountPoint.getAttribute('data-request-id');
      if (requestId) return requestId;
    }
    
    // Fallback to URL parsing
    const pathname = window.location.pathname;
    const match = pathname.match(/\/(service-[a-z]+)\/(.+)/);
    if (match && match[2]) {
      // Return "new" if it's "new", otherwise return the requestId
      return match[2];
    }
    
    return null;
  };

  const [requestId, setRequestId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isReadonly, setIsReadonly] = useState(false);
  const currentConfig = stepConfigs[currentStep as keyof typeof stepConfigs] || stepConfigs[1];

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
  const lastProcessedRequestIdRef = useRef<string | null>(null);
  const formDataRef = useRef(formData);
  
  // Keep formDataRef in sync with formData so we can access it in event handlers
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Helper function to find next incomplete step
  const findNextIncompleteStep = (completedSteps: number[]): number => {
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      if (!completedSteps.includes(i)) {
        return i;
      }
    }
    return TOTAL_STEPS; // All steps completed, show last step
  };

  // Load request data on mount and when URL changes
  useEffect(() => {
    const loadRequestData = () => {
      try {
        const id = getRequestId();
        
        // If we already processed this requestId, skip
        if (id === lastProcessedRequestIdRef.current) {
          return;
        }
        
        if (id && id !== 'new') {
          // Load existing request
          try {
            const request = getRequest(id);
            
            if (request) {
              lastProcessedRequestIdRef.current = id;
              setRequestId(id);
              
              // Load saved form data
              if (request.formData && Object.keys(request.formData).length > 0) {
                setFormData((prev) => ({ ...prev, ...request.formData }));
              }
              
              // Navigate to next incomplete step
              const nextIncompleteStep = findNextIncompleteStep(request.completedSteps || []);
              if (nextIncompleteStep >= 1 && nextIncompleteStep <= TOTAL_STEPS) {
                setCurrentStep(nextIncompleteStep);
              }
              
              // Mark current step as readonly if it's already completed
              setIsReadonly((request.completedSteps || []).includes(nextIncompleteStep));
            }
          } catch (error) {
            console.error("Error loading request data:", error);
            // Reset to step 1 on error
            setCurrentStep(1);
          }
        } else if (id === 'new') {
          // Create new request - only if we haven't already processed "new"
          if (lastProcessedRequestIdRef.current !== 'new') {
            try {
              const serviceId = window.location.pathname.split('/')[1] || 'service-a';
              const newRequest = createRequest(
                serviceId,
                "خدمة التصديق على محاضر الجمعيات العامة ومجالس الإدارة"
              );
              
              // Mark "new" as processed to prevent duplicate creation
              lastProcessedRequestIdRef.current = 'new';
              
              // Update URL first
              const newPath = `/${serviceId}/${newRequest.requestId}`;
              window.history.replaceState({}, '', newPath);
              
              // Set requestId and mark the new requestId as processed
              lastProcessedRequestIdRef.current = newRequest.requestId;
              setRequestId(newRequest.requestId);
              
              // Reset form state for new request
              setFormData({
                companyName: "",
                companyType: undefined,
                activityType: undefined,
                commercialRegister: "",
                capital: "",
              });
              setCurrentStep(1);
              setIsReadonly(false);
              setFormErrors({});
              setFormTouched({});
            } catch (error) {
              console.error("Error creating new request:", error);
            }
          }
        } else {
          // No requestId found
          setRequestId(null);
        }
      } catch (error) {
        console.error("Error in loadRequestData:", error);
        // Ensure we have a valid step
        setCurrentStep(1);
      }
    };
    
    loadRequestData();
  }, []); // Run on mount only

  // Listen for URL changes (for browser back/forward and programmatic navigation)
  useEffect(() => {
    let lastKnownPath = window.location.pathname;
    let lastKnownRequestId: string | null = null;
    
    const handleLocationChange = () => {
      const currentPath = window.location.pathname;
      const id = getRequestId();
      const currentProcessed = lastProcessedRequestIdRef.current;
      
      // Only process if the path actually changed
      const pathChanged = currentPath !== lastKnownPath;
      const requestIdChanged = id !== lastKnownRequestId;
      
      // Update tracking variables
      lastKnownPath = currentPath;
      lastKnownRequestId = id;
      
      // If path didn't change and requestId didn't change, skip processing
      // This prevents resetting form when user is typing
      if (!pathChanged && !requestIdChanged) {
        return;
      }
      
      // If URL changed to "new", reset the processed ref to allow creation
      // But only if we're actually navigating to "new" (path changed)
      // And don't reset if form already has data (user might be typing)
      if (id === 'new' && currentProcessed !== 'new' && pathChanged) {
        // Check if form has any data - if it does, don't reset (user is actively using the form)
        const currentFormData = formDataRef.current;
        const hasFormData = currentFormData.companyName.trim() || 
                           currentFormData.companyType || 
                           currentFormData.activityType || 
                           currentFormData.commercialRegister.trim() || 
                           currentFormData.capital.trim();
        
        // Only reset if form is empty or we're actually navigating from a different request
        if (!hasFormData || (currentProcessed && currentProcessed !== 'new' && currentProcessed !== null)) {
          lastProcessedRequestIdRef.current = null; // Reset to allow processing "new"
          setRequestId('new');
          // Reset form state for new request only if we're actually navigating
          setFormData({
            companyName: "",
            companyType: undefined,
            activityType: undefined,
            commercialRegister: "",
            capital: "",
          });
          setCurrentStep(1);
          setIsReadonly(false);
          setFormErrors({});
          setFormTouched({});
        }
        return;
      }
      
      // Only reload if the requestId changed and we haven't processed it
      if (id && id !== 'new' && id !== currentProcessed && requestIdChanged) {
        lastProcessedRequestIdRef.current = null; // Reset to allow reload
        // Trigger reload by setting requestId
        setRequestId(id);
        // Force a small delay to ensure state update
        setTimeout(() => {
          const currentId = getRequestId();
          if (currentId && currentId !== 'new') {
            const request = getRequest(currentId);
            if (request) {
              lastProcessedRequestIdRef.current = currentId;
              setRequestId(currentId);
              const nextIncompleteStep = findNextIncompleteStep(request.completedSteps || []);
              if (nextIncompleteStep >= 1 && nextIncompleteStep <= TOTAL_STEPS) {
                setCurrentStep(nextIncompleteStep);
              }
              setIsReadonly((request.completedSteps || []).includes(nextIncompleteStep));
              if (request.formData && Object.keys(request.formData).length > 0) {
                setFormData((prev) => ({ ...prev, ...request.formData }));
              }
            }
          } else if (currentId === 'new' && window.location.pathname !== lastKnownPath) {
            // If it changed to "new", handle it only if path actually changed
            lastProcessedRequestIdRef.current = null;
            setRequestId('new');
            setFormData({
              companyName: "",
              companyType: undefined,
              activityType: undefined,
              commercialRegister: "",
              capital: "",
            });
            setCurrentStep(1);
            setIsReadonly(false);
          }
        }, 50);
      }
    };

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', handleLocationChange);
    
    // Check for URL changes periodically (for replaceState/pushState)
    // Increased interval to reduce unnecessary checks
    const checkInterval = setInterval(handleLocationChange, 500);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(checkInterval);
    };
  }, []);

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
      // Save current step data before moving to next
      if (requestId) {
        try {
          updateRequestStep(requestId, currentStep + 1, currentStep === 1 ? formData : undefined);
        } catch (error) {
          console.error("Error saving request data:", error);
        }
      }
      
      setCurrentStep(currentStep + 1);
      setIsReadonly(false); // Next step is not readonly
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      
      // Check if previous step is completed (readonly) and load its data
      if (requestId) {
        try {
          const request = getRequest(requestId);
          if (request) {
            // Check if step is completed
            if (request.completedSteps.includes(prevStep)) {
              setIsReadonly(true);
            } else {
              setIsReadonly(false);
            }
            
            // If going back to step 1, restore form data
            if (prevStep === 1 && request.formData) {
              setFormData((prev) => ({ ...prev, ...request.formData }));
            }
          }
        } catch (error) {
          console.error("Error checking step status:", error);
        }
      }
      
      setCurrentStep(prevStep);
    }
  };

  const handleBackToServices = () => {
    alert("Navigating back to services...");
  };

  const handlePayment =(url)=>{
    // alert("Payment successful!");
    window.open(url, "_blank")
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
                      disabled={isReadonly}
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
                      disabled={isReadonly}
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
                      disabled={isReadonly}
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
                      disabled={isReadonly}
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
                      disabled={isReadonly}
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
                onPayment={()=> handlePayment("https://google.com")}
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
