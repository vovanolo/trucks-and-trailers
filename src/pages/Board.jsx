import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, TimePicker, Select } from 'antd';
import moment from 'moment';

import app from '../express-client';

const mainColumns = [
  {
    title: 'Driver',
    dataIndex: 'firstName',
    key: 'firstName'
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
let dates = [];

export default function Board() {
  const [week, setWeek] = useState(0);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const todayDate = new Date();
    const targetDate = new Date(todayDate);
    targetDate.setDate(targetDate.getDate() + 7 * week);

    dateColumns = [];
    dates = [];

    // Creating 7 columns with dates
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + i);
      dateColumns.push({
        title: nextDate.toDateString(),
        dataIndex: nextDate.toDateString(),
        key: nextDate.toDateString(),
        render: (data, record) => data ? data : (
          <Button
            type="primary"
            shape="circle"
            size="middle"
            onClick={showModal}
            data-date={nextDate.toDateString()}
            data-record={JSON.stringify(record)}
          >
            +
          </Button>
        )
      });

      dates.push(nextDate.toDateString());
    }

    setColumns([...mainColumns, ...dateColumns]);
  }, [week]);

  useEffect(() => {
    handleDataRequest();
  }, [columns]);

  function showModal(e) {
    const data = e.currentTarget.dataset;
    const driverId = JSON.parse(data.record).id;
    const date = data.date;
    console.log(`Driver ID: ${driverId}, date: ${date}`);
    setModalVisible(true);
  };

  function handleOk() {
    setModalVisible(false);
  };

  function handleCancel() {
    setModalVisible(false);
  };

  function handleWeekIncrement() {
    setWeek((prevState) => prevState + 1);
  }

  function handleWeekDecrement() {
    setWeek((prevState) => prevState - 1);
  }

  function handleDataRequest() {
    app.find('dayInfos', true, { dates })
      .then((res) => {
        const newData = formatData(res.data);

        setDataSource(newData);
      });
  }

  function formatData(data) {
    return data.map((row) => {
      const newDayInfos = row.DayInfos.map((dayInfo) => {
        return {
          [dayInfo.date]: (
            <Button data-day_info={dayInfo}>{dayInfo.status}</Button>
          )
        };
      });

      return {
        key: row.id,
        ...row,
        ...newDayInfos[0]
      };
    });
  }

  return (
    <>
      <Button onClick={handleWeekDecrement}>{'<'}</Button>
      <span style={{ padding: '1rem' }}>{week}</span>
      <Button onClick={handleWeekIncrement}>{'>'}</Button>

      <Table columns={columns} dataSource={dataSource} pagination={false} scroll={{ x: '100vw' }} />

      <Modal
        title="Location"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <label htmlFor="locationInput">Location</label>
        <Input id="locationInput" placeholder="Enter location" type="text" />
        <label htmlFor="timeInput">Time</label>
        <TimePicker
          id="timeInput"
          default={moment('00:00:00', 'HH:mm:ss')}
        />
        <br/>
        <label htmlFor="valueInput">Value</label>
        <Input id="valueInput" placeholder="Enter the value" type="number" />
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select status"
          optionFilterProp="children"
          // onChange={onChange}
          // onFocus={onFocus}
          // onBlur={onBlur}
          // onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Select.Option value="off">OFF</Select.Option>
          <Select.Option value="local run">LOCAL RUN</Select.Option>
          <Select.Option value="in transit">IN TRANSIT</Select.Option>
        </Select>
        
      </Modal>
    </>
  );
}
