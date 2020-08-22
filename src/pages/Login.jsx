import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, PageHeader } from 'antd';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { setUser } from '../actions/users.actions';

import app from '../express-client';

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [username, setUsername] = useState(() => '');
  const [password, setPassword] = useState(() => '');

  function loginUser() {
    app.authenticate({
      username,
      password
    })
      .then((res) => {
        console.log(res);
        dispatch(setUser(res));
        history.push('/');
      })
      .catch((error) => console.dir(error));
  }

  return (
    <>
      <PageHeader title="Login" />
      <Row justify="center">
        <Col span={6} md={6} sm={16} xs={20}>
          <Form
            name="loginForm"
            layout="vertical"
            onFinish={loginUser}
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please type in your Username' }]}
            >
              <Input type="text" placeholder="Username" onChange={(e) => setUsername(e.currentTarget.value)} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please type in your Password' }]}
            >
              <Input.Password placeholder="Password" onChange={(e) => setPassword(e.currentTarget.value)} />
            </Form.Item>

            <Button type="primary" htmlType="submit">Login</Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}
