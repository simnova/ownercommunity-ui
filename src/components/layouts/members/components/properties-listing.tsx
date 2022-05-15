import React from 'react';
import { Form, Input, InputNumber, Button, Descriptions } from 'antd';
import dayjs from 'dayjs';
import { PropertyUpdateInput } from '../../../../generated';

export interface PropertiesListingProps {
  data: {
    property: any
  };
  onSave: (property: PropertyUpdateInput) => void;
}

export const PropertiesListing: React.FC<PropertiesListingProps> = (props) => {
  const [form] = Form.useForm();
  const [formLoading,setFormLoading] = React.useState(false);
  return(
    <div>
      <Descriptions title="Property Info" size={'small'} layout={'vertical'}>
        <Descriptions.Item label="Id">{props.data.property.id}</Descriptions.Item>
        <Descriptions.Item label="Created At">{dayjs(props.data.property.createdAt).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Updated At">{dayjs(props.data.property.createdAt).format('DD/MM/YYYY')}</Descriptions.Item>

        <Descriptions.Item label="Name">{props.data.property.name}</Descriptions.Item>
        <Descriptions.Item label="Type">{props.data.property.type}</Descriptions.Item>
      </Descriptions>
      <Form
        layout="vertical"
        form={form}
        initialValues={props.data.property}
        onFinish={(values) => {
          setFormLoading(true);
          var property: PropertyUpdateInput = {
            id: props.data.property.id,
            ...values
          }
          props.onSave(property);
          setFormLoading(false);
        }}
        >
        <Form.Item
          name={['listingDetail','price']}
          label="Price"
        >
          <InputNumber placeholder='Price' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','rentHigh']}
          label="Rent - High"
        >
          <InputNumber placeholder='Rent High' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','rentLow']}
          label="Rent - Low"
        >
          <InputNumber placeholder='Rent Low' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','lease']}
          label="Lease"
        >
          <InputNumber placeholder='Lease' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','maxGuests']}
          label="Max Guests"
        >
          <InputNumber placeholder='Max Guests' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','bedrooms']}
          label="Bedrooms"
        >
          <InputNumber placeholder='Bedrooms' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','squareFeet']}
          label="Square Feet"
        >
          <InputNumber placeholder='Square Feet' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','description']}
          label="Description"
        >
          <Input placeholder='Description' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','floorPlan']}
          label="Floor Plan"
        >
          <Input placeholder='Floor Plan' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','listingAgent']}
          label="Listing Agent"
        >
          <Input placeholder='Listing Agent' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','listingAgentPhone']}
          label="Listing Agent Phone"
        >
          <Input placeholder='Listing Agent Phone' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','listingAgentEmail']}
          label="Listing Agent Email"
        >
          <Input placeholder='Listing Agent Email' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','listingAgentWebsite']}
          label="Listing Agent Website"
        >
          <Input placeholder='Listing Agent Website' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','listingAgentCompany']}
          label="Listing Agent Company"
        >
          <Input placeholder='Listing Agent Company' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','listingAgentCompanyPhone']}
          label="Listing Agent Company Phone"
        >
          <Input placeholder='Listing Agent Company Phone' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','listingAgentCompanyEmail']}
          label="Listing Agent Company Email"
        >
          <Input placeholder='Listing Agent Company Email' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','listingAgentCompanyWebsite']}
          label="Listing Agent Company Website"
        >
          <Input placeholder='Listing Agent Company Website' />
        </Form.Item>
        <Form.Item
          name={['listingDetail','listingAgentCompanyAddress']}
          label="Listing Agent Company Address"
        >
          <Input placeholder='Listing Agent Company Address' />
        </Form.Item>

        <Button type="primary" htmlType="submit" value={'save'} loading={formLoading}>
          Save
        </Button>
      </Form>
    </div>
  )
}