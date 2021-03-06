import { FC, useEffect, useState } from 'react';
import { FilterDetail, PropertySearchFacets } from '../../../../generated';
import {
  Space,
  AutoComplete,
  Button,
  Pagination,
  Modal,
  Select,
  Checkbox,
  Input,
  message
} from 'antd';
import { FilterOutlined, SaveOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PropertiesListSearchFilters } from './properties-list-search-filters';
import { SearchParamKeys, GetSearchParamsFromFilter } from '../../../../constants';
import { useSearchParams } from 'react-router-dom';

const { Option } = Select;

interface PropertiesListSearchToolbarProps {
  data: any;
  searchString: string;
  setSearchString: (searchString: string) => void;
  selectedFilter: FilterDetail | undefined;
  setSelectedFilter: (filter: FilterDetail | undefined) => void;
  handleSearch: (page: number, top: number) => void;
  onInputAddressChanged: (value: string) => void;
  onInputAddressSelected: (value: string) => void;
  top: number | undefined;
  setTop: (top: number) => void;
  addresses: AddressDataType[];
  currentPage: number | undefined;
  setCurrentPage: (page: number) => void;
  orderBy: string[];
  setOrderBy: (orderBy: string[]) => void;
  setHideNullResults: (hideNullResults: boolean) => void;
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
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [selectedFilterName, setSelectedFilterName] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [savedFilter, setSavedFilter] = useState('');

  const filters = JSON.parse(localStorage.getItem('filters') ?? '[]');

  useEffect(() => {
    props.handleSearch(props.currentPage ?? 0, props.top ?? 10);
  }, [searchParams]);

  useEffect(() => {
    const page = parseInt(searchParams.get(SearchParamKeys.Page) ?? '1') - 1;
    const top = parseInt(searchParams.get(SearchParamKeys.Top) ?? '10');
    props.handleSearch(page, top);
  }, [props.selectedFilter]);

  const onSelectTopChanged = (value: number) => {
    props.setTop(value);
    props.setCurrentPage(0);
    props.handleSearch(0, value);
  };

  const onSelectOrderByChanged = (value: string) => {
    props.setOrderBy([value]);
    if (value === '') searchParams.delete(SearchParamKeys.OrderBy);
    else searchParams.set(SearchParamKeys.OrderBy, value);
    setSearchParams(searchParams);
  };

  const onSelectFilterChanged = (value: string) => {
    if (value === '') clearFilter();
    else {
      const filter = filters.find((f: any) => f.name === value);
      setSavedFilter(value);
      searchParams.set(SearchParamKeys.SavedFilter, value);
      setSearchParams(searchParams);
      props.setSelectedFilter(filter.value);
      setSearchParams(GetSearchParamsFromFilter(filter.value, searchParams));
    }
  };

  const onHideNullResultsChanged = (e: any) => {
    props.setHideNullResults(e.target.checked);
    if (e.target.checked) searchParams.set(SearchParamKeys.HideNullResults, 'true');
    else searchParams.delete(SearchParamKeys.HideNullResults);
    setSearchParams(searchParams);
  };

  const saveFilter = () => {
    if (props.selectedFilter && selectedFilterName != '') {
      if (filters.find((f: any) => f.name === selectedFilterName)) {
        filters.splice(
          filters.findIndex((f: any) => f.name === selectedFilterName),
          1,
          { name: selectedFilterName, value: props.selectedFilter }
        );
        message.success(`Filter "${selectedFilterName}" updated`);
      } else {
        filters.push({
          name: selectedFilterName,
          value: props.selectedFilter
        });
        message.success(`Filter "${selectedFilterName}" saved`);
      }
      localStorage.setItem('filters', JSON.stringify(filters));
    }
    setIsSaveModalVisible(false);
  };

  const deleteSavedFilter = () => {
    if (savedFilter) {
      filters.splice(
        filters.findIndex((f: any) => f.name === savedFilter),
        1
      );
      localStorage.setItem('filters', JSON.stringify(filters));
      clearFilter();
      message.success(`Filter "${savedFilter}" deleted`);
    }
  };

