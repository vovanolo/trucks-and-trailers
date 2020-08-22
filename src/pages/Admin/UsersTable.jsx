import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, PageHeader, InputNumber, Input, Popconfirm, Form } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';

import app from '../../express-client';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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

export default function UsersTable() {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  const { url } = useRouteMatch();
  
  useEffect(() => {
    app.find('users', true)
      .then((res) => {
        const usersArray = res.data;
        usersArray.map((user) => {
          const userTemp = user;

          userTemp.key = userTemp.id;

          return userTemp;
        });
        setUsers(usersArray);
      });
  }, []);

  function isEditing(record) {
    return record.key === editingKey;
  }

  const edit = record => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const rowWithId = {
        ...row,
        id: key
      };

      app.update('users', rowWithId, true)
        .then((res) => console.log(res.data))
        .catch((error) => console.dir(error));

      const newData = [...users];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setUsers(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setUsers(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  function removeUser(id) {
    console.log(id);
    app.delete('users', id, true)
      .then((res) => {
        const filteredUsers = users.filter((user) => user.id !== id);
        setUsers(filteredUsers);
      });
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (data) => data === null ? 'Unset' : data,
      sorter: (a, b) => ('' + a.firstName).localeCompare(b.firstName),
      responsive: ['lg'],
      editable: true
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (data) => data === null ? 'Unset' : data,
      sorter: (a, b) => ('' + a.lastName).localeCompare(b.lastName),
      responsive: ['lg'],
      editable: true
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => ('' + a.username).localeCompare(b.username),
      editable: true
    },
    {
      title: 'Role',
      key: 'role',
      dataIndex: 'role',
      filters: [
        {
          text: 'User',
          value: 'user'
        },
        {
          text: 'Admin',
          value: 'admin'
        }
      ],
      onFilter: (value, record) => record.role === value,
      sorter: (a, b) => ('' + a.role).localeCompare(b.role),
      render: (role) => {
        let color = role === 'admin' ? 'red' : 'green';
        return (
          <Tag color={color} key={role}>
            {role[0].toUpperCase() + role.slice(1)}
          </Tag>
        );
      },
      editable: true
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Space size="middle">
            <Button type="default" disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Button>
            <Button type="link" onClick={() => removeUser(record.id)} >Delete</Button>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  
  return users !== [] && (
    <>
      <PageHeader title="Admin" extra={[
        <Button type="primary" key={0}>
          <Link to={`${url}/addUser`}>Add new User</Link>
        </Button>
      ]} />
      
      <Form form={form} component={false}>
        <Table
          pagination={{ defaultCurrent: 1, defaultPageSize: 9, total: users.count }}
          components={{
            body: {
              cell: EditableCell
            }
          }}
          scroll={{ x: '100vw' }}
          columns={mergedColumns}
          dataSource={users}
        />
      </Form>
    </>
  );
}
