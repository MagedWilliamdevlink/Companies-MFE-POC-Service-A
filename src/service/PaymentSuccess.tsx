import { Form } from "antd";

export default function PaymentSuccess({ form }) {
  return (
    <>
      payment successful
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
