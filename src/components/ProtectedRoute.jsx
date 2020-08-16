import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';



export default function ProtectedRoute({ component: Component, ...rest }) {
  const history = useHistory();
  useEffect(() => {
    if (!localStorage.JWT_TOKEN) {
      history.push('/404');
    }
  }, []);

  return (
    <Route {...rest} render={
      (props) => <Component {...rest} {...props} />
    }
    />
  );
};