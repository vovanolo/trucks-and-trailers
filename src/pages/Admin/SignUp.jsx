import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, PageHeader, Switch, Alert } from 'antd';
import { useHistory, Link } from 'react-router-dom';

import app from '../../express-client';
import { getFormattedError } from '../../helpers';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  function signUpUser() {
    setIsRequestPending(true);

    app.create('users', {
      username,
      firstName,
      lastName,
      role,
      password
    }, true)
      .then((res) => setSuccess(true))
      .catch((error) => setError(getFormattedError(error)))
      .finally(() => setIsRequestPending(false));
  }

  useEffect(() => {
    setSuccess(false);
  }, [error]);
  
  return (
    <div>
      <PageHeader
        title="Add new User"
        onBack={() => history.goBack()}
      />
      <Row justify="center">
        <Col span={6} md={6} sm={16} xs={20}>
          {!isRequestPending && (
            error ? (
              <Alert
                type="error"
                message={`${error.code}: ${error.message}`}
                description={error.description}
              />
            ) : success && (
              <Alert
                type="success"
                message="User added successfully"
                description={
                  <Button type="link">
                    <Link to="/admin">View all Users</Link>
                  </Button>
                }
              />
            )
          )}
          <Form
            name="loginForm"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={signUpUser}
          >
            <Form.Item
              label="First Name"
              name="firstName"
              hasFeedback
              rules={[{ required: true, message: 'Please type in your First Name' }]}
            >
              <Input type="text" placeholder="FirstName" onChange={(e) => {
                setFirstName(e.currentTarget.value);
                setError(null);
              }} />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              hasFeedback
              rules={[{ required: true, message: 'Please type in your Last Name' }]}
            >
              <Input type="text" placeholder="LastName" onChange={(e) => {
                setLastName(e.currentTarget.value);
                setError(null);
              }} />
            </Form.Item>

            <Form.Item
              label="Username"
              name="username"
              hasFeedback
              rules={[{ required: true, message: 'Please type in your Username' }]}
            >
              <Input type="text" placeholder="Username" onChange={(e) => {
                setUsername(e.currentTarget.value);
                setError(null);
              }} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              hasFeedback
              rules={[{ required: true, message: 'Please type in your Password' }]}
            >
              <Input.Password placeholder="Password" onChange={(e) => {
                setPassword(e.currentTarget.value);
                setError(null);
              }} />
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
              <Input.Password placeholder="Repeat Password" onChange={() => setError(null)} />
            </Form.Item>
            <Form.Item label="Admin">
              <Switch onChange={(checked) => {
                if (checked) setRole('admin');
                else setRole('user');

                setError(null);
              }}/>
            </Form.Item>

            <Button type="primary" htmlType="submit">Add</Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
