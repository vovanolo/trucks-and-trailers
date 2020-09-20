import React from 'react';
import { Input, Form, Select } from 'antd';

import app from '../express-client';

export default function EditableCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) {
  let inputNode;

  switch (inputType) {
    case 'check':
      inputNode = (
        <Select allowClear={false}>
          <Select.Option key="user" value="user">
            user
          </Select.Option>
          <Select.Option key="admin" value="admin">
            admin
          </Select.Option>
        </Select>
      );
      break;

    default:
      inputNode = <Input />;
      break;
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}
