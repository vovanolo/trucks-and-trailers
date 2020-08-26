import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, PageHeader, Switch, Alert } from 'antd';
import { useHistory, Link } from 'react-router-dom';

import app from '../express-client';
import { getFormattedError } from '../helpers';

export default function AddDriver() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState(0);
  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  function addDriver() {
    setIsRequestPending(true);

    app.create('drivers', {
      firstName,
      lastName,
      comment,
      rate
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
        title="Add new Driver"
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
                message="Driver added successfully"
                description={
                  <Button type="link">
                    <Link to="/drivers">View all Drivers</Link>
                  </Button>
                }
              />
            )
          )}
          <Form
            name="addDriverForm"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={addDriver}
          >
            <Form.Item
              label="First Name"
              name="firstName"
              hasFeedback
              rules={[{ required: true, message: 'Please type driver\'s First Name' }]}
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
              rules={[{ required: true, message: 'Please type driver\'s Last Name' }]}
            >
              <Input type="text" placeholder="LastName" onChange={(e) => {
                setLastName(e.currentTarget.value);
                setError(null);
              }} />
            </Form.Item>

            <Form.Item
              label="Comment"
              name="comment"
              hasFeedback
              rules={[{ required: true, message: 'Please type in comment' }]}
            >
              <Input.TextArea placeholder="Comment" onChange={(e) => {
                setComment(e.currentTarget.value);
                setError(null);
              }} />
            </Form.Item>

            <Form.Item
              label="Rate"
              name="rate"
              hasFeedback
              rules={[{ required: true, message: 'Please type driver\'s rate' }]}
            >
              <Input type="number" placeholder="Rate" onChange={(e) => {
                setRate(e.currentTarget.value);
                setError(null);
              }} />
            </Form.Item>

            <Button type="primary" htmlType="submit">Add</Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
