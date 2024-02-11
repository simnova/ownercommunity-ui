import { PropertiesDetail } from './properties-detail';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'vitest';

describe('PropertiesDetail', () => {
  it('renders without crashing', () => {
    render(<PropertiesDetail data={{ property: {}, members: [] }} onSave={vi.fn()} onDelete={vi.fn()} />);
  });
});

describe('Given a user loading component', () => {
  describe('When it renders', () => {
    it('Then I expect it displays information titles and correct information', () => {
      const property = {
        id: '87d32487922h38h9823h83hf',
        createdAt: '02/02/2004',
        updatedAt: '02/04/2004',
        propertyName: 'Test Property',
        propertyType: 'Test Type'
      };
      const { getByText, findByText } = render(<PropertiesDetail data={{ property, members: [] }} />);

      expect(getByText('Id')).toBeInTheDocument;
      expect(getByText('Created At')).toBeInTheDocument;
      expect(getByText('Updated At')).toBeInTheDocument;

      expect(getByText('Test Property')).toBeInTheDocument;
      expect(getByText('Test Type')).toBeInTheDocument;
      expect(getByText('87d32487922h38h9823h83hf')).toBeInTheDocument;

      expect(findByText('02/02/2004')).toBeInTheDocument;
      expect(findByText('02/04/2004')).toBeInTheDocument;
    });
  });
});

describe('Given user interaction', () => {
  describe('When there is interaction with form action buttons', () => {
    it('Then I expect it calls onSave when save button is clicked', async () => {
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

      fireEvent.submit(getByText('Save'));

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
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
        <PropertiesDetail
          data={{ property, members: [] }}
          onSave={vi.fn()}
          onDelete={mockDeleteProperty}
          isAdmin={true}
        />
      );

      fireEvent.click(getByText(/delete property/i));

      await waitFor(() => {
        expect(mockDeleteProperty).toHaveBeenCalled();
      });
    });

    describe('When there is changes to the form data', () => {
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
        fireEvent.click(getByText('Save'));

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
        fireEvent.submit(getByText('Save'));

        expect(await findByText(/Property Name is required/i)).toBeInTheDocument();
      });
    });
  });
});
