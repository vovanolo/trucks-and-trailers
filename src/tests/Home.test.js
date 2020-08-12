import React from 'react';
import jest from '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';

test('should render page title Home', () => {
  render(<Home />);
  expect(screen.getByText('Home')).toBeInTheDocument();
});