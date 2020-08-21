import React, { useEffect } from 'react';
import Router from './Router';
import { useDispatch } from 'react-redux';

import { setUser } from './actions/users.actions';
import { setLoading } from './actions/loading.actions';
import app from './express-client';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    app.reAuthenticate()
      .then((res) => dispatch(setUser(res)))
      .catch((error) => console.dir(error))
      .finally(() => dispatch(setLoading(false)));
  }, []);

  return (
    <Router />
  );
}
