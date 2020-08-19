import React, { useEffect, useState } from 'react';
import { Table, Column, Tag, Space } from 'antd';
import app from '../../express-client';


export default function UsersTable() {
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
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
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
  
  const [users, setUsers] = useState([]);
  useEffect(() => {
    app.find('users', true)
      .then((data) => {
        const newUsers = data.data.map((user, index) => user.key = index);
        setUsers(newUsers);
      });
  }, []);
  
  
  return (
    <Table columns={columns} dataSource={users !== [] && users} />  
  );
}
