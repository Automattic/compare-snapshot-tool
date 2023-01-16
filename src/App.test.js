import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const mainAppElement = screen.getByTestId('main-app');
  expect(mainAppElement).toBeInTheDocument();
});
