import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';

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
    dataIndex: 'Truck',
    key: 'truck',
    render: (data) => (data ? data.name : 'Empty'),
  },
  {
    title: 'Trailer',
    dataIndex: 'Trailer',
    key: 'trailer',
    render: (data) => (data ? data.name : 'Empty'),
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
  const [modalData, setModalData] = useState(null);

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
              data-data={JSON.stringify(data)}
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
              data-driverid={record.id}
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
      const newData = formatData(res.data);

      setDataSource(newData);
    });
  }, [columns]);

  function showModal(e) {
    const data = e.currentTarget.dataset;

    if (data.data) {
      setModalData(JSON.parse(data.data));
    } else if (data.driverid) {
      setDriverId(data.driverid);
      setDate(data.date);
    }

    setModalVisible(true);
  }

  function closeModal() {
    setModalData(null);
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
      driverId,
      date,
    };

    app.create('dayInfos', requestBody, true).then((res) => {
      setDataSource((prevState) => {
        return prevState.map((row) => {
          if (row.id === res.data.driverId) {
            return {
              ...row,
              [res.data.date]: res.data,
            };
          }

          return row;
        });
      });

      closeModal();
    });
  }

  function handleEditDayInfo(values) {
    app
      .update('dayInfos', { ...values, id: modalData.id }, true)
      .then((res) => {
        setDataSource((prevState) => {
          return prevState.map((row) => {
            if (row.id === res.data.driverId) {
              return {
                ...row,
                [res.data.date]: res.data,
              };
            }

            return row;
          });
        });
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
        scroll={{ x: '97vw' }}
      />

      <Modal
        title="Location"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <DayInfoForm
          onSubmit={modalData ? handleEditDayInfo : handleAddDayInfo}
          dayInfoData={modalData}
        />
      </Modal>
    </>
  );
}
