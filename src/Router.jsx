import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Admin from './pages/Admin/Admin';
import Drivers from './pages/Drivers';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

export default function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute path="/admin" component={Admin} adminOnly={true} />
        <Route exact path="/login">
          <Login />
        </Route>

        <ProtectedRoute path="/drivers" component={Drivers} />


        <Route exact path="/unauthorized">
          <Unauthorized />
        </Route>

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
