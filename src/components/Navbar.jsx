import React, { useState, useEffect } from 'react';
import { Menu, Button, Row, Col, Dropdown } from 'antd';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { removeUser } from '../actions/users.actions';
import app from '../express-client';
import Avatar from 'antd/lib/avatar/avatar';

export default function Navbar() {
  const location = useLocation();
  const history = useHistory();
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
    history.push('/login');
  }

  return (
    <Menu mode="horizontal" selectedKeys={[currentLocation]}>
      {user && (
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
      )}
      {!user && (
        <Menu.Item key="login">
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
      {user && (
        <Menu.Item>
          <Link to="/board">Board</Link>
        </Menu.Item>
      )}
      {user && (
        <Menu.Item>
          <Link to="/companies">Companies</Link>
        </Menu.Item>
      )}
      {user && (
        <Menu.Item>
          <Link to="/drivers">Drivers</Link>
        </Menu.Item>
      )}
      {user && (
        <Menu.Item>
          <Link to="/trailers">Trailers</Link>
        </Menu.Item>
      )}
      {user && (
        <Menu.Item>
          <Link to="/trucks">Trucks</Link>
        </Menu.Item>
      )}
      {user && user.user.role === 'admin' && (
        <Menu.Item key="admin">
          <Link to="/admin">Admin Panel</Link>
        </Menu.Item>
      )}
      {user && (
        <Menu.Item>
          <Button onClick={logout} type="default" danger>
            Logout
          </Button>
        </Menu.Item>
      )}
      {user && <Menu.Item>Logged in as {user.user.username}</Menu.Item>}
    </Menu>
  );
}
