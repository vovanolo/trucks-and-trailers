import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';

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
        key: nextDate.toDateString(),
        render: (data) => data ? data : <Button>+</Button>
      });
    }

    setColumns([...mainColumns, ...dateColumns]);
  }, [week]);

  function handleWeekIncrement() {
    setWeek((prevState) => prevState + 1);
  }

  function handleWeekDecrement() {
    setWeek((prevState) => prevState - 1);
  }

  function handleDataRequest(firstDate) {
    app.find('dayInfos', true, { firstDate: firstDate })
      .then((res) => {
        const newData = formatData(res.data);

        setDataSource(newData);
      });
  }

  function formatData(data) {
    return data.map((row) => {
      const newDayInfos = row.DayInfos.map((dayInfo) => {
        return {
          [new Date(dayInfo.dateTime).toDateString()]: (
            <Button data-day_info={dayInfo}>{dayInfo.status}</Button>
          )
        };
      });

      return {
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
    </>
  );
}
