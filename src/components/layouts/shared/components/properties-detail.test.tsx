import { render, waitFor } from '@testing-library/react';
import { PropertiesDetail } from './properties-detail';
import { render, fireEvent } from '@testing-library/react';

describe('PropertiesDetail', () => {
  it('renders without crashing', () => {
    render(<PropertiesDetail data={{ property: {}, members: [] }} onSave={vi.fn()} onDelete={vi.fn()} />);
  });
  it('calls onSave when save button is clicked', async () => {
    const property = {
      id: '93993945',
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
    console.log('mockOnSave', mockOnSave);
    fireEvent.submit(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled;
    });
  });

  describe('when viewing property information', () => {
    it('displays information titles', async () => {
      const property = {
        id: '93993945',
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
    it('displays correct property information', async () => {
      const property = {
        id: '93993945',
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
      expect(getByText('93993945')).toBeInTheDocument;
      expect(getByText('02/02/2004')).toBeInTheDocument;
      expect(getByText('02/02/2004')).toBeInTheDocument;
    });
  });
});
