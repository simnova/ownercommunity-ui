import { gql, useQuery } from '@apollo/client';
import { useNode } from '@craftjs/core';
import { useParams } from 'react-router-dom';

const GET_PROPERTIES_BY_COMMUNITY = gql`
    query PropertiesByCommunity($communityId: ID!) {
        propertiesByCommunityId(communityId: $communityId) {
            propertyName
            propertyType
            location {
                address {
                    streetNumber
                    streetName
                }
            }
            owner {
                memberName
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
                <div className="bg-white" style={{display:'flex', justifyContent: 'center' }}>
                    {data && data.propertiesByCommunityId && data.propertiesByCommunityId.map((property: any) => (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg" style={{ margin: '0% 2.5%'}}>
                        <h2>Name: {property.propertyName}</h2>
                        <p>Type: {property.propertyType}</p>
                        {property.location && <p>Location: {property.location.address.streetNumber} {property.location.address.streetName}</p>}
                        <p>Owner: {property.owner.memberName}</p>
                    </div>))}
                </div>
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