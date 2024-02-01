import { render, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correct button label', () => {
    const { getByText } = render(<Button label="Test Button" />);
    expect(getByText('Test Button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    const { getByText } = render(<Button label="Test Button" onClick={handleClick} />);
    fireEvent.click(getByText('Test Button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders a primary button', () => {
    const { getByText } = render(<Button label="Test Button" primary />);
    expect(getByText('Test Button')).toHaveClass('storybook-button--primary');
  });

  it('renders a secondary button', () => {
    const { getByText } = render(<Button label="Test Button" secondary />);
    expect(getByText('Test Button')).toHaveClass('storybook-button--secondary');
  });
});
