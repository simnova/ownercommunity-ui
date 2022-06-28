import { Radio, Collapse } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { BathroomsFilterOptions, FilterNames, SearchParamKeys } from '../../../../constants';
import { FacetDetail, FilterDetail } from '../../../../generated';

const { Panel } = Collapse;
interface PropertiesListSearchFilterBathroomsProps {
  setSelectedFilter: (selectedFilter: FilterDetail) => void;
  selectedFilter?: FilterDetail;
  bathroomsFacets?: FacetDetail[];
}

export const PropertiesListSearchFilterBathrooms: FC<PropertiesListSearchFilterBathroomsProps> = (
  props
) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bathrooms, setBathrooms] = useState<undefined | number>();

  const onBathroomsClicked = (e: any) => {
    setBathrooms(parseFloat(e.target.value));
    if (e.target.value) {
      searchParams.set(SearchParamKeys.Bathrooms, e.target.value);
    } else {
      searchParams.delete(SearchParamKeys.Bathrooms);
    }
    setSearchParams(searchParams);
    props.setSelectedFilter({
      ...props.selectedFilter,
      listingDetail: {
        ...props.selectedFilter?.listingDetail,
        bathrooms: parseFloat(e.target.value)
      }
    });
  };

  useEffect(() => {
    const qsbathrooms = searchParams.get(SearchParamKeys.Bathrooms);
    if (qsbathrooms) {
      setBathrooms(parseFloat(qsbathrooms));
    }
  }, []);

  // handle when clear all filter clicked
  useEffect(() => {
    if (!location.search.includes(SearchParamKeys.Bathrooms)) {
      setBathrooms(undefined);
    }
  }, [location]);
  return (
    <Collapse className="search-filter-collapse">
      <Panel header={<h2 className="font-bold">Bathrooms</h2>} key={FilterNames.Bathrooms}>
        <Radio.Group
          value={bathrooms}
          onChange={onBathroomsClicked}
          buttonStyle="solid"
          optionType="button"
          options={props.bathroomsFacets?.map((option) => {
            let value = option.value?.slice(0, -1);
            return {
              label: `${option.value} ${
                option.count != undefined && option.count > 0 ? `(${option.count})` : ''
              }`,
              value: value ? parseFloat(value) : ''
            };
          })}
        />
      </Panel>
    </Collapse>
  );
};
