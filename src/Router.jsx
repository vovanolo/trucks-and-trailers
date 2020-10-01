import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Admin from './pages/Admin/Admin';
import Drivers from './pages/Drivers';
import AddDriver from './pages/AddDriver';
import Trailers from './pages/Trailers';
import AddTrailer from './pages/AddTrailer';
import Trucks from './pages/Trucks';
import AddTruck from './pages/AddTruck';
import Board from './pages/Board';
import Companies from './pages/Companies';
import AddCompany from './pages/AddCompany';

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

        <ProtectedRoute exact path="/companies" component={Companies} />
        <ProtectedRoute
          exact
          path="/companies/addCompany"
          component={AddCompany}
        />
        <ProtectedRoute exact path="/drivers" component={Drivers} />
        <ProtectedRoute exact path="/drivers/addDriver" component={AddDriver} />
        <ProtectedRoute exact path="/trailers" component={Trailers} />
        <ProtectedRoute
          exact
          path="/trailers/addTrailer"
          component={AddTrailer}
        />
        <ProtectedRoute exact path="/trucks" component={Trucks} />
        <ProtectedRoute exact path="/trucks/addTruck" component={AddTruck} />
        <ProtectedRoute exact path="/board" component={Board} />

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
