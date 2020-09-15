import React from 'react';
import { Form, Input, TimePicker, Select, Button } from 'antd';
import moment from 'moment';

export default function DayInfoForm({ onSubmit }) {
  return (
    <Form
      onFinish={onSubmit}
      initialValues={{
        time: moment(),
      }}
    >
      <Form.Item
        label="Location"
        name="location"
        rules={[
          {
            required: true,
            message: 'Please enter location',
          },
        ]}
      >
        <Input type="text" placeholder="Enter location" />
      </Form.Item>

      <Form.Item
        label="Time"
        name="time"
        rules={[
          {
            required: true,
            message: 'Please choose time',
          },
        ]}
      >
        <TimePicker placeholder="Choose time" />
      </Form.Item>

      <Form.Item
        label="Value"
        name="value"
        rules={[
          {
            required: true,
            message: 'Please enter value',
          },
        ]}
      >
        <Input type="number" placeholder="Enter the value" />
      </Form.Item>

      <Form.Item
        label="Choose status"
        name="status"
        rules={[
          {
            required: true,
            message: 'Please choose status',
          },
        ]}
      >
        <Select placeholder="Choose status">
          <Select.Option value="off">Off</Select.Option>
          <Select.Option value="local run">Local Run</Select.Option>
          <Select.Option value="in transit">In Transit</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
