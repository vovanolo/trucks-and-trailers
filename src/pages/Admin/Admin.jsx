import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import UsersTable from './UsersTable';
import SignUp from './SignUp';

export default function Admin() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <UsersTable />
      </Route>
      <Route exact path={`${path}/addUser`}>
        <SignUp />
      </Route>
      <Route exact path={`${path}/user/:id/edit`}>
        <SignUp />
      </Route>
    </Switch>
  );
}



