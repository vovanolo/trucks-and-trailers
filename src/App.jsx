import React, { useEffect, useState } from 'react';
import Router from './Router';
import { useDispatch } from 'react-redux';

import { setUser } from './actions/users.actions';
import app from './express-client';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    app.reAuthenticate()
      .then((res) => dispatch(setUser(res)))
      .catch((error) => console.dir(error));
  }, []);

  return (
    <Router />
  );
}
