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
} from "../shared-ui";

import { styles } from "./styles";

interface FormErrors {
  companyName?: string;
  companyType?: string;
  activityType?: string;
  commercialRegister?: string;
  capital?: string;
}

export default function FormEntry() {
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
  const [isReadonly, setIsReadonly] = useState(false);

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

  return (
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
            error={formTouched.companyName ? formErrors.companyName : undefined}
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
            error={formTouched.companyType ? formErrors.companyType : undefined}
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
              formTouched.activityType ? formErrors.activityType : undefined
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
            onChange={(value: string) => handleFieldChange("capital", value)}
            placeholder="أدخل رأس المال"
            error={formTouched.capital ? formErrors.capital : undefined}
            disabled={isReadonly}
          />
        </div>
      </div>
    </div>
  );
}
