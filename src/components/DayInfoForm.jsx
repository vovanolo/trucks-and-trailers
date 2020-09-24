import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import moment from 'moment';
import InputMask from 'react-input-mask';

function DayInfoForm({ onSubmit, dayInfoData }) {
  return (
    <Form
      onFinish={onSubmit}
      initialValues={{
        time: moment().local(true).format('HH:mm'),
        ...dayInfoData,
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
        <InputMask mask="99:99">
          {(inputProps) => (
            <Input {...inputProps} type="text" placeholder="Enter time" />
          )}
        </InputMask>
      </Form.Item>

      <Form.Item
        label="Value $"
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
        label="Miles"
        name="miles"
        rules={[
          {
            required: true,
            message: 'Please enter miles',
          },
        ]}
      >
        <Input type="number" placeholder="Enter miles" />
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
          <Select.Option value="localRun">Local Run</Select.Option>
          <Select.Option value="inTransit">In Transit</Select.Option>
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

DayInfoForm.defaultProps = {
  dayInfoData: {},
};

export default DayInfoForm;
