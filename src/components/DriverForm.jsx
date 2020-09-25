import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';

import app from '../express-client';

export default function DriverForm({ onSubmit, driverData }) {
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const newTrucks = await app.find('trucks', true);
        const newTrailers = await app.find('trailers', true);

        const filteredTrucks = newTrucks.data.filter(
          ({ driverId }) => !driverId || driverId == driverData.id
        );
        const filteredTrailers = newTrailers.data.filter(
          ({ driverId }) => !driverId || driverId == driverData.id
        );

        setTrucks(filteredTrucks);
        setTrailers(filteredTrailers);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <Form
      name="addDriverForm"
      layout="vertical"
      initialValues={{
        remember: true,
        ...driverData,
        trailerId: driverData.Trailer ? driverData.Trailer.id : undefined,
        truckId: driverData.Truck ? driverData.Truck.id : undefined,
      }}
      onFinish={onSubmit}
    >
      <Form.Item
        label="First Name"
        name="firstName"
        hasFeedback
        rules={[{ required: true, message: "Please type driver's First Name" }]}
      >
        <Input type="text" placeholder="FirstName" />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        hasFeedback
        rules={[{ required: true, message: "Please type driver's Last Name" }]}
      >
        <Input type="text" placeholder="LastName" />
      </Form.Item>

      <Form.Item
        label="Comment"
        name="comment"
        hasFeedback
        rules={[{ required: true, message: 'Please type in comment' }]}
      >
        <Input.TextArea placeholder="Comment" />
      </Form.Item>

      <Form.Item
        label="Rate"
        name="rate"
        hasFeedback
        rules={[{ required: true, message: "Please type driver's rate" }]}
      >
        <Input type="number" placeholder="Rate" />
      </Form.Item>

      <Form.Item name="trailerId" label="Trailer">
        <Select placeholder="Select a trailer" allowClear>
          {trailers.map((trailer) => {
            return (
              <Select.Option key={trailer.id} value={trailer.id}>
                {trailer.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item name="truckId" label="Truck">
        <Select placeholder="Select a truck" allowClear>
          {trucks.map((truck) => {
            return (
              <Select.Option key={truck.id} value={truck.id}>
                {truck.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Add
      </Button>
    </Form>
  );
}
