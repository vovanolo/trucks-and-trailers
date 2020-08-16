import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';

export default function Unauthorized() {
  const history = useHistory();
  const user = useSelector((state) => state.usersReducer);

  if (user) {
    history.goBack();
  }

  return (
    <PageHeader title="Unauthorized!" />
  );
}
