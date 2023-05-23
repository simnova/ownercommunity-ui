import { useQuery } from '@apollo/client';
import { SharedCommunitiesDropdownContainerCommunityDocument, Community } from '../../../../generated';
import { CommunitiesDropdown } from './communities-dropdown';
import { ComponentQueryLoader } from '../../molecules/component-query-loader';
import { Skeleton } from 'antd';

interface CommunitiesDropdownContainerProps {
  data: {
    id?: string;
  };
  isAdmin?: boolean;
}

export const CommunitiesDropdownContainer: React.FC<CommunitiesDropdownContainerProps> = (props) => {
  const {
    data: communityData,
    loading: communityLoading,
    error: communityError
  } = useQuery(SharedCommunitiesDropdownContainerCommunityDocument, {
    variables: { id: props.data.id ?? '' }
  });

  return (
    <ComponentQueryLoader
      loading={communityLoading}
      hasData={communityData}
      hasDataComponent={
        <CommunitiesDropdown
          data={{
            community: communityData?.communityById as Community,
            communities: communityData?.communities as Community[]
          }}
          isAdmin={props.isAdmin}
        />
      }
      error={communityError}
    />
  );
};
