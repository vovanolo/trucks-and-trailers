import React, { useEffect, useState } from 'react';
import Router from './Router';
// import app from './feathers-client';
import { useDispatch } from 'react-redux';
import { setUser } from './actions/users.actions';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // app.reAuthenticate()
    //   .then((res) => dispatch(setUser(res)))
    //   .catch((error) => console.dir(error));
  }, []);

  return (
    <Router />
  );
}
