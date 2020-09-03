import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';

const dataSource = [
  {
    key: 1,
    driver: 'John',
    truck: '1',
    trailer: '3',
    comment: 'Wow'
  }
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

let columns = [];

export default function Board() {
  const [dates, setDates] = useState([]);
  const [week, setWeek] = useState(0);

  useEffect(() => {
    const todayDate = new Date();
    const targetDate = new Date(todayDate);
    targetDate.setDate(targetDate.getDate() + 7 * week);
    const newDates = [];
    dateColumns = [];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + i);
      newDates.push(nextDate);
      dateColumns.push({
        title: nextDate.toDateString(),
        dataIndex: nextDate.toDateString(),
        key: nextDate.toDateString()
      });
    }

    columns = [];
    columns = [...mainColumns, ...dateColumns];

    setDates(newDates);
  }, [week]);

  function handleWeekIncrement() {
    setWeek((prevState) => prevState + 1);
  }

  function handleWeekDecrement() {
    setWeek((prevState) => prevState - 1);
  }

  return (
    <>
      <Button onClick={handleWeekDecrement}>{'<'}</Button>
      <span>{week}</span>
      <Button onClick={handleWeekIncrement}>{'>'}</Button>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </>
  );
}
