import { useParams } from 'react-router-dom';
import { Property } from '../../../../generated';

interface ListingDetailsProps {
  property: Property;
}

export const ListingDetails: React.FC<ListingDetailsProps> = (props) => {
  const params = useParams();
  return (
    <div className="overflow-hidden rounded-lg shadow-lg cursor-pointer h-90 w-60 md:w-80">
      {props.property.listingDetail?.images?.[0] && (
        <img
          src={
            `https://ownercommunity.blob.core.windows.net/${params.communityId}/${props.property.listingDetail.images[0]}` ??
            ''
          }
          alt="house 1"
          className="w-full h-60 object-cover rounded-lg sm:h-52 sm:col-span-2 lg:col-span-full"
          loading="lazy"
        />
      )}
      <div className="w-full p-4 bg-white">
        {props.property.listedForSale && (
          <>
            <h2 className="text-lg font-semibold text-black sm:text-slate-900 md:text-xl dark:sm:text-black">
              Sales Details
            </h2>
            {props.property.listingDetail?.price ? (
              <p className="font-medium text-md">${props.property.listingDetail?.price}</p>
            ) : (
              <p className="font-medium text-md">N/A</p>
            )}
          </>
        )}
        {props.property.listedForRent && (
          <>
            <h2 className="text-lg font-semibold text-black sm:text-slate-900 md:text-xl dark:sm:text-black">
              Rent Details
            </h2>
            {props.property.listingDetail?.rentLow && props.property.listingDetail?.rentHigh ? (
              <p className="font-medium text-md">
                ${props.property.listingDetail?.rentLow} - ${props.property.listingDetail?.rentHigh}
              </p>
            ) : (
              <p className="font-medium text-md">N/A</p>
            )}
          </>
        )}
        {props.property.listedForLease && (
          <>
            <h2 className="text-lg font-semibold text-black sm:text-slate-900 md:text-xl dark:sm:text-black">
              Lease Details
            </h2>
            {props.property.listingDetail?.lease ? (
              <p className="font-medium text-md">${props.property.listingDetail?.lease} </p>
            ) : (
              <p className="font-medium text-md">N/A</p>
            )}
          </>
        )}
        <div className="mt-4 col-start-1 row-start-3 self-center sm:mt-0 sm:col-start-2 sm:row-start-2 sm:row-span-2 lg:mt-6 lg:col-start-1 lg:row-start-3 lg:row-end-4">
          {props.property.listedForSale && (
            <button
              type="button"
              className="bg-indigo-600 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg"
            >
              Contact Agent
            </button>
          )}
          {(props.property.listedForRent || props.property.listedForLease) && (
            <button
              type="button"
              className="bg-indigo-600 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg"
            >
              Check availability
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
