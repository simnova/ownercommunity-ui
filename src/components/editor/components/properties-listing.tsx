import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useNode } from '@craftjs/core';
import { Typography, Card, Space } from 'antd';

const { Text, Title } = Typography;

const GET_PROPERTIES_BY_COMMUNITY = gql`
    query PropertiesByCommunity($communityId: ID!) {
        propertiesByCommunityId(communityId: $communityId) {
            propertyName
            propertyType
            owner {
                memberName
            }
            location {
                address {
                    streetNumber
                    streetName
                }
            }
            listedForSale
            listedForRent
            listedForLease
            listedInDirectory
        }
    }
`;

interface PropertiesListingProps {
    data: {
        communityId: string;
    }
}

let PropertiesListing: any;

PropertiesListing = (props: PropertiesListingProps) => {
    const { connectors: { connect, drag }, selected } = useNode((state) =>(
        {
        selected: state.events.selected
    }));

    const { loading, error, data } = useQuery(GET_PROPERTIES_BY_COMMUNITY, {
        variables: { 
            communityId: localStorage.getItem('community') ?? '' 
        },
    });

    const content = () => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error! ${error.message}</p>;
        return (
            <div 
                className="px-4 py-2"
                ref={ref => connect(drag(ref as HTMLDivElement))} 
            >
                <div className="bg-white shadow overflow-hidden sm:rounded" style={{display:'flex', justifyContent: 'space-around', }}>
                    {data && data.propertiesByCommunityId && data.propertiesByCommunityId.map((property: any) => (
                        <Card title={<Title level={4}>{property.propertyName}</Title>} size='small' style={{ margin: '15px 0'}} extra={<Link to='/:id'></Link>}>
                            <Space direction='vertical' size='small'>
                                {property.owner && <Text italic>Owner - {property.owner.memberName}</Text>}
                                {property.propertyType && <Text>Property Type - {property.propertyType}</Text>}
                            </Space>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return <>
        {content()}
    </>
}

const PropertiesListingSettings = () => {
    return <></>
}

PropertiesListing.craft = {
    related: {
        settings: PropertiesListingSettings
    }
}

export {
    PropertiesListing
}