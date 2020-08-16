import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { render, screen } from '@testing-library/react';

import Navbar from '../components/Navbar';
import Router from '../Router';
import configureStore from '../store';
import { setUser } from '../actions/users.actions';

test('should show user username when user is authenticated', () => {
  const store = configureStore();
  const user = {
    accessToken: 'sadakwodjsamdw',
    user: {
      username: 'tester'
    }
  };
  function Test() {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(setUser(user));
    }, []);
    return null;
  }
  render(
    <Provider store={store}>
      <Test />
      <Router>
        <Navbar />
      </Router>
    </Provider>
  );
  expect(screen.getByText('tester')).toBeInTheDocument();
});

test('should show Login link when user is\'nt authenticated', () => {
  const store = configureStore();
  render(
    <Provider store={store}>
      <Router>
        <Navbar />
      </Router>
    </Provider>
  );
  expect(screen.getByText('Login')).toBeInTheDocument();
});
