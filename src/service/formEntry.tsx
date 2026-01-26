import React, { useState, useEffect, useRef } from "react";
import Parcel from "single-spa-react/parcel";
import { mountRootParcel } from "single-spa";
import { Form } from "antd";
import {
  VerticalStepperParcel,
  NavigationButtonsParcel,
  FormLabelParcel,
  FormInputParcel,
  FormSelectParcel,
  PaymentTableParcel,
} from "../shared-ui";
import { styles } from "../styles";

interface FormErrors {
  companyName?: string;
  companyType?: string;
  activityType?: string;
  commercialRegister?: string;
  capital?: string;
}

export default function FormEntry({ form }) {
  // Import shared UI - all parcels ready to use

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
    <>
      <div style={styles.formContainer}>
        <Form
          initialValues={formData}
          form={form}
          name="formEntry"
          layout="vertical"
        >
          <Form.Item
            name={["formEntry", "companyName"]}
            label="أدخل اسم الشركة"
            rules={[
              { required: true },
              {
                min: 3,
              },
            ]}
          >
            <Parcel
              config={FormInputParcel}
              mountParcel={mountRootParcel}
              onChange={(value: string) =>
                handleFieldChange("companyName", value)
              }
              placeholder="أدخل اسم الشركة"
            />
          </Form.Item>

          <Form.Item
            label="اختر نوع الشركة"
            name={["formEntry", "companyType"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Parcel
              config={FormSelectParcel}
              mountParcel={mountRootParcel}
              value={formData.companyType}
              onChange={(value: string) =>
                handleFieldChange("companyType", value)
              }
              options={companyTypeOptions}
              placeholder="اختر نوع الشركة"
              error={
                formTouched.companyType ? formErrors.companyType : undefined
              }
              disabled={isReadonly}
            />
          </Form.Item>

          <Form.Item
            name={["formEntry", "activityType"]}
            label="اختر نوع النشاط"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Parcel
              config={FormSelectParcel}
              mountParcel={mountRootParcel}
              value={formData.activityType}
              placeholder="اختر نوع النشاط"
              onChange={(value: string) =>
                handleFieldChange("activityType", value)
              }
              options={activityTypeOptions}
              error={
                formTouched.activityType ? formErrors.activityType : undefined
              }
              disabled={isReadonly}
            />
          </Form.Item>

          <Form.Item
            name={["formEntry", "commercialRegister"]}
            label="أدخل رقم السجل التجاري"
            rules={[
              {
                required: true,
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  if (isNaN(Number(value))) {
                    return Promise.reject("يجب إدخال رقم صحيح");
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Parcel
              config={FormInputParcel}
              mountParcel={mountRootParcel}
              placeholder="أدخل رقم السجل التجاري"
              value={formData.commercialRegister}
              onChange={(value: string) =>
                handleFieldChange("commercialRegister", value)
              }
              error={
                formTouched.commercialRegister
                  ? formErrors.commercialRegister
                  : undefined
              }
              disabled={isReadonly}
            />
          </Form.Item>

          <Form.Item
            name={["formEntry", "capital"]}
            label="أدخل رأس المال"
            rules={[
              { required: true, message: "رأس المال مطلوب" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  if (isNaN(Number(value))) {
                    return Promise.reject("يجب إدخال رقم صحيح");
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Parcel
              config={FormInputParcel}
              mountParcel={mountRootParcel}
              placeholder="أدخل رأس المال"
              value={formData.capital}
              onChange={(value: string) => handleFieldChange("capital", value)}
              error={formTouched.capital ? formErrors.capital : undefined}
              disabled={isReadonly}
            />
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
