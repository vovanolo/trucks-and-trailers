import React, { useEffect, useState } from 'react';
import { Table, Tag, Space } from 'antd';

import app from '../../express-client';

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    app.find('users', true)
      .then((res) => {
        const usersArray = res.data;
        usersArray.map((user) => {
          user.key = user.id;
          return user;
        });
        setUsers(usersArray);
      });
  }, []);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (data) => data === null ? 'Unset' : data
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (data) => data === null ? 'Unset' : data
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Role',
      key: 'role',
      dataIndex: 'role',
      render: (role) => {
        let color = role === 'admin' ? 'red' : 'green';
        return (
          <Tag color={color} key={role}>
            {role.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a>Edit {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  
  return users !== [] && <Table columns={columns} dataSource={users} />;
}
