import React from 'react';
import { render } from '@testing-library/react';
import Home from '../pages/Home';

test('should render page title Home', () => {
  const { getByText } = render(<Home />);
  expect(getByText('Home')).toBeInTheDocument();
});