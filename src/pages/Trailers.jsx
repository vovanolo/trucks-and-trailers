import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, PageHeader, Popconfirm, Form, Spin, Result, Alert, Switch } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';

import app from '../express-client';
import { getFormattedError } from '../helpers';

import EditableCell from '../components/EditableCell';

export default function Trailers() {
  const [form] = Form.useForm();
  const [trailers, setTrailers] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const { url } = useRouteMatch();

  let mounted = true;
  
  useEffect(() => {
    mounted = true;
    setIsRequestPending(true);

    app.find('trailers', true)
      .then((res) => {
        if (mounted) {
          setIsRequestPending(false);
          const driversArray = res.data.map((user) => {
            const driverTemp = user;

            driverTemp.key = driverTemp.id;

            return driverTemp;
          });
          setTrailers(driversArray);
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

  function isEditingTrailer(record) {
    return record.key === editingKey;
  }

  function startEditingTrailer(record) {
    form.setFieldsValue({
      name: '',
      location: '',
      comment: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  async function updateTrailer(key) {
    try {
      const row = await form.validateFields();
      const rowWithId = {
        ...row,
        id: key
      };
      
      setIsRequestPending(true);

      await app.update('trailers', rowWithId, true);

      if (mounted) {
        setIsRequestPending(false);

        const newData = [...trailers];
        const index = newData.findIndex(item => key === item.key);

        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, { ...item, ...row });
          setTrailers(newData);
          setEditingKey('');
        } else {
          newData.push(row);
          setTrailers(newData);
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

  function cancelEditingTrailer() {
    setEditingKey('');
  };

  function removeTrailer(id) {
    setIsRequestPending(true);

    app.delete('trailers', id, true)
      .then(() => {
        if (mounted) {
          setIsRequestPending(false);
          const filteredTrailers = trailers.filter((trailer) => trailer.id !== id);
          setTrailers(filteredTrailers);
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (data) => data === null ? 'Unset' : data,
      sorter: (a, b) => ('' + a.name).localeCompare(b.name),
      responsive: ['lg'],
      editable: true
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (data) => data === null ? 'Unset' : data,
      sorter: (a, b) => ('' + a.location).localeCompare(b.location),
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
      title: 'Driver ID',
      dataIndex: 'driverId',
      key: 'driverId',
      sorter: (a, b) => a.driverid - b.driverid,
      render: (data) => data === null ? 'Unset' : data,
      editable: false
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditingTrailer(record);
        return editable ? (
          <span>
            <Button
              onClick={() => updateTrailer(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancelEditingTrailer}>
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <Space size="middle">
            <Button type="default" disabled={editingKey !== ''} onClick={() => startEditingTrailer(record)}>
              Edit
            </Button>
            <Button type="link" onClick={() => removeTrailer(record.id)}>Delete</Button>
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
        editing: isEditingTrailer(record),
      }),
    };
  });
  
  return (
    <Spin spinning={isRequestPending}>
      <PageHeader title="Trailers" extra={[
        <Button type="primary" key={0}>
          <Link to={`${url}/addTrailer`}>Add new Trailer</Link>
        </Button>
      ]} />
      
      {trailers !== [] && !error ? (
        <Form form={form} component={false}>
          <Table
            pagination={{ defaultCurrent: 1, defaultPageSize: 9, total: trailers.count }}
            components={{
              body: {
                cell: EditableCell
              }
            }}
            scroll={{ x: '100vw' }}
            columns={mergedColumns}
            dataSource={trailers}
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
