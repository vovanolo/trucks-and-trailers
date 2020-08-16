import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';



export default function ProtectedRoute({ component: Component, ...rest }) {
  const history = useHistory();
  const user = useSelector((state) => state.usersReducer);
  if (!user) {
    history.push('/404');
  }

  return (
    <Route {...rest} render={
      (props) => <Component {...rest} {...props} />
    }
    />
  );
};