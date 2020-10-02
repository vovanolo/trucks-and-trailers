import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, PageHeader, Select, Alert } from 'antd';
import { useHistory, Link } from 'react-router-dom';

import app from '../express-client';
import { getFormattedError } from '../helpers';

let mounted = true;

export default function AddDriver() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [comment, setComment] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [rate, setRate] = useState(0);
  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  function addDriver() {
    setIsRequestPending(true);

    app
      .create(
        'drivers',
        {
          firstName,
          lastName,
          comment,
          rate,
          trailerId: selectedTrailer,
          truckId: selectedTruck,
          companyId: selectedCompany,
        },
        true
      )
      .then((res) => setSuccess(true))
      .catch((error) => setError(getFormattedError(error)))
      .finally(() => setIsRequestPending(false));
  }

  useEffect(() => {
    mounted = true;
    setIsRequestPending(true);

    app
      .find('trailers', true)
      .then((res) => {
        if (mounted) {
          setIsRequestPending(false);

          let filteredTrailers = res.data.filter((trail) => {
            if (trail.driverId === null) {
              return true;
            } else {
              return false;
            }
          });
          setTrailers(filteredTrailers);
        }
      })
      .catch((error) => {
        if (mounted) {
          setIsRequestPending(false);
          setError(getFormattedError(error));
        }
      });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    mounted = true;
    setIsRequestPending(true);

    app
      .find('trucks', true)
      .then((res) => {
        if (mounted) {
          setIsRequestPending(false);

          let filteredTrucks = res.data.filter((trail) => {
            if (trail.driverId === null) {
              return true;
            } else {
              return false;
            }
          });
          setTrucks(filteredTrucks);
        }
      })
      .catch((error) => {
        if (mounted) {
          setIsRequestPending(false);
          setError(getFormattedError(error));
        }
      });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    mounted = true;
    setIsRequestPending(true);

    app
      .find('companies', true)
      .then((res) => {
        if (mounted) {
          setIsRequestPending(false);

          let filteredCompanies = res.data.filter((company) => {
            if (company.driverId === null) {
              return true;
            } else {
              return false;
            }
          });
          setCompanies(filteredCompanies);
        }
      })
      .catch((error) => {
        if (mounted) {
          setIsRequestPending(false);
          setError(getFormattedError(error));
        }
      });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setSuccess(false);
  }, [error]);

  const onTrailerChange = (value) => {
    setSelectedTrailer(value);
  };

  const onTruckChange = (value) => {
    setSelectedTruck(value);
  };

  const onCompanyChange = (value) => {
    setSelectedCompany(value);
  };

  const filteredTrailers = trailers.filter((trailer) =>
    selectedCompany ? trailer.companyId === selectedCompany : true
  );

  const filteredTrucks = trucks.filter((truck) =>
    selectedCompany ? truck.companyId === selectedCompany : true
  );

  return (
    <div>
      <PageHeader title="Add new Driver" onBack={() => history.goBack()} />
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
                  message="Driver added successfully"
                  description={
                    <Button type="link">
                      <Link to="/drivers">View all Drivers</Link>
                    </Button>
                  }
                />
              )
            ))}
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
              rules={[
                { required: true, message: "Please type driver's First Name" },
              ]}
            >
              <Input
                type="text"
                placeholder="FirstName"
                onChange={(e) => {
                  setFirstName(e.currentTarget.value);
                  setError(null);
                }}
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              hasFeedback
              rules={[
                { required: true, message: "Please type driver's Last Name" },
              ]}
            >
              <Input
                type="text"
                placeholder="LastName"
                onChange={(e) => {
                  setLastName(e.currentTarget.value);
                  setError(null);
                }}
              />
            </Form.Item>

            <Form.Item
              label="Comment"
              name="comment"
              hasFeedback
              rules={[{ required: true, message: 'Please type in comment' }]}
            >
              <Input.TextArea
                placeholder="Comment"
                onChange={(e) => {
                  setComment(e.currentTarget.value);
                  setError(null);
                }}
              />
            </Form.Item>

            <Form.Item
              label="Rate"
              name="rate"
              hasFeedback
              rules={[{ required: true, message: "Please type driver's rate" }]}
            >
              <Input
                type="number"
                placeholder="Rate"
                onChange={(e) => {
                  setRate(e.currentTarget.value);
                  setError(null);
                }}
              />
            </Form.Item>

            <Form.Item name="trailer" label="Trailer">
              <Select
                placeholder="Select a trailer"
                onChange={onTrailerChange}
                allowClear
              >
                {filteredTrailers.map((trailer) => {
                  return (
                    <Select.Option key={trailer.id} value={trailer.id}>
                      {trailer.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item name="trucks" label="Trucks">
              <Select
                placeholder="Select a truck"
                onChange={onTruckChange}
                allowClear
              >
                {filteredTrucks.map((truck) => {
                  return (
                    <Select.Option key={truck.id} value={truck.id}>
                      {truck.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item name="companies" label="Companies">
              <Select
                placeholder="Select a company"
                onChange={onCompanyChange}
                allowClear
              >
                {companies.map((company) => {
                  return (
                    <Select.Option key={company.id} value={company.id}>
                      {company.name}
                    </Select.Option>
                  );
                })}
              </Select>
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
