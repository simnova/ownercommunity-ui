import { Space, Typography } from 'antd';
import { Property } from '../../../../generated';

const { Title, Text } = Typography;

interface ListingTitleProps {
  property: Property;
}

export const ListingTitle: React.FC<ListingTitleProps> = (props) => {
  return (
    <>
      <div className="relative p-4 overflow-hidden bg-white shadow-lg rounded-xl md:w-96">
        <a href="#" className="block w-full h-full">
          <div className="flex items-center w-full">
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ marginBottom: '0px' }}>
                {props.property.propertyName}
              </Title>
              {props.property.owner?.memberName && (
                <p className="italic text-gray-400">Owned By: {props.property.owner.memberName}</p>
              )}
            </Space>

            {props.property?.location?.address?.streetNumber && props.property?.location?.address?.streetName && (
              <p className="text-lg font-semibold text-black sm:text-slate-900 md:text-xl dark:sm:text-black">
                {props.property?.location?.address?.streetNumber + ' ' + props.property?.location?.address?.streetName}
              </p>
            )}
          </div>
          <br />

          <Space className="font-medium text-black text-xl">
            {props.property?.listingDetail?.bedrooms && <h4>{props.property?.listingDetail?.bedrooms} Bds</h4>}
            {props.property?.listingDetail?.bathrooms && <h4>{props.property?.listingDetail?.bathrooms} Ba</h4>}
            {props.property?.listingDetail?.squareFeet && <h4>{props.property?.listingDetail?.squareFeet} Sqft</h4>}
          </Space>
        </a>
      </div>
    </>
  );
};
