import { Checkbox, Form } from "antd";

export default function AwaitingReview({ form }) {
  return (
    <>
      Waiting for Application to be Reviewed
      <Form form={form} name="verificationStep">
        <Form.Item
          name={["verificationStep", "verified"]}
          label="verify"
          valuePropName="checked"
          rules={[
            { required: true },
            {
              validator: (_, value) => {
                if (value === true) {
                  return Promise.resolve();
                }
                return Promise.reject("يجب إدخال رقم صحيح");
              },
            },
          ]}
        >
          <Checkbox />
        </Form.Item>
      </Form>
    </>
  );
}
