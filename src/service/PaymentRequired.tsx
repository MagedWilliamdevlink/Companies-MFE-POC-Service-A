import Parcel from "single-spa-react/parcel";
import { mountRootParcel } from "single-spa";
import { Form } from "antd";
import { PaymentTableParcel } from "../shared-ui";

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

export default function PaymentRequired({ form }) {
  return (
    <>
      <Parcel
        config={PaymentTableParcel}
        mountParcel={mountRootParcel}
        data={paymentHistoryData}
        title="سجل المدفوعات السابقة"
        showTitle
      />
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
      />
    </>
  );
}
