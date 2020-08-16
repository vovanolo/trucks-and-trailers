import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Login from './pages/Login';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

export default function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <ProtectedRoute exact path="/" component={Home} string={10} />
        <Route exact path="/login">
          <Login />
        </Route>

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
