import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders marketing headline', () => {
  render(<App />);
  expect(screen.getByText(/Professional betta care/i)).toBeInTheDocument();
});

test('renders product name', () => {
  render(<App />);
  expect(screen.getAllByText(/Betta Me/i).length).toBeGreaterThan(0);
});
