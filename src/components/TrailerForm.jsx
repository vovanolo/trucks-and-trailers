import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';

import app from '../express-client';

export default function TrailerForm() {
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState(undefined);

  useEffect(() => {
    app
      .find('companies', true)
      .then((res) => setCompanies(res.data))
      .catch((error) => console.dir(error));
  }, [companyId]);

  function handleFormSubmit(values) {
    console.log(values);
  }

  return (
    <Form
      name="addTrailerForm"
      layout="vertical"
      initialValues={{
        name: '',
        location: '',
        comment: '',
        companyId: undefined,
      }}
      onFinish={handleFormSubmit}
    >
      <Form.Item
        label="Name"
        name="name"
        hasFeedback
        rules={[{ required: true, message: "Please type trailer's Name" }]}
      >
        <Input type="text" placeholder="Name" />
      </Form.Item>

      <Form.Item
        label="Location"
        name="location"
        hasFeedback
        rules={[{ required: true, message: "Please type driver's Last Name" }]}
      >
        <Input type="text" placeholder="Location" />
      </Form.Item>

      <Form.Item
        label="Comment"
        name="comment"
        hasFeedback
        rules={[{ required: true, message: 'Please type in comment' }]}
      >
        <Input.TextArea placeholder="Comment" />
      </Form.Item>

      <Form.Item name="companyId" label="Company">
        <Select
          placeholder="Select a company"
          allowClear
          onChange={(e) => setCompanyId(e.target.value)}
        >
          {companies.map((company) => {
            return (
              <Select.Option key={company.id} value={company.id}>
                {company.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Add
      </Button>
    </Form>
  );
}
