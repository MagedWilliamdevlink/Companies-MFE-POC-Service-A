import { Form } from "antd";

export default function BillingSummary({ form }) {
  return (
    <>
      Application approved, heres the bill
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
