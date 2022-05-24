import { useLocation } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useNode } from '@craftjs/core';
import { Typography, Card, Space, Badge, Skeleton } from 'antd';

const { Text, Title } = Typography;

const GET_PROPERTY_BY_ID = gql`
    query PropertyById($propertyId: ObjectID!) {
        property(id: $propertyId) {
            propertyName
            listingDetail {
              price
            }
        }
    }
`;

// rentHigh
// rentLow
// lease
// maxGuests
// bedrooms
// bedroomDetails
// bathrooms
// squareFeet
// description
// amenities
// additionalAmenities
// images
// video
// floorPlan
// floorPlanImages
// listingAgent
// listingAgentPhone
// listingAgentEmail
// listingAgentWebsite
// listingAgentCompany
// listingAgentCompanyPhone
// listingAgentCompanyEmail
// listingAgentCompanyWebsite
// listingAgentCompanyAddress

// interface PropertyDetailsProps {
//     path: string;
// }

let PropertyDetails: any;

PropertyDetails = () => {
    const { state } = useLocation();
    console.log("STATE ", state);

    const { connectors: { connect, drag }, selected } = useNode((state) =>(
        {
            selected: state.events.selected,
        }
    ));

    const { loading, error, data } = useQuery(GET_PROPERTY_BY_ID, {
        variables: { 
            propertyId: '625641f65f0e5d47213504f0'
        },
    });

    const content = () => {
        if (loading) return <Skeleton active/>;
        if (error) return <p>Error! ${error.message}</p>;
        if (data) return (
            <div 
                className="px-4 py-2"
                ref={ref => connect(drag(ref as HTMLDivElement))} 
            >
                <div className="bg-white shadow overflow-hidden sm:rounded" style={{display:'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
                    Property Details go here
                </div>
            </div>
        )
        return (
          <div>No data</div>
        )
    }

    return <>
        {content()}
    </>
}

const PropertyDetailsSettings = () => {
    return <></>
}

PropertyDetails.craft = {
    related: {
        settings: PropertyDetailsSettings
    },
    custom: {
        isDeletable: false,
    }
}

export {
    PropertyDetails
}