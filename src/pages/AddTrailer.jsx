import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, PageHeader, Switch, Alert } from 'antd';
import { useHistory, Link } from 'react-router-dom';

import app from '../express-client';
import { getFormattedError } from '../helpers';

export default function AddDriver() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  function addTrailer() {
    setIsRequestPending(true);

    app.create('trailers', {
      name,
      location,
      comment
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
        title="Add new Trailer"
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
                message="Trailer added successfully"
                description={
                  <Button type="link">
                    <Link to="/trailers">View all Trailers</Link>
                  </Button>
                }
              />
            )
          )}
          <Form
            name="addTrailerForm"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={addTrailer}
          >
            <Form.Item
              label="Name"
              name="name"
              hasFeedback
              rules={[{ required: true, message: 'Please type trailer\'s Name' }]}
            >
              <Input type="text" placeholder="Name" onChange={(e) => {
                setName(e.currentTarget.value);
                setError(null);
              }} />
            </Form.Item>

            <Form.Item
              label="Location"
              name="location"
              hasFeedback
              rules={[{ required: true, message: 'Please type driver\'s Last Name' }]}
            >
              <Input type="text" placeholder="Location" onChange={(e) => {
                setLocation(e.currentTarget.value);
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

            <Button type="primary" htmlType="submit">Add</Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
