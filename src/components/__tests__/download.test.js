import { render, screen } from '@testing-library/react';
import Download from '../Download';

describe('<Download />', () => {
  it('Should download successfully', async () => {
    render(<Download />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});