import React, { useEffect, useState } from 'react';
import { Table, Space, Button, PageHeader, Spin, Result } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';

import app from '../express-client';
import { getFormattedError } from '../helpers';

import Modal from 'antd/lib/modal/Modal';
import DriverForm from '../components/DriverForm';

let mounted = true;

export default function DriversTable() {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [driverId, setDriverId] = useState(null);
  const [editedDriver, setEditedDriver] = useState(null);

  const { url } = useRouteMatch();

  useEffect(() => {
    mounted = true;
    setIsRequestPending(true);

    app
      .find('drivers', true)
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

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: 'ascend',
    },
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (data) => (data === null ? 'Unset' : data),
      sorter: (a, b) => ('' + a.firstName).localeCompare(b.firstName),
      responsive: ['lg'],
      editable: true,
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (data) => (data === null ? 'Unset' : data),
      sorter: (a, b) => ('' + a.lastName).localeCompare(b.lastName),
      responsive: ['lg'],
      editable: true,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      sorter: (a, b) => a.comment.length - b.comment.length,
      editable: true,
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      sorter: (a, b) => a.comment - b.comment,
      editable: true,
    },
    {
      title: 'Company',
      dataIndex: 'Company',
      key: 'Company',
      render: (data) => {
        console.log(data);
        return data ? data.name : 'Empty';
      },
    },
    {
      title: 'Truck',
      dataIndex: 'Truck',
      key: 'Truck',
      render: (data) => (data ? data.name : 'Empty'),
    },
    {
      title: 'Trailer',
      dataIndex: 'Trailer',
      key: 'Trailer',
      render: (data) => (data ? data.name : 'Empty'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="default" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => removeDriver(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  function openModal(driver) {
    setModalVisible(true);
    setDriverId(driver.id);
    setEditedDriver(driver);
  }

  function closeModal() {
    setModalVisible(false);
    setDriverId(null);
    setEditedDriver(null);
  }

  // async function updateDriver(key) {
  //   try {
  //     const row = await form.validateFields();
  //     const rowWithId = {
  //       ...row,
  //       id: key,
  //     };

  //     setIsRequestPending(true);

  //     await app.update('drivers', rowWithId, true);

  //     if (mounted) {
  //       setIsRequestPending(false);

  //       const newData = [...drivers];
  //       const index = newData.findIndex((item) => key === item.key);

  //       if (index > -1) {
  //         const item = newData[index];
  //         newData.splice(index, 1, { ...item, ...row });
  //         setDrivers(newData);
  //       } else {
  //         newData.push(row);
  //         setDrivers(newData);
  //       }
  //     }
  //   } catch (error) {
  //     if (mounted) {
  //       setIsRequestPending(false);
  //       setError(getFormattedError(error));
  //     }
  //   }
  // }

  function removeDriver(id) {
    setIsRequestPending(true);

    app
      .delete('drivers', id, true)
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

  async function handleDriverUpdate(values) {
    setIsRequestPending(true);

    try {
      const newDriver = await app.update(
        'drivers',
        {
          ...values,
          id: driverId,
          trailerId: values.trailerId ? values.trailerId : null,
          truckId: values.truckId ? values.truckId : null,
          companyId: values.companyId ? values.companyId : null,
        },
        true
      );

      if (mounted) {
        setIsRequestPending(false);
        setDrivers((prevState) => {
          return prevState.map((driver) => {
            if (driver.id === newDriver.data.id) {
              return {
                ...driver,
                ...newDriver.data,
              };
            }

            return driver;
          });
        });
      }
    } catch (error) {
      if (mounted) {
        setIsRequestPending(false);
        setError(getFormattedError(error));
      }
    } finally {
      if (mounted) {
        setIsRequestPending(false);
      }
    }
  }

  return (
    <Spin spinning={isRequestPending}>
      <PageHeader
        title="Drivers"
        extra={[
          <Button type="primary" key={0}>
            <Link to={`${url}/addDriver`}>Add new Driver</Link>
          </Button>,
        ]}
      />

      {drivers !== [] && !error ? (
        <>
          <Table
            pagination={{
              defaultCurrent: 1,
              defaultPageSize: 9,
              total: drivers.count,
            }}
            scroll={{ x: '97vw' }}
            columns={columns}
            dataSource={drivers}
          />
          <Modal
            visible={modalVisible}
            onCancel={closeModal}
            footer={null}
            destroyOnClose
          >
            <DriverForm
              onSubmit={handleDriverUpdate}
              driverData={editedDriver}
            />
          </Modal>
        </>
      ) : (
        error && (
          <Result
            status="error"
            title={error.code + ': ' + error.message}
            subTitle={error.description}
            extra={
              // eslint-disable-next-line no-restricted-globals
              <Button onClick={() => location.reload()}>
                Refresh the page
              </Button>
            }
          />
        )
      )}
    </Spin>
  );
}
