import React, { useEffect, useState } from 'react';
import { Table, Space, Button, PageHeader, Spin, Result } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';

import app from '../express-client';
import { getFormattedError } from '../helpers';

import Modal from 'antd/lib/modal/Modal';
import CompanyForm from '../components/CompanyForm';

let mounted = true;

export default function DriversTable() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [editedCompany, setEditedCompany] = useState(null);

  const { url } = useRouteMatch();

  useEffect(() => {
    mounted = true;
    setIsRequestPending(true);

    app
      .find('companies', true)
      .then((res) => {
        if (mounted) {
          setIsRequestPending(false);
          const companiesArray = res.data.map((company) => {
            const companyTemp = company;

            companyTemp.key = companyTemp.id;

            return companyTemp;
          });
          setCompanies(companiesArray);
        }
      })
      .catch((error) => {
        if (mounted) {
          setIsRequestPending(false);
          setError(getFormattedError(error));
        }
      });

    return () => {
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (data) => (data === null ? 'Unset' : data),
      sorter: (a, b) => ('' + a.firstName).localeCompare(b.firstName),
      responsive: ['lg'],
      editable: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="default" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => removeCompany(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  function openModal(company) {
    setModalVisible(true);
    setCompanyId(company.id);
    setEditedCompany(company);
  }

  function closeModal() {
    setModalVisible(false);
    setCompanyId(null);
    setEditedCompany(null);
  }

  function removeCompany(id) {
    setIsRequestPending(true);

    app
      .delete('companies', id, true)
      .then(() => {
        if (mounted) {
          setIsRequestPending(false);
          const filteredCompanies = companies.filter(
            (company) => company.id !== id
          );
          setCompanies(filteredCompanies);
        }
      })
      .catch((error) => {
        if (mounted) {
          setIsRequestPending(false);
          setError(getFormattedError(error));
        }
      });
  }

  async function handleCompanyUpdate(values) {
    setIsRequestPending(true);

    try {
      const newCompany = await app.update(
        'companies',
        {
          ...values,
          id: companyId,
        },
        true
      );

      if (mounted) {
        setIsRequestPending(false);
        setCompanies((prevState) => {
          return prevState.map((company) => {
            if (company.id === newCompany.data.id) {
              return {
                ...company,
                ...newCompany.data,
              };
            }

            return company;
          });
        });
        closeModal();
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
        title="Companies"
        extra={[
          <Button type="primary" key={0}>
            <Link to={`${url}/addCompany`}>Add new Company</Link>
          </Button>,
        ]}
      />

      {companies !== [] && !error ? (
        <>
          <Table
            pagination={{
              defaultCurrent: 1,
              defaultPageSize: 9,
              total: companies.count,
            }}
            scroll={{ x: '97vw' }}
            columns={columns}
            dataSource={companies}
          />
          <Modal
            visible={modalVisible}
            onCancel={closeModal}
            footer={null}
            destroyOnClose
          >
            <CompanyForm
              onSubmit={handleCompanyUpdate}
              companyData={editedCompany}
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
