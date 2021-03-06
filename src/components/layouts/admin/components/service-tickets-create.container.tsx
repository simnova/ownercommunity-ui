import { useMutation, useQuery } from '@apollo/client';
import {
  AdminServiceTicketsCreateContainerMembersDocument,
  AdminServiceTicketsCreateContainerPropertiesDocument,
  AdminServiceTicketsCreateContainerServiceTicketCreateDocument,
  AdminServiceTicketsListContainerServiceTicketsOpenByCommunityDocument,
  ServiceTicketCreateInput
} from '../../../../generated';
import { message, Skeleton } from 'antd';
import { ServiceTicketsCreate } from './service-tickets-create';
import { useNavigate } from 'react-router-dom';

interface ServiceTicketsCreateContainerProps {
  data: {
    communityId: string;
  };
}

export const ServiceTicketsCreateContainer: React.FC<ServiceTicketsCreateContainerProps> = (
  props
) => {
  const navigate = useNavigate();
  const {
    data: memberData,
    loading: memberLoading,
    error: memberError
  } = useQuery(AdminServiceTicketsCreateContainerMembersDocument, {
    variables: { communityId: props.data.communityId }
  });
  const {
    data: propertyData,
    loading: propertyLoading,
    error: propertyError
  } = useQuery(AdminServiceTicketsCreateContainerPropertiesDocument, {
    variables: { communityId: props.data.communityId }
  });
  const [serviceTicketCreate] = useMutation(
    AdminServiceTicketsCreateContainerServiceTicketCreateDocument,
    {
      update(cache, { data }) {
        // update the list with the new item
        const newServiceTicket = data?.serviceTicketCreate.serviceTicket;
        const serviceTickets = cache.readQuery({
          query: AdminServiceTicketsListContainerServiceTicketsOpenByCommunityDocument,
          variables: { communityId: props.data.communityId }
        })?.serviceTicketsByCommunityId;
        if (newServiceTicket && serviceTickets) {
          cache.writeQuery({
            query: AdminServiceTicketsListContainerServiceTicketsOpenByCommunityDocument,
            variables: { communityId: props.data.communityId },
            data: {
              serviceTicketsByCommunityId: [...serviceTickets, newServiceTicket]
            }
          });
        }
      }
    }
  );

  const handleCreate = async (values: ServiceTicketCreateInput) => {
    try {
      var newServiceTicket = await serviceTicketCreate({
        variables: {
          input: values
        }
      });
      message.success('ServiceTicket Created');
      navigate(`../${newServiceTicket.data?.serviceTicketCreate.serviceTicket?.id}`, {
        replace: true
      });
    } catch (error) {
      message.error(`Error creating ServiceTicket: ${JSON.stringify(error)}`);
    }
  };

  if (memberLoading || propertyLoading) {
    return (
      <div>
        <Skeleton active />
      </div>
    );
  }
  if (memberError || propertyError) {
    return <div>{JSON.stringify(memberError || propertyError)}</div>;
  }
  if (memberData && propertyData) {
    const data = {
      members: memberData.membersByCommunityId,
      properties: propertyData.propertiesByCommunityId
    };

    return <ServiceTicketsCreate data={data as any} onSave={handleCreate} />;
  } else {
    return <div>No Data...</div>;
  }
};
