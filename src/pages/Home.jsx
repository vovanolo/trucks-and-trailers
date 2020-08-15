import React from 'react';
import { PageHeader } from 'antd';

export default function Home(props) {
  console.log(props.string);
  return (
    <PageHeader title="Home" />
  );
}