import { useParams, Link, useNavigate } from 'react-router-dom';

export const ListingCard: React.FC<any> = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  // const imageGallery = props.images.map((image: any) => {
  //     return image;
  // })
  // console.log(props.data);

  return (
    <div
      onClick={() => navigate(`../../listings/${props.data.id}`)}
      style={{ cursor: 'pointer', width: '100%', height: '100%' }}
    >
      <div
        className="max-w-xs grid grid-cols-1 pr-0"
        style={{ border: '1px solid gray', borderRadius: '9px' }}
      >
        <div className="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0">
          <h1 className="m-0 text-sm font-semibold text-white dark:sm:text-white">
            {props.data.name}
          </h1>
          <h2 className="m-0 text-lg font-semibold text-white dark:sm:text-white">
            ${props.data.price}
          </h2>
          {/* <p className="text-sm leading-4 font-medium text-white dark:sm:text-slate-400">Entire house</p> */}
        </div>
        <div className="grid gap-4 col-start-1 col-end-3 row-start-1">
          <img
            src={
              'https://ownercommunity.blob.core.windows.net/' +
              props.data.communityId +
              '/' +
              props.data.images[0]
            }
            className="w-full h-60 object-cover rounded-lg col-span-2 h-52"
            alt="Property Image"
            // style={{width: "400px"}}
          />
        </div>

        <div className="px-2" style={{ height: '150px' }}>
          <p className="mt-4 mb-0 text-sm leading-6 col-start-1 dark:text-slate-400">
            {props.data.bedrooms ? props.data.bedrooms : '-'} Bds,{' '}
            {props.data.bathrooms ? props.data.bathrooms : '-'} Ba,{' '}
            {props.data.squareFeet ? props.data.squareFeet : '-'} sqft
          </p>
          <p className="mb-0 text-sm leading-6 col-start-1 dark:text-slate-400">
            <em> {props.data.address.freeformAddress}</em>
          </p>
          <p className="text-xs leading-6 col-start-1 dark:text-slate-400">
            <em>
              {' '}
              A {props.data.type} in {props.data.address.localName}
            </em>
          </p>
          <p className="mt-4 text-xs leading-6 col-start-1 dark:text-slate-400">
            {props.data.listingAgentCompany}
          </p>
        </div>
      </div>
    </div>
  );
};
