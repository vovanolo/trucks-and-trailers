import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, PageHeader, Popconfirm, Form, Spin, Result, Alert } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';

import app from '../express-client';
import { getFormattedError } from '../helpers';

import EditableCell from '../components/EditableCell';

export default function Drivers() {
  const [form] = Form.useForm();
  const [drivers, setDrivers] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const { url } = useRouteMatch();

  let mounted = true;
  
  useEffect(() => {
    mounted = true;
    setIsRequestPending(true);

    app.find('drivers', true)
      .then((res) => {
        if (mounted) {
          setIsRequestPending(false);
          const driversArray = res.data.map((user) => {
            const driverTemp = user;

            driverTemp.key = driverTemp.id;

            return driverTemp;
          });
          setDrivers(driversArray);
        }
      })
      .catch((error) => {
        if (mounted) {
          setIsRequestPending(false);
          setError(getFormattedError(error));
        }
      });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  function isEditingDriver(record) {
    return record.key === editingKey;
  }

  function startEditingDriver(record) {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  async function updateDriver(key) {
    try {
      const row = await form.validateFields();
      const rowWithId = {
        ...row,
        id: key
      };
      
      setIsRequestPending(true);

      await app.update('drivers', rowWithId, true);

      if (mounted) {
        setIsRequestPending(false);

        const newData = [...drivers];
        const index = newData.findIndex(item => key === item.key);

        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, { ...item, ...row });
          setDrivers(newData);
          setEditingKey('');
        } else {
          newData.push(row);
          setDrivers(newData);
          setEditingKey('');
        }
      }
    } catch (error) {
      if (mounted) {
        setIsRequestPending(false);
        setError(getFormattedError(error));
      }
    }
  };

  function cancelEditingDriver() {
    setEditingKey('');
  };

  function removeDriver(id) {
    setIsRequestPending(true);

    app.delete('drivers', id, true)
      .then(() => {
        if (mounted) {
          setIsRequestPending(false);
          const filteredDrivers = drivers.filter((driver) => driver.id !== id);
          setDrivers(filteredDrivers);
        }
      })
      .catch((error) => {
        if (mounted) {
          setIsRequestPending(false);
          setError(getFormattedError(error));
        }
      });
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: 'ascend'
    },
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (data) => data === null ? 'Unset' : data,
      sorter: (a, b) => ('' + a.firstName).localeCompare(b.firstName),
      responsive: ['lg'],
      editable: true
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (data) => data === null ? 'Unset' : data,
      sorter: (a, b) => ('' + a.lastName).localeCompare(b.lastName),
      responsive: ['lg'],
      editable: true
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      sorter: (a, b) => a.comment.length - b.comment.length,
      editable: true
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      sorter: (a, b) => a.comment - b.comment,
      editable: true
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditingDriver(record);
        return editable ? (
          <span>
            <Button
              onClick={() => updateDriver(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancelEditingDriver}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Space size="middle">
            <Button type="default" disabled={editingKey !== ''} onClick={() => startEditingDriver(record)}>
              Edit
            </Button>
            <Button type="link" onClick={() => removeDriver(record.id)}>Delete</Button>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'rate' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditingDriver(record),
      }),
    };
  });
  
  return (
    <Spin spinning={isRequestPending}>
      <PageHeader title="Drivers" extra={[
        <Button type="primary" key={0}>
          <Link to={`${url}/addDriver`}>Add new Driver</Link>
        </Button>
      ]} />
      
      {drivers !== [] && !error ? (
        <Form form={form} component={false}>
          <Table
            pagination={{ defaultCurrent: 1, defaultPageSize: 9, total: drivers.count }}
            components={{
              body: {
                cell: EditableCell
              }
            }}
            scroll={{ x: '100vw' }}
            columns={mergedColumns}
            dataSource={drivers}
          />
        </Form>
      ) : (
        error && (
          <Result
            status="error"
            title={error.code + ': ' + error.message}
            subTitle={error.description}
            extra={
              // eslint-disable-next-line no-restricted-globals
              <Button onClick={() => location.reload()}>Refresh the page</Button>
            }
          />
        )
      )}
    </Spin>
  );
}
