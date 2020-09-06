import React from 'react';
import { Input, Form, Select } from 'antd';

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
  const inputNode = inputType === 'check' ? (
    <Select allowClear={false}>
      <Select.Option key="user" value="user">user</Select.Option>
      <Select.Option key="admin" value="admin">admin</Select.Option>
    </Select>
  ) : <Input />;
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
};