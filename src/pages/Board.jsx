import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, TimePicker, Select } from 'antd';
import moment from 'moment';

import app from '../express-client';

const mainDataSource = [
  {
    key: 1,
    driver: 'John',
    truck: '1',
    trailer: '3',
    comment: 'Wow'
  },
  {
    key: 2,
    driver: 'Vova',
    truck: '7',
    trailer: '1',
    comment: 'Comment'
  },
];

const mainColumns = [
  {
    title: 'Driver',
    dataIndex: 'driver',
    key: 'driver'
  },
  {
    title: 'Truck',
    dataIndex: 'truck',
    key: 'truck'
  },
  {
    title: 'Trailer',
    dataIndex: 'trailer',
    key: 'trailer'
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment'
  }
];

let dateColumns = [];

export default function Board() {
  const [week, setWeek] = useState(0);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);


  


  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    // console.log(e);
    setVisible(false);
  };

  const handleCancel = () => {
    // console.log(e);
    setVisible(false);
  };




  useEffect(() => {
    const todayDate = new Date();
    const targetDate = new Date(todayDate);
    targetDate.setDate(targetDate.getDate() + 7 * week);

    handleDataRequest(targetDate);

    dateColumns = [];

    // Creating 7 columns with dates
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + i);
      dateColumns.push({
        title: nextDate.toDateString(),
        dataIndex: nextDate.toDateString(),
        key: nextDate.toDateString()
      });
      mainDataSource.forEach((col) => {
        col[nextDate.toDateString()] = <Button type="primary" shape="circle" size="middle" onClick={showModal}>+</Button>;
      });
    }

    setColumns([...mainColumns, ...dateColumns]);
    setDataSource(mainDataSource);
  }, [week]);

  function handleWeekIncrement() {
    setWeek((prevState) => prevState + 1);
  }

  function handleWeekDecrement() {
    setWeek((prevState) => prevState - 1);
  }

  function handleDataRequest(firstDate) {
    app.find('dayInfos', true, { firstDate: firstDate });
  }

  return (
    <>
      <Button onClick={handleWeekDecrement}>{'<'}</Button>
      <span style={{ padding: '1rem' }}>{week}</span>
      <Button onClick={handleWeekIncrement}>{'>'}</Button>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <Modal
        title="Location"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <label htmlFor="">Location</label>
        <Input placeholder="enter location" type="text"/>
        <label htmlFor="">Time</label>
        <TimePicker
          defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
        />
        <br/>
        <label htmlFor="">Value</label>
        <Input placeholder="enter the value"></Input>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a person"
          optionFilterProp="children"
          // onChange={onChange}
          // onFocus={onFocus}
          // onBlur={onBlur}
          // onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Select.Option value="jack">OFF</Select.Option>
          <Select.Option value="lucy">LOCAL RUN</Select.Option>
          <Select.Option value="tom">IN TRANSIT</Select.Option>
        </Select>
        
      </Modal>
    </>
  );
}
