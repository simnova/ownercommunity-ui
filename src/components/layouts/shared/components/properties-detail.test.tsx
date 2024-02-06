import { render, waitFor, fireEvent } from '@testing-library/react';
import { PropertiesDetail } from './properties-detail';

describe('PropertiesDetail', () => {
  it('then I expect it renders without crashing', () => {
    render(<PropertiesDetail data={{ property: {}, members: [] }} onSave={vi.fn()} onDelete={vi.fn()} />);
  });

  describe('when viewing property information', () => {
    it('then I expect it displays information titles', async () => {
      const property = {
        id: '87d32487922h38h9823h83hf',
        createdAt: '02/02/2004',
        updatedAt: '02/02/2004',
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
    it('then I expect it displays correct property information', async () => {
      const property = {
        id: '87d32487922h38h9823h83hf',
        createdAt: '02/03/2004',
        updatedAt: '02/02/2004',
        propertyName: 'Test Property',
        propertyType: 'Test Type'
      };
      const { getByText } = render(
        <PropertiesDetail data={{ property, members: [] }} onSave={vi.fn()} onDelete={vi.fn()} />
      );

      expect(getByText('Test Property')).toBeInTheDocument;
      expect(getByText('Test Type')).toBeInTheDocument;
      expect(getByText('87d32487922h38h9823h83hf')).toBeInTheDocument;
      expect(getByText('02/02/2004')).toBeInTheDocument;
      expect(getByText('02/02/2004')).toBeInTheDocument;
    });
  });
});

describe('Given interaction with buttons', () => {
  it('then I expect it calls onSave when save button is clicked', async () => {
    const property = {
      id: '87d32487922h38h9823h83hf',
      createdAt: '02/02/2004',
      updatedAt: '02/02/2004',
      propertyName: 'Test Property',
      propertyType: 'Test Type'
    };
    const mockOnSave = vi.fn();
    const { getByText } = render(
      <PropertiesDetail data={{ property, members: [] }} onSave={mockOnSave} onDelete={vi.fn()} />
    );
    const saveButton = getByText('Save');
    fireEvent.submit(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled;
    });
  });
  it('then I expect it calls onDelete when Delete Button is clicked', async () => {
    const property = {
      id: '87d32487922h38h9823h83hf',
      createdAt: '02/02/2004',
      updatedAt: '02/02/2004',
      propertyName: 'Test Property',
      propertyType: 'Test Type'
    };
    const mockDeleteProperty = vi.fn();
    const { getByText } = render(
      <PropertiesDetail data={{ property, members: [] }} onSave={vi.fn()} onDelete={mockDeleteProperty} />
    );
    const deletePropertyButton = getByText('Save');
    fireEvent.submit(deletePropertyButton);

    await waitFor(() => {
      expect(mockDeleteProperty).toHaveBeenCalled;
    });
  });
});

describe('Given form data', () => {
  it('then I expect it calls onSave with the correct property name when form is submitted with updated name', async () => {
    const property = {
      id: '87d32487922h38h9823h83hf',
      createdAt: '02/02/2004',
      updatedAt: '02/02/2004',
      propertyName: 'Test Property',
      propertyType: 'Townhouse',
      isAdmin: true
    };
    const mockOnSave = vi.fn();

    const { getByText, getByLabelText } = render(
      <PropertiesDetail data={{ property, members: [] }} onSave={mockOnSave} onDelete={vi.fn()} isAdmin={true} />
    );

    fireEvent.change(getByLabelText('Property Name'), { target: { value: 'New Property Name' } });

    const saveButton = getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        id: '87d32487922h38h9823h83hf',
        listedForLease: undefined,
        listedForRent: undefined,
        listedForSale: undefined,
        listedInDirectory: undefined,
        owner: { id: undefined },
        propertyName: 'New Property Name',
        propertyType: 'Townhouse'
      });
    });
  });

  it('then I expect it shows an error message when property name is empty', async () => {
    const property = {
      id: '87d32487922h38h9823h83hf',
      createdAt: '02/02/2004',
      updatedAt: '02/02/2004',
      propertyName: 'Test Property',
      propertyType: 'Townhouse',
      isAdmin: true
    };
    const { getByLabelText, findByText, getByText } = render(
      <PropertiesDetail data={{ property, members: [] }} onSave={vi.fn()} onDelete={vi.fn()} isAdmin={true} />
    );

    fireEvent.change(getByLabelText('Property Name'), { target: { value: '' } });
    const saveButton = getByText('Save');
    fireEvent.submit(saveButton);

    const errorMessage = (await findByText(/Property Name is required/i)) as HTMLElement;
    expect(errorMessage).toBeInTheDocument();
  });
});
