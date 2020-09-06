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

    app.create('drivers', {
      firstName,
      lastName,
      comment,
      rate,
      trailerId: selectedTrailer ,
      truckId: selectedTruck
    }, true)
      .then((res) => setSuccess(true))
      .catch((error) => setError(getFormattedError(error)))
      .finally(() => setIsRequestPending(false));
  }

  useEffect(() => {
    mounted = true;
    setIsRequestPending(true);

    app.find('trailers', true)
      .then((res) => {
        if (mounted) {
          setIsRequestPending(false);
         
          let filteredTrailers = res.data.filter((trail) => {
            if(trail.driverId === null){
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
    console.log(trailers);

    return function cleanup() {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    mounted = true;
    setIsRequestPending(true);

    app.find('trucks', true)
      .then((res) => {
        if (mounted) {
          setIsRequestPending(false);
         
          let filteredTrucks = res.data.filter((trail) => {
            if(trail.driverId === null){
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
    console.log(trailers);

    return function cleanup() {
      mounted = false;
    };
  }, []);
  
  useEffect(() => {
    setSuccess(false);
  }, [error]);


  const onTrailerChange = value => {
    setSelectedTrailer(value);
    
  };
  const onTruckChange = value => {
    setSelectedTruck(value);
    
  };
  
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

            <Form.Item
              name="trailer"
              label="Trailer"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select a trailer"
                onChange={onTrailerChange}
                allowClear
              >
                <Select.Option value={null}></Select.Option>
                {trailers.map((trailer)=>{
                  return <Select.Option key={trailer.id} value={trailer.id}>{trailer.name}</Select.Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="trucks"
              label="Trucks"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Select a truck"
                onChange={onTruckChange}
                allowClear
              >
                <Select.Option value={null}></Select.Option>
                {trucks.map((truck)=>{
                  return <Select.Option key={truck.id} value={truck.id}>{truck.name}</Select.Option>;
                })}
              </Select>
            </Form.Item>


            <Button type="primary" htmlType="submit">Add</Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
