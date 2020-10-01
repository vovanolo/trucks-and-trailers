import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, PageHeader, Alert } from 'antd';
import { useHistory, Link } from 'react-router-dom';

import app from '../express-client';
import { getFormattedError } from '../helpers';

export default function AddCompany() {
  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  function addCompany(values) {
    setIsRequestPending(true);

    app
      .create('companies', values, true)
      .then((res) => setSuccess(true))
      .catch((error) => setError(getFormattedError(error)))
      .finally(() => setIsRequestPending(false));
  }

  useEffect(() => {
    setSuccess(false);
  }, [error]);

  return (
    <div>
      <PageHeader title="Add new Company" onBack={() => history.goBack()} />
      <Row justify="center">
        <Col span={6} md={6} sm={16} xs={20}>
          {!isRequestPending &&
            (error ? (
              <Alert
                type="error"
                message={`${error.code}: ${error.message}`}
                description={error.description}
              />
            ) : (
              success && (
                <Alert
                  type="success"
                  message="Company added successfully"
                  description={
                    <Button type="link">
                      <Link to="/companies">View all Companies</Link>
                    </Button>
                  }
                />
              )
            ))}
          <Form
            name="addCompanyForm"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={addCompany}
          >
            <Form.Item
              label="Name"
              name="name"
              hasFeedback
              rules={[
                { required: true, message: "Please type company's Name" },
              ]}
            >
              <Input
                type="text"
                placeholder="Name"
                onChange={() => setError(null)}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