  const handlePagination = (newPage: number) => {
    const current = newPage - 1;
    props.setCurrentPage(current);
    props.handleSearch(current, props.top ?? 10);
  };

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
    searchParams.delete(SearchParamKeys.Distance);
    searchParams.delete(SearchParamKeys.UpdatedAt);
    searchParams.delete(SearchParamKeys.CreatedAt);
    searchParams.delete(SearchParamKeys.SearchString);
    searchParams.delete(SearchParamKeys.Latitude);
    searchParams.delete(SearchParamKeys.Longitude);
    searchParams.delete(SearchParamKeys.SavedFilter);
    searchParams.delete(SearchParamKeys.Tags);
    props.setSearchString('');
    searchParams.set(SearchParamKeys.Page, '1');
    setSearchParams(searchParams);
    setSavedFilter('');
  };

  const searchButtonClicked = () => {
    props.setCurrentPage(0);
    props.handleSearch(0, props.top ?? 10);
  };

  return (
    <>
      <Space direction="vertical" size="large">
        <Space>
          <AutoComplete
            allowClear
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

          <Button type="primary" onClick={() => searchButtonClicked()}>
            Search
          </Button>

          <Pagination
            current={(props.currentPage ?? 0) + 1}
            total={props.data?.propertiesSearch?.count ?? 10}
            pageSize={props.top ?? 10}
            onChange={(page) => handlePagination(page)}
          />
          <span>Records per page:</span>
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
          <Button onClick={() => setIsModalVisible(true)} style={{ borderRadius: '10px' }}>
            <Space size="small">
              <FilterOutlined />
              <span>Filters</span>
            </Space>
          </Button>
          <Checkbox
            disabled={!searchParams.get(SearchParamKeys.OrderBy)}
            onChange={(e) => onHideNullResultsChanged(e)}
            defaultChecked={searchParams.get(SearchParamKeys.HideNullResults) ? true : false}
          >
            Hide Null Results
          </Checkbox>
        </Space>

        <Space>
          <span>Saved filters: </span>
          <Select
            value={searchParams.get(SearchParamKeys.SavedFilter) ?? savedFilter}
            onChange={(value) => onSelectFilterChanged(value)}
            style={{ width: '160px' }}
          >
            <Option value={''}>No filter</Option>
            {filters.map((filter: any) => {
              return <Option value={filter.name}>{filter.name}</Option>;
            })}
          </Select>

          <Button onClick={() => setIsSaveModalVisible(true)} style={{ borderRadius: '10px' }}>
            <Space size="small">
              <SaveOutlined />
              <span>Save Filter</span>
            </Space>
          </Button>
          <Modal
            title="Save Filter"
            visible={isSaveModalVisible}
            onOk={() => saveFilter()}
            onCancel={() => setIsSaveModalVisible(false)}
          >
            <Space size="middle">
              <Input
                placeholder="Filter Name"
                onChange={(e) => setSelectedFilterName(e.target.value)}
              />
            </Space>
          </Modal>
          {savedFilter !== '' && (
            <Button onClick={() => deleteSavedFilter()} danger style={{ borderRadius: '10px' }}>
              <Space size="small">
                <CloseCircleOutlined />
                <span>Delete Filter</span>
              </Space>
            </Button>
          )}
        </Space>

        <Space>
          <span>Sort by:</span>
          <Select
            defaultValue={searchParams.get(SearchParamKeys.OrderBy) ?? ''}
            onChange={(value) => {
              onSelectOrderByChanged(value);
            }}
            style={{ width: '160px' }}
          >
            <Option value={''}>None</Option>
            <Option value={'price desc'}>Price: High to Low</Option>
            <Option value={'price asc'}>Price: Low to High</Option>
            <Option value={'bedrooms desc'}>Bedrooms</Option>
            <Option value={'squareFeet desc'}>Square Feet</Option>
          </Select>
        </Space>

        <Modal
          title="Filters"
          visible={isModalVisible}
          width={1000}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
            <Button
              key="clear"
              type="link"
              onClick={() => {
                clearFilter();
              }}
            >
              Clear Filters
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
    </>
  );
};
