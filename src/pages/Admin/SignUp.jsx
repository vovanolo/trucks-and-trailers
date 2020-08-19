import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, PageHeader } from 'antd';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import app from '../../express-client';

export default function SignUp() {
  return (
    <>
      <PageHeader title="Login" />
      <Row justify="center">
        <Col span={6} md={6} sm={16} xs={20}>
          <Form
            name="loginForm"
            layout="vertical"
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please type in your Username' }]}
            >
              <Input type="text" placeholder="Username" />
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
