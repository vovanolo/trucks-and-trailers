import React, { useEffect } from 'react';
import Router from './Router';
import { useDispatch } from 'react-redux';

import { setUser } from './actions/users.actions';
import app from './express-client';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // app.reAuthenticate()
    //   .then((res) => dispatch(setUser(res)))
    //   .catch((error) => console.dir(error));
    app.find('users').then((res) => console.log(res.data));
  }, []);

  return (
    <Router />
  );
}
