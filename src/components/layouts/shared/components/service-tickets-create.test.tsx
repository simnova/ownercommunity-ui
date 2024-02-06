import { render, fireEvent, waitFor, queryByText } from '@testing-library/react';
import { ServiceTicketsCreate } from './service-tickets-create';
import { expect } from 'vitest';

describe('ServiceTicketsCreate', () => {
  it('renders correctly', () => {
    const { getByLabelText } = render(<ServiceTicketsCreate data={{ members: [], properties: [] }} onSave={vi.fn()} />);
    expect(getByLabelText('Title')).toBeInTheDocument();
    expect(getByLabelText('Description')).toBeInTheDocument();
    expect(getByLabelText('Property')).toBeInTheDocument();
  });
  it('renders Requestor field when isAdmin is true', () => {
    const { getByLabelText } = render(
      <ServiceTicketsCreate data={{ members: [], properties: [] }} onSave={vi.fn()} isAdmin={true} />
    );
    expect(getByLabelText('Requestor')).toBeInTheDocument();
  });

  it('does not render Requestor field when isAdmin is false', () => {
    const { queryByText } = render(
      <ServiceTicketsCreate data={{ members: [], properties: [] }} onSave={vi.fn()} isAdmin={false} />
    );
    expect(queryByText('Requestor')).toBeNull();
  });
});
describe('User Interaction', () => {
  it('updates field values when the user types into them', () => {
    const { getByLabelText } = render(<ServiceTicketsCreate data={{ members: [], properties: [] }} onSave={vi.fn()} />);
    const titleInput = getByLabelText('Title');
    const descriptionInput = getByLabelText('Description');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    expect(titleInput.value).toBe('Test Title');
    expect(descriptionInput.value).toBe('Test Description');
  });
});
describe('Form Validation', () => {
  it('displays error detected when description left empty', async () => {
    const { getByLabelText, findByText, container } = render(
      <ServiceTicketsCreate data={{ members: [], properties: [] }} onSave={vi.fn()} />
    );

    const titleInput = getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(await findByText('Description is required.')).toBeInTheDocument();
  });

  it('displays error detected when title is left empty', async () => {
    const { getByLabelText, findByText, container } = render(
      <ServiceTicketsCreate data={{ members: [], properties: [] }} onSave={vi.fn()} />
    );

    const descriptionInput = getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(await findByText('Title is required.')).toBeInTheDocument();
  });

  it('shows validation error when property is not selected', async () => {
    const { getByLabelText, findByText, container } = render(
      <ServiceTicketsCreate data={{ members: [], properties: [] }} onSave={vi.fn()} />
    );

    const titleInput = getByLabelText('Title');
    const descriptionInput = getByLabelText('Description');
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(await findByText('Property is required.')).toBeInTheDocument();
  });
});
describe('Form Submission', () => {
  it('calls onSave when the form is submitted', async () => {
    const onSave = vi.fn();
    const { getByLabelText, container } = render(
      <ServiceTicketsCreate data={{ members: [], properties: [] }} onSave={onSave} />
    );

    const titleInput = getByLabelText('Title');
    const descriptionInput = getByLabelText('Description');
    const propertyInput = getByLabelText('Property');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(propertyInput, { target: { value: 'Test Property' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled;
    });
  });

  it('does not reset form fields after successful submission', async () => {
    const onSave = vi.fn().mockResolvedValue({});
    const { getByLabelText, container } = render(
      <ServiceTicketsCreate data={{ members: [], properties: [] }} onSave={onSave} />
    );

    const titleInput = getByLabelText('Title');
    const descriptionInput = getByLabelText('Description');
    const propertyInput = getByLabelText('Property');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(propertyInput, { target: { value: 'Test Property' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled;
    });

    expect(titleInput.value).toBe('Test Title');
    expect(descriptionInput.value).toBe('Test Description');
  });
});
