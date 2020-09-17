import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import moment from 'moment';

import DayInfoForm from '../components/DayInfoForm';

import app from '../express-client';

const mainColumns = [
  {
    title: 'Driver',
    dataIndex: 'firstName',
    key: 'firstName',
  },
  {
    title: 'Truck',
    dataIndex: 'truck',
    key: 'truck',
  },
  {
    title: 'Trailer',
    dataIndex: 'trailer',
    key: 'trailer',
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
  },
];

let dateColumns = [];
let dates = [];

export default function Board() {
  const [week, setWeek] = useState(0);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [driverId, setDriverId] = useState(null);
  const [date, setDate] = useState(null);

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
        render: (data, record) =>
          data ? (
            <Button
              type="default"
              size="middle"
              onClick={showModal}
              data-date={nextDate.toDateString()}
              data-record={JSON.stringify(record)}
            >
              {data.status}
            </Button>
          ) : (
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
          ),
      });

      dates.push(nextDate.toDateString());
    }

    setColumns([...mainColumns, ...dateColumns]);
  }, [week]);

  useEffect(() => {
    app.find('dayInfos/all', true, { dates }).then((res) => {
      console.log(res.data);
      const newData = formatData(res.data);

      setDataSource(newData);
    });
  }, [columns]);

  useEffect(() => {
    if (driverId && date) {
      setModalVisible(true);
    }
  }, [driverId, date]);

  function showModal(e) {
    const data = e.currentTarget.dataset;

    const { id: driverId } = JSON.parse(data.record);
    const date = data.date;

    setDriverId(driverId);
    setDate(date);
  }

  function closeModal() {
    setDriverId(null);
    setDate(null);
    setModalVisible(false);
  }

  function handleOk() {
    console.log(`Driver ID: ${driverId}, date: ${date}`);
    closeModal();
  }

  function handleCancel() {
    closeModal();
  }

  function handleWeekIncrement() {
    setWeek((prevState) => prevState + 1);
  }

  function handleWeekDecrement() {
    setWeek((prevState) => prevState - 1);
  }

  function handleAddDayInfo(values) {
    const requestBody = {
      ...values,
      time: moment(values.time).format('LTS'),
      driverId,
      date,
    };

    app.create('dayInfos', requestBody, true).then((res) => {
      console.log(res.data);
      // const newData = formatData(res.data);

      // setDataSource(newData);
    });
  }

  function formatData(data) {
    const newData = data.map((row) => {
      const newDayInfos = row.DayInfos.reduce((newDayInfos, dayInfo) => {
        return {
          ...newDayInfos,
          [dayInfo.date]: dayInfo,
        };
      }, {});

      return {
        key: row.id,
        ...row,
        ...newDayInfos,
      };
    });

    console.log(newData);

    return newData;
  }

  return (
    <>
      <Button onClick={handleWeekDecrement}>{'<'}</Button>
      <span style={{ padding: '1rem' }}>{week}</span>
      <Button onClick={handleWeekIncrement}>{'>'}</Button>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: '100vw' }}
      />

      <Modal
        title="Location"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <DayInfoForm onSubmit={handleAddDayInfo} />
      </Modal>
    </>
  );
}
