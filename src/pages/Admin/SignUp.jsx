import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, PageHeader } from 'antd';
import { useHistory } from 'react-router-dom';

import app from '../../express-client';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  function signUpUser() {
    app.create('users', {
      username,
      password
    }, true)
      .then((res) => console.log(res.data))
      .catch((error) => console.dir(error));
  }
  
  return (
    <>
      <PageHeader
        title="Add new User"
        onBack={() => history.goBack()}
      />
      <Row justify="center">
        <Col span={6} md={6} sm={16} xs={20}>
          <Form
            name="loginForm"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={signUpUser}
          >
            <Form.Item
              label="Username"
              name="username"
              hasFeedback
              rules={[{ required: true, message: 'Please type in your Username' }]}
            >
              <Input type="text" placeholder="Username" onChange={(e) => setUsername(e.currentTarget.value)} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              hasFeedback
              rules={[{ required: true, message: 'Please type in your Password' }]}
            >
              <Input.Password placeholder="Password" onChange={(e) => setPassword(e.currentTarget.value)} />
            </Form.Item>

            <Form.Item
              label="Repeat Password"
              name="repeatPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please repeat your Password'
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Passwords do not match!');
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Repeat Password" />
            </Form.Item>

            <Button type="primary" htmlType="submit">Add</Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}
