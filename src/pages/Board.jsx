import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { useSelector } from 'react-redux';

import DayInfoForm from '../components/DayInfoForm';

import app from '../express-client';

const mainColumns = [
  {
    title: 'Company',
    dataIndex: 'Company',
    key: 'Company',
    render: (data) => (data ? data.name : 'Empty'),
  },
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
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (data) => `${data}$`,
  },
  {
    title: 'Miles',
    dataIndex: 'miles',
    key: 'miles',
  },
  {
    title: 'Price/Miles',
    dataIndex: 'priceMiles',
    key: 'priceMiles',
    render: (data) => data.toFixed(5),
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

  const user = useSelector((state) => state.usersReducer);

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

    app.find('dayInfos/all', true, { dates }).then((res) => {
      const newData = formatData(res.data);

      setDataSource(newData);
    });
  }, [week]);

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
              price: row.DayInfos.reduce((prev, next) => prev + next.value, 0),
              miles: row.DayInfos.reduce((prev, next) => prev + next.miles, 0),
              priceMiles:
                row.DayInfos.reduce((prev, next) => prev + next.value, 0) /
                row.DayInfos.reduce((prev, next) => prev + next.miles, 0),
              [res.data.date]: res.data,
            };
          }

          return row;
        });
      });

      // eslint-disable-next-line no-restricted-globals
      location.reload();

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
                price: row.DayInfos.reduce(
                  (prev, next) => prev + next.value,
                  0
                ),
                miles: row.DayInfos.reduce(
                  (prev, next) => prev + next.miles,
                  0
                ),
                priceMiles:
                  row.DayInfos.reduce((prev, next) => prev + next.value, 0) /
                  row.DayInfos.reduce((prev, next) => prev + next.miles, 0),
                [res.data.date]: res.data,
              };
            }

            return {
              ...row,
              price: row.DayInfos.reduce((prev, next) => prev + next.value, 0),
              miles: row.DayInfos.reduce((prev, next) => prev + next.miles, 0),
              priceMiles:
                row.DayInfos.reduce((prev, next) => prev + next.value, 0) /
                row.DayInfos.reduce((prev, next) => prev + next.miles, 0),
            };
          });
        });
      });
    // eslint-disable-next-line no-restricted-globals
    location.reload();
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
        price: row.DayInfos.reduce((prev, next) => prev + next.value, 0),
        miles: row.DayInfos.reduce((prev, next) => prev + next.miles, 0),
        priceMiles:
          row.DayInfos.reduce((prev, next) => prev + next.value, 0) /
          row.DayInfos.reduce((prev, next) => prev + next.miles, 0),
        ...newDayInfos,
      };
    });

    return newData;
  }

  return (
    <>
      <Button onClick={handleWeekDecrement}>{'<'}</Button>
      <span style={{ padding: '1rem' }}>Week Number: {week}</span>
      <Button onClick={handleWeekIncrement}>{'>'}</Button>

      <br />

      {user && <p>Logged in as {user.user.username}</p>}

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
