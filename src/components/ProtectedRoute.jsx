import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';

export default function ProtectedRoute({ component: Component, adminOnly, ...rest }) {
  const history = useHistory();
  const user = useSelector((state) => state.usersReducer);
  const isLoading = useSelector((state) => state.loadingReducer);

  useEffect(() => {
    if ((!user || (adminOnly && user.user.role !== 'admin')) && !isLoading) {
      history.push('/unauthorized');
    }
  }, [user]);


  return (
    <Spin spinning={isLoading}>
      <Route {...rest} render={
        (props) => <Component {...rest} {...props} />
      }
      />
    </Spin>
  );
};