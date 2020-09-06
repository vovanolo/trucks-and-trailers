import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, PageHeader, Popconfirm, Form, Spin, Result } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';

import app from '../../express-client';
import { getFormattedError } from '../../helpers';

import EditableCell from '../../components/EditableCell';

let mounted = true;

export default function UsersTable() {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const { url } = useRouteMatch();

  
  useEffect(() => {
    mounted = true;
    setIsRequestPending(true);

    app.find('users', true)
      .then((res) => {
        if (mounted) {
          setIsRequestPending(false);
          const usersArray = res.data.map((user) => {
            const userTemp = user;

            userTemp.key = userTemp.id;

            return userTemp;
          });
          setUsers(usersArray);
        }
      })
      .catch((error) => {
        if (mounted) {
          setIsRequestPending(false);
          setError(getFormattedError(error));
        }
      });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  function isEditingUser(record) {
    return record.key === editingKey;
  }

  function startEditingUser(record) {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  async function updateUser(key) {
    try {
      const row = await form.validateFields();
      const rowWithId = {
        ...row,
        id: key
      };
      
      setIsRequestPending(true);

      await app.update('users', rowWithId, true);

      if (mounted) {
        setIsRequestPending(false);

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
      }
    } catch (error) {
      if (mounted) {
        setIsRequestPending(false);
        setError(getFormattedError(error));
      }
    }
  };

  function cancelEditingUser() {
    setEditingKey('');
  };

  function removeUser(id) {
    setIsRequestPending(true);

    app.delete('users', id, true)
      .then(() => {
        if (mounted) {
          setIsRequestPending(false);
          const filteredUsers = users.filter((user) => user.id !== id);
          setUsers(filteredUsers);
        }
      })
      .catch((error) => {
        if (mounted) {
          setIsRequestPending(false);
          setError(getFormattedError(error));
        }
      });
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: 'ascend'
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
        const editable = isEditingUser(record);
        return editable ? (
          <span>
            <Button
              onClick={() => updateUser(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancelEditingUser}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Space size="middle">
            <Button type="default" disabled={editingKey !== ''} onClick={() => startEditingUser(record)}>
              Edit
            </Button>
            <Button type="link" onClick={() => removeUser(record.id)}>Delete</Button>
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
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'role' ? 'check' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditingUser(record),
      }),
    };
  });
  
  return (
    <Spin spinning={isRequestPending}>
      <PageHeader title="Admin" extra={[
        <Button type="primary" key={0}>
          <Link to={`${url}/addUser`}>Add new User</Link>
        </Button>
      ]} />
      
      {users !== [] && !error ? (
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
      ) : (
        error && (
          <Result
            status="error"
            title={error.code + ': ' + error.message}
            subTitle={error.description}
            extra={
              // eslint-disable-next-line no-restricted-globals
              <Button onClick={() => location.reload()}>Refresh the page</Button>
            }
          />
        )
      )}
    </Spin>
  );
}
