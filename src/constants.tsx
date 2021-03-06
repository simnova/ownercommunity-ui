import type { SliderMarks } from 'antd/lib/slider';
import dayjs from 'dayjs';
import { FacetDetail, FilterDetail } from './generated';

export const LocalSettingsKeys = {
  SidebarCollapsed: 'sidebar-collapsed',
  UserId: 'userId'
};

export const handleToggler = (isExpanded: boolean, callback: (isExpanded: boolean) => void) => {
  if (isExpanded) {
    callback(false);
    localStorage.setItem(LocalSettingsKeys.SidebarCollapsed, 'true');
    return;
  }
  callback(true);
  localStorage.removeItem(LocalSettingsKeys.SidebarCollapsed);
};

export const SearchParamKeys = {
  SearchString: 'search',
  ListedInfo: 'listedInfo',
  PropertyType: 'type',
  Amenities: 'amenities',
  AdditionalAmenities: 'additionalAmenities',
  MinPrice: 'minPrice',
  MaxPrice: 'maxPrice',
  Bedrooms: 'bedrooms',
  Bathrooms: 'bathrooms',
  MinSquareFeet: 'minSquareFeet',
  MaxSquareFeet: 'maxSquareFeet',
  Latitude: 'lat',
  Longitude: 'long',
  Page: 'page',
  Top: 'top',
  Distance: 'distance',
  OrderBy: 'orderBy',
  UpdatedAt: 'updatedAt',
  CreatedAt: 'createdAt',
  HideNullResults: 'hideNullResults',
  SavedFilter: 'savedFilter',
  Tags: 'tags',
};

export const FilterNames = {
  Type: 'type',
  Bedrooms: 'bedrooms',
  Bathrooms: 'bathrooms',
  Amenities: 'amenities',
  AdditionalAmenities: 'additionalAmenities',
  AdditionalAmenitiesCategory: 'additionalAmenities/category',
  AdditionalAmenitiesAmenities: 'additionalAmenities/amenities',
  SquareFeet: 'squareFeet',
  ListedForSale: 'listedForSale',
  ListedForRent: 'listedForRent',
  ListedForLease: 'listedForLease',
  ListedInfo: 'listedInfo',
  Distance: 'distance',
  UpdatedAt: 'updatedAt',
  CreatedAt: 'createdAt',
  Tags: 'tags'
};

export const AvailableFilters = Object.values(FilterNames);
export interface AdditionalAmenities {
  category: string;
  amenities: string[];
}

