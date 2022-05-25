import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useNode } from '@craftjs/core';
import { MemberPropertyByPropertyIdDocument } from '../../../generated';
import { Typography, Card, Space, Badge, Skeleton } from 'antd';
import { CommunityPropertyDetail } from '../../layouts/members/components/community-property-detail';

let PropertyDetails: any;

PropertyDetails = () => {
    const params = useParams();
    const propertyId = params['*']?.slice(params['*'].lastIndexOf('/') + 1);

    const { connectors: { connect, drag }, selected } = useNode((state) =>(
        {
            selected: state.events.selected,
        }
    ));

    const {loading: propertyLoading, error: propertyError, data: propertyData } = useQuery(MemberPropertyByPropertyIdDocument, 
        {
            variables: { propertyId: propertyId}
        }
    );

    if (propertyId === 'page-editor') {
        return (
            <div 
                className="px-4 py-2"
                ref={ref => connect(drag(ref as HTMLDivElement))} 
            >
                <div className="bg-white shadow overflow-hidden sm:rounded" style={{padding: '5%', display: 'flex', justifyContent: 'center'}}>
                    <CommunityPropertyDetail data={mockPropertyData} space="horizontal"/>
                </div>
            </div>
        )
    }
    

    const content = () => {
        if (propertyLoading) return <Skeleton active/>;
        if (propertyError) return <p>Error! ${propertyError.message}</p>;
        if (propertyData) return (
            <div 
                className="px-4 py-2"
                ref={ref => connect(drag(ref as HTMLDivElement))} 
            >
                <div className="bg-white shadow overflow-hidden sm:rounded" style={{padding: '5%', display: 'flex', justifyContent: 'center'}}>
                    <CommunityPropertyDetail data={propertyData} space="horizontal"/>
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

const mockPropertyData = {
        property: {
        listedForLease: true,
        listedForRent: false,
        listedForSale: false,
        owner: {
        memberName: 'John Johnson',
        },
        propertyName: 'My Apartment',
        propertyType: 'Apartment',
        location: {
        address: {
            streetName: 'Mockingbird Ln',
            streetNumber: '1313',
        }
        },
        listingDetail: {
        additionalAmenities: {
            amenities: ['Wifi', 'Laundry', 'Pets Allowed'],
        },
        amenities: ['Gym', 'A/C'],
        bathrooms: 1.5,
        bedroomDetails: {
            bedDescriptions: ['Queen', 'King'],
        },
        bedrooms: 2,
        description: 'A very nice apartment',
        lease: 12,
        listingAgent: 'Ryan Smith',
        listingAgentCompany: 'ABC Real Estate',
        listingAgentCompanyAddress: '123 Main St',
        listingAgentCompanyEmail: 'abc@abcrealestate.com',
        listingAgentCompanyPhone: '123-456-7890',
        listingAgentCompanyWebsite: 'www.abcrealestate.com',
        listingAgentEmail: 'ryan.smith@gmail.com',
        listingAgentPhone: '702-555-5555',
        maxGuests: 20,
        price: 200000,
        rentHigh: 2000,
        rentLow: 1250,
        squareFeet: 1200,
        }
    }
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