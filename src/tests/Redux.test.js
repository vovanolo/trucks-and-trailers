import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { render } from '@testing-library/react';

import Navbar from '../components/Navbar';
import Router from '../Router';
import configureStore from '../store';
import { setUser } from '../actions/users.actions';

test('Redux should has user username after userInfo was dispatched', () => {
  const store = configureStore();
  const userInfo = {
    accessToken: 'sadakwodjsamdw',
    user: {
      username: 'tester'
    }
  };
  function Test() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.usersReducer);

    useEffect(() => {
      dispatch(setUser(userInfo));
    });
    return (
      <span>{user !== null && user.user.username}</span>
    );
  }
  const { getByText } = render(
    <Provider store={store}>
      <Test />
    </Provider>
  );
  expect(getByText('tester')).toBeInTheDocument();
});

test('should show Login link when user is\'nt authenticated', () => {
  const store = configureStore();
  const { getByText } = render(
    <Provider store={store}>
      <Router>
        <Navbar />
      </Router>
    </Provider>
  );
  expect(getByText('Login')).toBeInTheDocument();
});
