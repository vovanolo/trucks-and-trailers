import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';

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
        col[nextDate.toDateString()] = <Button>+</Button>;
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
    </>
  );
}
