import React from 'react';
import { PageHeader, Button } from 'antd';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <PageHeader title="Unauthorized!">
      <Button>
        <Link to="/login">Login</Link>
      </Button>
    </PageHeader>
  );
}
