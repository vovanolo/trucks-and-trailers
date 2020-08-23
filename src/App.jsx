import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setUser } from './actions/users.actions';
import { setAuthPending } from './actions/auth.actions';
import app from './express-client';

import Router from './Router.jsx';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthPending(true));

    app.reAuthenticate()
      .then((res) => dispatch(setUser(res)))
      .catch((error) => console.dir(error))
      .finally(() => dispatch(setAuthPending(false)));
  }, []);

  return (
    <Router />
  );
}
