import React from 'react';
import { Form, Input, Button, Row, Col, PageHeader } from 'antd';

export default function Login() {
  function loginUser() {
    console.log('test');
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
              <Input type="email" placeholder="E-Mail" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please type in your Password' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Button type="primary" htmlType="submit">Login</Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}
