import React from 'react';
import { Form, Input, Button } from 'antd';

export default function CompanyData({ onSubmit, companyData }) {
  return (
    <Form
      name="addCompanyForm"
      layout="vertical"
      initialValues={{
        remember: true,
        ...companyData,
      }}
      onFinish={onSubmit}
    >
      <Form.Item
        label="Name"
        name="name"
        hasFeedback
        rules={[{ required: true, message: "Please type company's name" }]}
      >
        <Input type="text" placeholder="Name" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Add
      </Button>
    </Form>
  );
}
