import { FC, useState } from 'react';
import { FilterDetail, PropertySearchFacets } from '../../../../generated';
import { Space, AutoComplete, Button, Pagination, Modal, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { PropertiesListSearchFilters } from './properties-list-search-filters';
import { SearchParamKeys } from '../../../../constants';
import { useSearchParams } from 'react-router-dom';

const { Option } = Select;

interface PropertiesListSearchToolbarProps {
  data: any;
  searchString: string;
  selectedFilter: FilterDetail | undefined;
  setSelectedFilter: (filter: FilterDetail | undefined) => void;
  handleSearch: (page?: number, top?: number) => void;
  onInputAddressChanged: (value: string) => void;
  onInputAddressSelected: (value: string) => void;
  handlePagination: (page: number) => void;
  top: number | undefined;
  setTop: (top: number) => void;
  addresses: AddressDataType[];
  currentPage: number | undefined;
  setCurrentPage: (page: number) => void;
  orderBy: string[];
  setOrderBy: (orderBy: string[]) => void;
}

interface AddressDataType {
  value: string;
  label: string;
  key: string;
  address: any;
  lat: number;
  long: number;
}

export const PropertiesListSearchToolbar: FC<PropertiesListSearchToolbarProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const onSelectTopChanged = (value: number) => {
    props.setTop(value);
    props.setCurrentPage(0);
    props.handleSearch(0, value);
  };

  const onSelectOrderByChanged = (value: string) => {
    props.setOrderBy([value]);
    props.handleSearch();
  }

  const clearFilter = () => {
    props.setSelectedFilter(undefined);
    searchParams.delete(SearchParamKeys.AdditionalAmenities);
    searchParams.delete(SearchParamKeys.Amenities);
    searchParams.delete(SearchParamKeys.Bathrooms);
    searchParams.delete(SearchParamKeys.Bedrooms);
    searchParams.delete(SearchParamKeys.ListedInfo);
    searchParams.delete(SearchParamKeys.MaxPrice);
    searchParams.delete(SearchParamKeys.MinPrice);
    searchParams.delete(SearchParamKeys.PropertyType);
    searchParams.delete(SearchParamKeys.MaxSquareFeet);
    searchParams.delete(SearchParamKeys.MinSquareFeet);
    searchParams.set(SearchParamKeys.Page, '1');
    setSearchParams(searchParams);
  };

  return (
    <Space size="large">
      <Space size={0}>
        <AutoComplete
          options={props.addresses}
          style={{
            width: '400px'
          }}
          placeholder="Enter an address or a property name"
          filterOption={false}
          value={props.searchString}
          onChange={(value: string) => props.onInputAddressChanged(value)}
          onSelect={(value: string) => props.onInputAddressSelected(value)}
        ></AutoComplete>

        <Button type="primary" onClick={() => props.handleSearch(0)}>
          Search
        </Button>
      </Space>
      <Pagination
        current={(props.currentPage ?? 0) + 1}
        total={props.data?.propertiesSearch?.count ?? 10}
        pageSize={props.top ?? 10}
        onChange={(page) => props.handlePagination(page)}
      />
      <Select
        defaultValue={parseInt(searchParams.get(SearchParamKeys.Top) ?? '10')}
        onChange={(value) => onSelectTopChanged(value)}
      >
        <Option value={5}>5</Option>
        <Option value={10}>10</Option>
        <Option value={15}>15</Option>
        <Option value={25}>25</Option>
        <Option value={50}>50</Option>
      </Select>

      <Button
        type="ghost"
        onClick={() => setIsModalVisible(true)}
        style={{ borderRadius: '10px' }}
      >
        <Space size="middle">
          <FilterOutlined />
          <span>Filters</span>
        </Space>
      </Button>

      <Select
        defaultValue={''}
        onChange={(value) => {onSelectOrderByChanged(value)}}
        style={{ width: '160px' }}
      >
        <Option value={''}>None</Option>
        <Option value={'price desc'}>Price: High to Low</Option>
        <Option value={'price asc'}>Price: Low to High</Option>
        <Option value={'bedrooms desc'}>Bedrooms</Option>
        <Option value={'squareFeet desc'}>Square Feet</Option>
      </Select>
      <Modal
        title="Filters"
        visible={isModalVisible}
        width={1000}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="clear"
            type="link"
            onClick={() => {
              clearFilter();
            }}
          >
            Clear Filters
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              props.handleSearch(0);
              searchParams.set('page', '1');
              setSearchParams(searchParams);
              props.setCurrentPage(0);
              setIsModalVisible(false);
            }}
          >
            Apply
          </Button>
        ]}
      >
        <PropertiesListSearchFilters
          facets={props.data?.propertiesSearch?.facets as PropertySearchFacets}
          setSelectedFilter={props.setSelectedFilter}
          selectedFilter={props.selectedFilter}
          setTop={props.setTop}
        />
      </Modal>
    </Space>
  );
};
