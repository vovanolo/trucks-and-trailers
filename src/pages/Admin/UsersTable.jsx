import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Row, Col } from 'antd';

import app from '../../express-client';

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  
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
      sorter: (a, b) => ('' + a.firstName).localeCompare(b.firstName)
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (data) => data === null ? 'Unset' : data,
      sorter: (a, b) => ('' + a.lastName).localeCompare(b.lastName)
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => ('' + a.username).localeCompare(b.username)
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
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
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link">Edit</Button>
          <Button type="link">Delete</Button>
        </Space>
      ),
    },
  ];
  
<<<<<<< HEAD
  const [users, setUsers] = useState([{
    key: '1',
    id: '1',
    firstName: 'Good',
    lastName: 'Alex',
    username: 'alex_cherhavski',
    role: 'admin'
  }]);
  useEffect(() => {
    // app.find('users', true)
    //   .then((data) => {
    //     const newUsers = data.data.map((user, index) => user.key = index);
    //     setUsers(newUsers);
    //   });
  }, []);
  
  
  return (
    <Table columns={columns} dataSource={users} />
=======
  return users !== [] && (
    <Table
      pagination={{ defaultCurrent: 1, defaultPageSize: 10, total: users.count }}
      columns={columns}
      dataSource={users}
    />
>>>>>>> ff0a719abdf26f70df3948d3562879575a5fbe78
  );
}
