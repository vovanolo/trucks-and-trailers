import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Empty, Row, Col, PageHeader } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';

import app from '../../express-client';

export default function UsersTable() {
  const [users, setUsers] = useState([]);
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
      responsive: ['lg']
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (data) => data === null ? 'Unset' : data,
      sorter: (a, b) => ('' + a.lastName).localeCompare(b.lastName),
      responsive: ['lg']
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => ('' + a.username).localeCompare(b.username)
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
  
  return users !== [] && (
    <>
      <PageHeader title="Admin" extra={[
        <Button type="primary" key={0}>
          <Link to={`${url}/addUser`}>Add new user</Link>
        </Button>
      ]}>
        
      </PageHeader>
      
      <Table
        pagination={{ defaultCurrent: 1, defaultPageSize: 10, total: users.count }}
        scroll={{ x: '100vw' }}
        columns={columns}
        dataSource={users}
      />
    </>
  );
}
