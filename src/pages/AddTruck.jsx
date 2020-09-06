import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, PageHeader, Alert, Checkbox } from 'antd';
import { useHistory, Link } from 'react-router-dom';

import app from '../express-client';
import { getFormattedError } from '../helpers';

export default function AddDriver() {
  const [name, setName] = useState('');
  const [rate, setRate] = useState(0);
  const [ownedByCompany, setOwnedByCompany] = useState(false);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  function addTrailer() {
    setIsRequestPending(true);

    app.create('trucks', {
      name,
      comment,
      rate,
      ownedByCompany
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
        title="Add new Truck"
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
                message="Truck added successfully"
                description={
                  <Button type="link">
                    <Link to="/trucks">View all Trucks</Link>
                  </Button>
                }
              />
            )
          )}
          <Form
            name="addTruckForm"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={addTrailer}
          >
            <Form.Item
              label="Name"
              name="name"
              hasFeedback
              rules={[{ required: true, message: 'Please type truck\'s Name' }]}
            >
              <Input type="text" placeholder="Name" onChange={(e) => {
                setName(e.currentTarget.value);
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
              rules={[{ required: true, message: 'Please type truck\'s rate' }]}
            >
              <Input type="number" placeholder="Rate" onChange={(e) => {
                setRate(e.currentTarget.value);
                setError(null);
              }} />
            </Form.Item>

            <Form.Item  name="ownedByCompany"  valuePropName="checked">
              <Checkbox checked={ownedByCompany} onChange={() => setOwnedByCompany(!ownedByCompany)} >OwnedByCompany</Checkbox>
            </Form.Item>

            <Button type="primary" htmlType="submit">Add</Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