export const BedroomsFilterOptions = [
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
  { label: '5+', value: 5 }
];
export const BathroomsFilterOptions = [
  { label: '1+', value: 1 },
  { label: '1.5+', value: 1.5 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
  { label: '5+', value: 5 }
];

export const PropertyTypeOptions = [
  {
    label: 'Townhouse',
    value: 'Townhouse'
  },
  {
    label: 'Condo',
    value: 'Condo'
  },
  {
    label: 'Single Family',
    value: 'Single Family'
  },
  {
    label: 'Apartment',
    value: 'Apartment'
  },
  {
    label: 'Land',
    value: 'Land'
  },
  {
    label: 'Studio',
    value: 'Studio'
  },
  {
    label: 'Multi-Family',
    value: 'Multi-Family'
  },
  {
    label: 'Storefront',
    value: 'Storefront'
  }
];

export const PropertyTypeList = PropertyTypeOptions.map((property) => {
  return property.value;
});

export const Listed = [
  { label: 'For Sale', value: 'listedForSale' },
  { label: 'For Rent', value: 'listedForRent' },
  { label: 'For Lease', value: 'listedForLease' }
];

export const AdditionalAmenitiesValues: AdditionalAmenities[] = [
  {
    category: 'Features',
    amenities: ['Iron', 'WasherDryer']
  },
  {
    category: 'Location',
    amenities: ['Waterfront', 'Beachfront']
  }
];
export const DistanceOptions = [
  { label: '1 Km', value: 1 },
  { label: '5 Km', value: 5 },
  { label: '10 Km', value: 10 },
  { label: '20 Km', value: 20 },
  { label: '50 Km', value: 50 }
];

export const PriceMarkers: SliderMarks = {
  0: '0',
  100000: '100,000+',
  200000: '200,000+',
  300000: '300,000+',
  400000: '400,000+',
  500000: '500,000+',
  600000: '600,000+',
  700000: '700,000+',
  800000: '800,000+',
  900000: '900,000+',
  1000000: '1,000,000+'
};
export const MinSquareFeetOptions = [
  { label: 'No min', value: 0 },
  { label: '750', value: 750 },
  { label: '1,000', value: 1000 },
  { label: '1,100', value: 1100 },
  { label: '1,200', value: 1200 },
  { label: '1,300', value: 1300 },
  { label: '1,400', value: 1400 },
  { label: '1,500', value: 1500 },
  { label: '1,600', value: 1600 },
  { label: '1,700', value: 1700 },
  { label: '1,800', value: 1800 },
  { label: '1,900', value: 1900 },
  { label: '2,000', value: 2000 }
];

export const MaxSquareFeetOptions = [
  { label: 'No max', value: 100000 },
  { label: '750', value: 750 },
  { label: '1,000', value: 1000 },
  { label: '1,100', value: 1100 },
  { label: '1,200', value: 1200 },
  { label: '1,300', value: 1300 },
  { label: '1,400', value: 1400 },
  { label: '1,500', value: 1500 },
  { label: '1,600', value: 1600 },
  { label: '1,700', value: 1700 },
  { label: '1,800', value: 1800 },
  { label: '1,900', value: 1900 },
  { label: '2,000', value: 2000 }
];

export const additionalAmenitiesOptions: any = {
  Features: ['Iron', 'Washer/Dryer (Private)'],
  'Heating & Cooling': ['Central Air', 'Central Heat'],
  'Kitchen & Dining': ['Dishwasher', 'Microwave', 'Refrigerator'],
  Location: ['Oceanfront', 'Gated Community'],
  Media: ['Cable', 'Internet', 'TV'],
  'Onsite Activities': ['Pool (Private)', 'Gym', 'Basketball Court'],
  Outdoor: ['Balcony'],
  'Parking & Access': ['Garage']
  // '':[]
};

export const AdditionalAmenitiesCategories = Object.keys(additionalAmenitiesOptions);

export const SelectableRoomsOptions = [
  'Master Bedroom',
  'Guest Room 1',
  'Guest Room 2',
  'Guest Room 3',
  'Guest Room 4',
  'Living Room'
];

export const AmentitiesOptions = [
  'Cable',
  'Pool (Private)',
  'Pool (Public)',
  'Gym',
  'Washer/Dryer (Private)',
  'Washer/Dryer (Public)',
  'TV',
  'Wifi'
];

export const BedTypeOptions = ['Single', 'Double', 'Triple', 'Quad', 'Queen', 'King', 'Sofa Bed'];

export const DateOptions = [
  { label: '1 week ago', value: 7 },
  { label: '2 weeks ago', value: 14 },
  { label: '1 month ago', value: 30 },
  { label: '3 months ago', value: 90 }
];

export const MinSquareFeet = 0;
export const MaxSquareFeet = 100000;

export const MinPrice = 0;
export const MaxPrice = 1000000;

export const addressQuery = async (addressInput: string, mapSASToken: string) => {
  var addresssGeocodeServiceUrlTemplate: string =
    'https://atlas.microsoft.com/search/address/json?typeahead=true&api-version=1&query={query}';
  //var addresssGeocodeServiceUrlTemplate: string = 'https://atlas.microsoft.com/geocode?api-version=2022-02-01-preview&addressLine={query}&top=10';

  var requestUrl = addresssGeocodeServiceUrlTemplate.replace(
    '{query}',
    encodeURIComponent(addressInput)
  );
  const token = mapSASToken;
  console.log(token);

  const address = async () => {
    const request = await fetch(requestUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: 'jwt-sas ' + token,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

    const data = await request.json();
    console.log(data);
    return data.results;
  };

  return address();
};

export const GetFilterFromQueryString = (
  searchParams: URLSearchParams,
  selectedFilter: FilterDetail
): FilterDetail => {
  // get all search params
  const qsproperTypes = searchParams.get('type')?.split(',');
  const qsbedrooms = searchParams.get('bedrooms');
  const qsbathrooms = searchParams.get('bathrooms');
  const qsminPrice = searchParams.get('minPrice');
  const qsmaxPrice = searchParams.get('maxPrice');
  const qsminSquareFeet = searchParams.get('minSquareFeet');
  const qsmaxSquareFeet = searchParams.get('maxSquareFeet');
  const qsamenities = searchParams.get('amenities')?.split(',');
  const qsadditionalAmenities = searchParams.get('additionalAmenities')?.split(';');
  const qsdistance = searchParams.get('distance');
  const qsListedInfo = searchParams.get('listedInfo')?.split(',');
  const qslat = searchParams.get('lat');
  const qslong = searchParams.get('long');
  const qsupdatedAt = searchParams.get(SearchParamKeys.UpdatedAt); // in days
  const qscreatedAt = searchParams.get(SearchParamKeys.CreatedAt); // in days

  let filters = {} as FilterDetail;

  // proper type
  filters = {
    ...selectedFilter,
    propertyType: qsproperTypes
  };

  // bedrooms
  filters = {
    ...filters,
    listingDetail: {
      ...filters?.listingDetail,
      bedrooms: qsbedrooms ? parseInt(qsbedrooms) : undefined
    }
  };

  // bathrooms
  filters = {
    ...filters,
    listingDetail: {
      ...filters?.listingDetail,
      bathrooms: qsbathrooms ? parseFloat(qsbathrooms) : undefined
    }
  };

  // amenities
  filters = {
    ...filters,
    listingDetail: {
      ...filters?.listingDetail,
      amenities: qsamenities
    }
  };

  // price
  filters = {
    ...filters,
    listingDetail: {
      ...filters?.listingDetail,
      prices: qsminPrice && qsmaxPrice ? [parseInt(qsminPrice), parseInt(qsmaxPrice)] : undefined
    }
  };

  // square feet
  filters = {
    ...filters,
    listingDetail: {
      ...filters?.listingDetail,
      squareFeets:
        qsminSquareFeet && qsmaxSquareFeet
          ? [parseInt(qsminSquareFeet), parseInt(qsmaxSquareFeet)]
          : undefined
    }
  };

  // additional amenities
  let temp: AdditionalAmenities[] = [];
  qsadditionalAmenities?.forEach((amenity) => {
    const [cate, amen] = amenity.split(':');
    temp.push({
      category: cate,
      amenities: amen.split(',')
    });
  });
  filters = {
    ...filters,
    listingDetail: {
      ...filters?.listingDetail,
      additionalAmenities: temp
    }
  };

  // listed info
  filters = {
    ...filters,
    listedInfo: qsListedInfo
  };

  // distance
  filters = {
    ...filters,
    distance: qsdistance ? parseInt(qsdistance) : 0
  };

  // lat and long
  filters = {
    ...filters,
    position:
      qslat && qslong
        ? {
            latitude: parseFloat(qslat),
            longitude: parseFloat(qslong)
          }
        : undefined
  };

  // updated date
  filters = {
    ...filters,
    updatedAt: qsupdatedAt
  };

  // created date
  filters = {
    ...filters,
    createdAt: qscreatedAt
  };

  // tags
  const qstags = searchParams.get('tags')?.split(',');
  filters = {
    ...filters,
    tags: qstags
  };

  return filters;
};

export const GetSearchParamsFromFilter = (
  filter: FilterDetail | undefined,
  searchParams: URLSearchParams
) => {
  if (filter) {
    if (filter.propertyType)
      searchParams.set(SearchParamKeys.PropertyType, filter.propertyType.join(','));
    if (filter.listedInfo)
      searchParams.set(SearchParamKeys.ListedInfo, filter.listedInfo.join(','));
    if (filter.distance && filter.distance !== 0)
      searchParams.set(SearchParamKeys.Distance, filter.distance.toString());
    if (filter.position) {
      if (filter.position.latitude)
        searchParams.set(SearchParamKeys.Latitude, filter.position.latitude.toString());
      if (filter.position.longitude)
        searchParams.set(SearchParamKeys.Longitude, filter.position.longitude.toString());
    }
    if (filter.updatedAt) {
      searchParams.set(SearchParamKeys.UpdatedAt, dayjs().diff(filter.updatedAt, 'day').toString());
    }
    if (filter.createdAt) {
      searchParams.set(SearchParamKeys.CreatedAt, dayjs().diff(filter.createdAt, 'day').toString());
    }
    if (filter.listingDetail) {
      if (filter.listingDetail.bedrooms)
        searchParams.set(SearchParamKeys.Bedrooms, filter.listingDetail.bedrooms.toString());
      if (filter.listingDetail.bathrooms)
        searchParams.set(SearchParamKeys.Bathrooms, filter.listingDetail.bathrooms.toString());
      if (filter.listingDetail.amenities)
        searchParams.set(SearchParamKeys.Amenities, filter.listingDetail.amenities.join(','));
      if (filter.listingDetail.prices) {
        if (filter.listingDetail.prices[0])
          searchParams.set(SearchParamKeys.MinPrice, filter.listingDetail.prices[0].toString());
        if (filter.listingDetail.prices[1])
          searchParams.set(SearchParamKeys.MaxPrice, filter.listingDetail.prices[1].toString());
      }
      if (filter.listingDetail.squareFeets) {
        if (filter.listingDetail.squareFeets[0])
          searchParams.set(
            SearchParamKeys.MinSquareFeet,
            filter.listingDetail.squareFeets[0].toString()
          );
        if (filter.listingDetail.squareFeets[1])
          searchParams.set(
            SearchParamKeys.MaxSquareFeet,
            filter.listingDetail.squareFeets[1].toString()
          );
      }
      if (filter.listingDetail.additionalAmenities) {
        let additionalAmenities: string[] = [];
        filter.listingDetail.additionalAmenities.forEach((amenity: any) => {
          additionalAmenities.push(`${amenity?.category}:${amenity?.amenities?.join(',')}`);
        });
        searchParams.set(SearchParamKeys.AdditionalAmenities, additionalAmenities.join(';'));
      }
    }
  }

  return searchParams;
};

// export const GetFilterOptions = (allOptions: string[], facets?: FacetDetail[]) => {
//   const options: any = [];

//   allOptions.forEach((value: string) => {
//     const count = facets?.find((t: any) => t?.value === value)?.count;
//     if (count === undefined) {
//       return;
//     }
//     options.push({
//       label: `${value} ${
//         count !== undefined && count !== null && count > 0 ? `(${count})` : count === 0 ? '(0)' : ''
//       }`,
//       value: value
//     });
//   });
//   console.log(options);
//   return options;
// };
