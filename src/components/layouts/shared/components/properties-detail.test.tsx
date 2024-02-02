import { render, fireEvent, waitFor, getByPlaceholderText, getByText } from '@testing-library/react';
import { PropertiesDetail } from './properties-detail';

describe('PropertiesDetail', () => {
  it('renders without crashing', () => {
    render(<PropertiesDetail data={{ property: {}, members: [] }} onSave={vi.fn()} onDelete={vi.fn()} />);
  });

  it('displays property info', () => {
    const property = {
      id: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      propertyName: 'Test Property',
      propertyType: 'Test Type'
    };
    const { getByText } = render(
      <PropertiesDetail data={{ property, members: [] }} onSave={vi.fn()} onDelete={vi.fn()} />
    );

    expect(getByText('Id')).toBeInTheDocument;
    expect(getByText('Created At')).toBeInTheDocument;
    expect(getByText('Updated At')).toBeInTheDocument;
  });

  //   it('display property name and type when isAdmin is true', () => {
  //     const property = {
  //       id: '1',
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //       propertyName: 'Test Property',
  //       propertyType: 'Test Type'
  //     };
  //     const { queryByText } = render(
  //       <PropertiesDetail data={{ property, members: [] }} onSave={vi.fn()} onDelete={vi.fn()} isAdmin={true} />
  //     );

  //     expect(queryByText('Property Name')).not.toBeInTheDocument();
  //     expect(queryByText('Property Type')).not.toBeInTheDocument();
  //   });

  //   it('calls onSave with updated property when form is submitted', async () => {
  //     const property = {
  //       id: '1',
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //       propertyName: 'Test Property',
  //       propertyType: 'Test Type'
  //     };
  //     const onSave = vi.fn();
  //     const { getByLabelText, getByRole } = render(
  //       <PropertiesDetail data={{ property, members: [] }} onSave={onSave} onDelete={vi.fn()} />
  //     );

  //     fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'Updated Property' } });
  //     fireEvent.change(getByPlaceholderText('Type'), { target: { value: 'Updated Type' } });

  //     fireEvent.click(getByRole('button', { name: /submit/i }));

  //     await waitFor(() => {
  //       expect(onSave).toHaveBeenCalledWith({
  //         id: '1',
  //         propertyName: 'Updated Property',
  //         propertyType: 'Updated Type'
  //       });
  //     });
  //   });
});
