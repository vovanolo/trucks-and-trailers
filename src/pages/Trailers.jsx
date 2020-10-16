import React, { useEffect, useState } from 'react';
import { Table, Button, PageHeader, Modal, Form, Spin, Result } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';

import app from '../express-client';
import { getFormattedError } from '../helpers';
import TrailerForm from '../components/TrailerForm';

let mounted = true;

export default function Trailers() {
  const [trailers, setTrailers] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const { url } = useRouteMatch();

  useEffect(() => {
    mounted = true;
    setIsRequestPending(true);

    app
      .find('trailers', true)
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

  function removeTrailer(id) {
    setIsRequestPending(true);

    app
      .delete('trailers', id, true)
      .then(() => {
        if (mounted) {
          setIsRequestPending(false);
          const filteredTrailers = trailers.filter(
            (trailer) => trailer.id !== id
          );
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
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (data) => (data === null ? 'Unset' : data),
      sorter: (a, b) => ('' + a.name).localeCompare(b.name),
      responsive: ['lg'],
      editable: true,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (data) => (data === null ? 'Unset' : data),
      sorter: (a, b) => ('' + a.location).localeCompare(b.location),
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
      title: 'Company',
      dataIndex: 'Company',
      key: 'Company',
      render: (data) => (!data ? 'Unset' : data.name),
      editable: false,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <>
          <Button
            style={{ marginRight: 5 }}
            type="primary"
            onClick={() => setModalShow(true)}
          >
            Edit
          </Button>
          <Button danger>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <Spin spinning={isRequestPending}>
      <PageHeader
        title="Trailers"
        extra={[
          <Button type="primary" key={0}>
            <Link to={`${url}/addTrailer`}>Add new Trailer</Link>
          </Button>,
        ]}
      />

      <Modal visible={modalShow}>
        <TrailerForm />
      </Modal>

      {trailers !== [] && !error ? (
        <Table
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: 9,
            total: trailers.count,
          }}
          scroll={{ x: '100vw' }}
          columns={columns}
          dataSource={trailers}
        />
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
