import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, PageHeader } from 'antd';
import { useDispatch } from 'react-redux';
import { setUser } from '../actions/users.actions';
import { useHistory } from 'react-router-dom';
import app from '../feathers-client';

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState(() => '');
  const [password, setPassword] = useState(() => '');

  function loginUser() {
    app.authenticate({
      strategy: 'local',
      email,
      password
    })
      .then((res) => {
        dispatch(setUser(res));
        history.push('/');
      })
      .catch((error) => console.dir(error));
  }

  return (
    <>
      <PageHeader title="Login" />
      <Row justify="center">
        <Col span={6}>
          <Form
            name="loginForm"
            layout="vertical"
            onFinish={loginUser}
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="E-Mail"
              name="email"
              rules={[{ required: true, message: 'Please type in your E-Mail' }]}
            >
              <Input type="email" placeholder="E-Mail" onChange={(e) => setEmail(e.currentTarget.value)} />
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
