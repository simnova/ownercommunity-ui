import { gql, useQuery } from '@apollo/client';
import { useNode } from '@craftjs/core';
import { useParams } from 'react-router-dom';

const GET_PROPERTIES_BY_COMMUNITY = gql`
    query PropertiesByCommunity($communityId: ID!) {
        propertiesByCommunityId(communityId: $communityId) {
            propertyName
            propertyType
            location
            owner {
                name
            }
        }
    }
`;

let PropertiesListing: any;

PropertiesListing = () => {
    const { connectors: { connect, drag }, selected } = useNode((state) =>(
        {
        selected: state.events.selected
    }));

    const params = useParams();

    const { loading, error, data } = useQuery(GET_PROPERTIES_BY_COMMUNITY, {
        variables: { communityId: params.communityId },
    });

    const content = () => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error! ${error.message}</p>;
        return (
            <div 
                className="px-4 py-2"
                ref={ref => connect(drag(ref as HTMLDivElement))} 
            >
                {data && data.propertiesByCommunityId && data.propertiesByCommunityId.map((property: any) => (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <h2>{property.propertyName}</h2>
                    <p>{property.propertyType}</p>
                    <p>{property.location}</p>
                    <p>{property.owner.name}</p>
                </div>))}
            </div>
        )
    }

    return <>
        {content()}
    </>
}

PropertiesListing.craft = {}

export {
    PropertiesListing
}