import React from 'react';
import { render, fireEvent, getByLabelText, getByPlaceholderText } from '@testing-library/react';
import AdminBookingPortal from './admin-listing-booking';
import { runInThisContext } from 'vm';

describe('AdminBookingPortal', () => {
  it('updates a price when set', () => {
    const { getByText, getByPlaceholderText } = render(<AdminBookingPortal />);

    fireEvent.change(getByPlaceholderText(/Enter Price/i), { target: { value: '100' } });
    fireEvent.click(getByText('Set Price'));

    expect(getByText(/Price: 100/i)).toBeInTheDocument();
  });
  it('outputs the dates when Add Date button is pressed', () => {
    const { getByText, getByRole, getByPlaceholderText } = render(<AdminBookingPortal />);

    const dateInput = getByPlaceholderText(/Enter Date/i);
    const addDateButton = getByText('Add Date');

    fireEvent.change(dateInput, { target: { value: '2022-12-31' } });

    fireEvent.click(addDateButton);

    const datesOutput = getByRole('list');
    expect(datesOutput.textContent).toContain('Fri Dec 30 2022');
  });
  it('deletes a date when the Delete button is clicked', () => {
    const { getByText, getByRole, getByPlaceholderText } = render(<AdminBookingPortal />);

    const dateInput = getByPlaceholderText(/Enter Date/i);
    const addDateButton = getByText('Add Date');

    fireEvent.change(dateInput, { target: { value: '2022-12-31' } });
    fireEvent.click(addDateButton);

    const datesOutput = getByRole('list');
    expect(datesOutput.children.length).toBe(1);
    const deleteButton = getByText('Delete');
    fireEvent.click(deleteButton);

    expect(datesOutput.children.length).toBe(0);
  });


  it('min/max stays update when set', () => {
    const { getByText, getByPlaceholderText } = render(<AdminBookingPortal />);

    fireEvent.change(getByPlaceholderText(/Enter Min/i), { target: { value: '1' } });
    fireEvent.change(getByPlaceholderText(/Enter Max/i), { target: { value: '4' } });

    expect(getByText(`Stay Duration: 1-5}`)).toBeInTheDocument();
  });
  it('does not allow dates that are not valid to be added', () => {
    expect(true).toBe(false);
  });
});
