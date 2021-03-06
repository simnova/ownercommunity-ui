import { Collapse, Radio } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { FilterNames, SearchParamKeys, DateOptions } from '../../../../constants';
import { FilterDetail, FacetDetail } from '../../../../generated';
const { Panel } = Collapse;

interface PropertiesListSearchFilterUpdatedDateProps {
  selectedFilter?: FilterDetail;
  setSelectedFilter: (selectedFilter: FilterDetail) => void;
  updatedDateFacet?: FacetDetail[];
}

export const PropertiesListSearchFilterUpdatedDate: React.FC<PropertiesListSearchFilterUpdatedDateProps> =
  (props) => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedDateOption, setSelectedDateOption] = useState<number | undefined>();

    const onUpdatedDateChanged = (e: any) => {
      const value = e.target.value;
      const date = dayjs().subtract(value, 'day').toISOString();
      setSelectedDateOption(value);
      // update query string
      searchParams.set(SearchParamKeys.UpdatedAt, value);
      setSearchParams(searchParams);
      props.setSelectedFilter({
        ...props.selectedFilter,
        updatedAt: date
      });
    };

    // Update UI (selected property types) with corresponding property types when page is loaded
    useEffect(() => {
      const qsUpdatedDate = searchParams.get(SearchParamKeys.UpdatedAt);
      if (qsUpdatedDate) {
        setSelectedDateOption(parseInt(qsUpdatedDate));
      } else {
        setSelectedDateOption(undefined);
      }
    }, [searchParams]);

    // handle when clear all filter clicked
    useEffect(() => {
      if (!location.search.includes(SearchParamKeys.UpdatedAt)) {
        setSelectedDateOption(undefined);
      }
    }, [location]);

    const getOptions = () => {
      const options: any = [];

      DateOptions.forEach((option: { label: string; value: number }) => {
        const count = props.updatedDateFacet?.find((t: any) => t?.value === option.label)?.count;
        if (!count) {
          return;
        }
        options.push({
          label: option.label + ' ' + `(${count})`,
          value: option.value
        });
      });
      return options;
    };

    if (getOptions().length === 0) {
      return null;
    }

    return (
      <>
        <Collapse
          className="search-filter-collapse"
          defaultActiveKey={
            searchParams.get(FilterNames.UpdatedAt) ? FilterNames.UpdatedAt : undefined
          }
        >
          <Panel header={<h2 className="font-bold">Updated Date</h2>} key={FilterNames.UpdatedAt}>
            <Radio.Group
              value={selectedDateOption}
              options={getOptions()}
              onChange={(e: any) => onUpdatedDateChanged(e)}
            />
          </Panel>
        </Collapse>
      </>
    );
  };
