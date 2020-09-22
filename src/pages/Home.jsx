import React, { useEffect } from 'react';
import { PageHeader } from 'antd';
import { useHistory } from 'react-router-dom';

export default function Home() {
  const history = useHistory();

  useEffect(() => {
    history.push('/board');
  }, []);

  return <PageHeader title="Home" />;
}
