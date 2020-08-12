import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const location = useLocation();
  const user = useSelector((state) => state.usersReducer);
  const [currentLocation, setCurrentLocation] = useState(() => location);

  useEffect(() => {
    const formattedLocation = location.pathname.split('/')[1];
    const pageName = formattedLocation || 'home';
    setCurrentLocation(pageName);
  }, [location]);

  return (
    <Menu mode="horizontal" selectedKeys={[currentLocation]}>
      <Menu.Item key="home">
        <Link to="/">Home</Link>
      </Menu.Item>
      {user === null ? (
        <Menu.Item key="login">
          <Link to="/login">Login</Link>
        </Menu.Item>
      ) : (
        <Menu.Item>
          {user.user.email}
        </Menu.Item>
      )}
    </Menu>
  );
}
