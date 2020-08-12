import React, { useState, useEffect } from 'react';
import { Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../actions/users.actions';
import app from '../feathers-client';


export default function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.usersReducer);
  const [currentLocation, setCurrentLocation] = useState(() => location);

  useEffect(() => {
    const formattedLocation = location.pathname.split('/')[1];
    const pageName = formattedLocation || 'home';
    setCurrentLocation(pageName);
  }, [location]);

  function logout() {
    app.logout();
    dispatch(removeUser());
  }

  return (
    <Menu mode="horizontal" selectedKeys={[currentLocation]}>
      <Menu.Item key="home">
        <Link to="/">Home</Link>
      </Menu.Item>
      {user === null && (
        <Menu.Item key="login">
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
      {user !== null && (
        <Menu.Item>
          {user.user.email}
        </Menu.Item>
      )}
      {user !== null && (
        <Menu.Item>
          <Button onClick={logout}>Logout</Button>
        </Menu.Item>
      )}
    </Menu>
  );
}
