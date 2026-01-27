import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";

export default function ShippingAddress({ form }) {
  return (
    <>
      now enter you address to ship the thing
      <Form form={form} layout="vertical">
        <Form.Item
          name={["shipping", "address"]}
          label={"shipping Address"}
          rules={[
            {
              required: true,
            },
            {
              min: 10,
            },
          ]}
        >
          <TextArea></TextArea>
        </Form.Item>
      </Form>
    </>
  );
}
