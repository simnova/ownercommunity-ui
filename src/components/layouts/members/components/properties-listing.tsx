import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Descriptions, Typography, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import dayjs from 'dayjs';
import { PropertyUpdateInput, MembersPropertiesListingContainerPropertyFieldsFragment } from '../../../../generated';
import { FormTags } from '../../../ui/organisms/form-tags';
import { PropertiesListingImageUploadContainer } from './properties-listing-image-upload-container';
import { PropertiesFloorPlanUploadContainer } from './properties-floor-plan-upload-container';
import { SelectTags } from './select-tags';
import { SelectableRoomsOptions, AdditionalAmenitiesCategories, BedTypeOptions, AmentitiesOptions, additionalAmenitiesOptions } from '../../../../constants';


const { Title } = Typography;

export interface PropertiesListingProps {
  data: {
    property: MembersPropertiesListingContainerPropertyFieldsFragment
    communityId: string
  };
  onSave: (property: PropertyUpdateInput) => void;
}

export const PropertiesListing: React.FC<PropertiesListingProps> = (props) => {
  const [form] = Form.useForm();
  const [formLoading,setFormLoading] = React.useState(false);

  const [additionalAmenities, setAdditionalAmenities] = React.useState<any[]>([]);
  const [bedroomDetails, setBedroomDetails] = React.useState<any[]>([]);

  const [selectableCategories, setSelectableCategories] = React.useState<string[]>(AdditionalAmenitiesCategories);

  const [selectableRooms, setSelectableRooms] = React.useState<string[]>(SelectableRoomsOptions);

  useEffect(() => {
    const propertyBedroomDetails = props.data.property.listingDetail?.bedroomDetails;
    const additionalAmenitiesDetails = props.data.property.listingDetail?.additionalAmenities;
    setBedroomDetails(propertyBedroomDetails ?? []);
    setAdditionalAmenities(additionalAmenitiesDetails ?? []);

    const selectedBedrooms: string[] = [];
    propertyBedroomDetails?.forEach((bedroom: any )=> {
      if (bedroom.roomName) {
        selectedBedrooms.push(bedroom.roomName);
      }
    });

    const selectedCategories: string[] = [];
    additionalAmenitiesDetails?.forEach((amenity: any )=> {
      if (amenity.category) {
        selectedCategories.push(amenity.category);
      }
    })

    const remainingBeds = SelectableRoomsOptions.filter((room: any) => !selectedBedrooms.includes(room));
    const remainingCategories = selectableCategories.filter((category: any) => !selectedCategories.includes(category));

    setSelectableRooms(remainingBeds);
    setSelectableCategories(remainingCategories);
  }, []);


  const onBedroomChange = (value: string, index: number) => {
    let newBedroomDetails = JSON.parse(JSON.stringify(bedroomDetails));
    newBedroomDetails[index].roomName = value;

    const selectedBedrooms: string[] = [];
    newBedroomDetails.forEach((bedroom: any )=> {
      if (bedroom.roomName) {
        selectedBedrooms.push(bedroom.roomName);
      }
    });

    const remainingBeds = SelectableRoomsOptions.filter((room: any) => !selectedBedrooms.includes(room));
    setSelectableRooms(remainingBeds);
    setBedroomDetails(newBedroomDetails);
    form.setFields([{name: ['listingDetail', 'bedroomDetails', index ,'bedDescriptions'], value: []}])
  }

  const onSelectChanged = (value: string, index: number) => {

    let newAdditionalAmenities = JSON.parse(JSON.stringify(additionalAmenities));
    newAdditionalAmenities[index].category = value;
    newAdditionalAmenities[index].amentities = [];

    // get all selected categories
    const selectedCategories : string[] = [];
    newAdditionalAmenities.forEach((amenity: any) => {
      if (amenity.category) {
        selectedCategories.push(amenity.category);
      }
    })

    const remainingCategories =  AdditionalAmenitiesCategories.filter((category: any) => !selectedCategories.includes(category))
    setSelectableCategories(remainingCategories);
    setAdditionalAmenities(newAdditionalAmenities);
    form.setFields([{name: ['listingDetail', 'additionalAmenities', index ,'amenities'], value: []}])
  }

  return(
    <div>
      <Descriptions title="Property Info" size={'small'} layout={'vertical'}>
        <Descriptions.Item label="Id">{props.data.property.id}</Descriptions.Item>
        <Descriptions.Item label="Created At">{dayjs(props.data.property.createdAt).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Updated At">{dayjs(props.data.property.updatedAt).format('DD/MM/YYYY')}</Descriptions.Item>

        <Descriptions.Item label="Name">{props.data.property.propertyName}</Descriptions.Item>
        <Descriptions.Item label="Type">{props.data.property.propertyType}</Descriptions.Item>
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
          <InputNumber placeholder='Bedrooms'/>
        </Form.Item>
        
        <Title level={4}>Bedroom Details</Title>
        <Form.List name={['listingDetail','bedroomDetails']}>
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <div key={field.key} style={{marginBottom:'15px'}}>
                    <div style={{display:'inline-block',verticalAlign:'top', paddingRight:'10px',}}>
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    </div>
                    <div style={{display:'inline-block',paddingTop:'3px',paddingLeft:'10px', borderLeft:'1px solid darkgrey'}}>
                      <Form.Item
                          name={[index, 'id']}
                          hidden={true}
                        >
                        <Input hidden={true} />
                      </Form.Item>
                      <Form.Item
                        name={[index, 'roomName']}
                        label="Room Name"
                      >
                        <Select 
                          placeholder="Room"
                          onChange={(values) => {onBedroomChange(values, index)}}
                        >
                          {selectableRooms?.map((room: any) => (
                            <Select.Option key={room} value={room}>{room}</Select.Option>
                          ))}

                        </Select>
                        {/* <Input placeholder='Room Name' /> */}
                      </Form.Item>
                      <Form.Item 
                        name={[index,'bedDescriptions']}
                        label="Types of Beds"
                      >
                        {/* <FormTags /> */}
                        <SelectTags 
                          options={BedTypeOptions} 
                          label="Types of Beds"
                        />
                      </Form.Item>
                    </div>
                  </div>  
                ))}
                <Form.Item>
                  {fields.length < (props.data.property.listingDetail?.bedrooms ? props.data.property.listingDetail?.bedrooms : 0) ? 
                  <Button
                    type="dashed"
                    onClick={() => {
                      setBedroomDetails([...bedroomDetails, { roomName: ''}])
                      add();
                    }}
                    block
                  >
                    <PlusOutlined /> Add Additional Bed
                  </Button>
                  : <></>}
                </Form.Item>
              </div>
            );
          }}
        </Form.List>

        <Form.Item
          name={['listingDetail','bathrooms']}
          label="Bathrooms"
        >
          <InputNumber placeholder='Bathrooms' />
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
          name={['listingDetail', 'amenities']}
          label="Amenities"
        >
          {/* <FormTags /> */}
          
          <SelectTags 
            options={AmentitiesOptions} 
            label='Amenities'/>

        </Form.Item>

        <Title level={4}>Additional Amenities</Title>
        <Form.List name={['listingDetail','additionalAmenities']}>
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => { 
                  console.log();
                  return (
                  <div key={field.key} style={{marginBottom:'15px'}}>
                    <div style={{display:'inline-block',verticalAlign:'top', paddingRight:'10px',}}>
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    </div>
                    <div style={{display:'inline-block',paddingTop:'3px',paddingLeft:'10px', borderLeft:'1px solid darkgrey'}}>
                      <Form.Item
                          name={[index, 'id']}
                          hidden={true}
                        >
                        <Input hidden={true} />
                      </Form.Item>
                      <Form.Item
                        name={[index, 'category']}
                        label="Category"
                      >
                        <Select
                          placeholder='Category'
                          onChange={(values) => {onSelectChanged(values, index)}}
                        >
                          {selectableCategories?.map((item: any) => (
                            <Select.Option key={item} value={item}>
                              {item}
                            </Select.Option>
                          ))}
                        </Select>

                        {/* <Input placeholder='Category' /> */}
                      </Form.Item>
                      <Form.Item 
                        name={[index,'amenities']}
                        label="Amenities"
                      >
                        <SelectTags 
                          // options={additionalAmenitiesOptions[form.getFieldsValue().listingDetail.additionalAmenities[index]?.category ?? '' ]}
                          options={additionalAmenitiesOptions[form.getFieldValue(['listingDetail','additionalAmenities',index,'category'])]}
                          //value={form.getFieldValue(['listingDetail','additionalAmenities',index,'amenities'])}
                        />

                        {/* <FormTags /> */}
                      </Form.Item>
                    </div>
                  </div>  
                ) } )} 
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      setAdditionalAmenities([...additionalAmenities, {category: '', amenities: []} ]);
                      add();
                    }}
                    block
                  >
                    <PlusOutlined /> Add Additional Amenity
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>

        <Form.Item
          name={['listingDetail','images']}
          label="Images"
        >
          <PropertiesListingImageUploadContainer propertyId={props.data.property.id} communityId={props.data.communityId} />
        </Form.Item>

        <Form.Item
          name={['listingDetail','floorPlan']}
          label="Floor Plan"
        >
          <Input placeholder='Floor Plan' />
        </Form.Item>

        <Form.Item
          name={['listingDetail','floorPlanImages']}
          label="Floor Plan Images"
        >
          <PropertiesFloorPlanUploadContainer propertyId={props.data.property.id} communityId={props.data.communityId} />
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