import React, { useState } from 'react';
import { AutoComplete, Form, Input, Typography, Button } from 'antd';
import { PropertyUpdateInput } from '../../../../generated';

const { Paragraph } = Typography;

interface AddressDataType {
  'value': string,
  'label': string,
  'key': string,
  'address': any,
  'lat': number,
  'long': number
}

export const PropertiesLocation = (props: any) => {
  const [value, setValue] = useState('');
  const [addresses, setAddresses] = useState<AddressDataType[]>([]);
  const [currentAddress, setCurrentAddress] = useState<any>('');
  const [currentPoint, setCurrentPoint] = useState<number[]>([0,0]);
  const [form] = Form.useForm();
  const [formLoading,setFormLoading] = React.useState(false);
  console.log(props);

  const addressQuery = async (addressRequest: string) => {
    var addresssGeocodeServiceUrlTemplate: string = 'https://atlas.microsoft.com/search/address/json?typeahead=true&api-version=1&query={query}';
    //var addresssGeocodeServiceUrlTemplate: string = 'https://atlas.microsoft.com/geocode?api-version=2022-02-01-preview&addressLine={query}&top=10';

    var requestUrl = addresssGeocodeServiceUrlTemplate.replace('{query}', encodeURIComponent(addressRequest));
    const token = props.data.property.mapSASToken;
    console.log(token)


    const address = async () => { 
      const request =  await fetch(requestUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': 'jwt-sas ' + token,
        'Content-Type': 'application/json; charset=utf-8'
        }
      });
      
      const data = await request.json();
      console.log(data);
      return data.results;
    }

    return address();
  }

  const onChange = (data: string) => {
    setValue(data);
    let tmp: AddressDataType[] = [];
    if (data.length >= 4) {
      addressQuery(data).then(addressData => {
        addressData.filter((address: any) => {
          if (address.address.streetNumber && address.address.streetName) {
            tmp.push({
                "label" : address.address.freeformAddress,
                "value" : address.address.freeformAddress,
                "key" : address.id,
                "address" : address.address,
                "lat" : address.position.lat,
                "long" : address.position.lon
              });
            // return address
          }
        })
        setAddresses(tmp)});

          // addressData.forEach((address: any) => {
            // console.log(address.properties.address.formattedAddress);
            // tmp.push({ "value" : address.address.freeformAddress})
            // tmp.push({ "value" : address.properties.address.formattedAddress});
          // });
      // }).finally(() => {
      //   setAddresses(tmp);
      // });
    }
  }

  const onSelect = (value: any, option: any) => {
    console.log("options", option)
    setCurrentAddress(option.address);
    setCurrentPoint([option.lat, option.long]);
    form.setFieldsValue({
      location:
      {
        address: 
        {
          streetNumber: option.address.streetNumber ? option.address.streetNumber : ' ',
          streetName: option.address.streetName ? option.address.streetName : ' ',
          postalCode: option.address.postalCode ? option.address.postalCode : ' ',
          extendedPostalCode: option.address.extendedPostalCode ? option.address.extendedPostalCode : ' ',
          country: option.address.country ? option.address.country : ' ',
          countryCode: option.address.countryCode ? option.address.countryCode : ' ',
          countryCodeISO3: option.address.countryCodeISO3 ? option.address.countryCodeISO3 : ' ',
          countrySubdivisionName: option.address.countrySubdivisionName ? option.address.countrySubdivisionName : ' ',
          countrySubdivision: option.address.countrySubdivision ? option.address.countrySubdivision : ' ',
          countrySecondarySubdivision: option.address.countrySecondarySubdivision ? option.address.countrySecondarySubdivision : ' ',
          countryTertiarySubdivision: option.address.countryTertiarySubdivision ? option.address.countryTertiarySubdivision : ' ',
          freeformAddress: option.address.freeformAddress ? option.address.freeformAddress : ' ',
          municipality: option.address.municipality ? option.address.municipality : ' ',
          localName: option.address.localName ? option.address.localName : ' ',
          municipalitySubdivision: option.address.municipalitySubdivision ? option.address.municipalitySubdivision : ' ',
          streetNameAndNumber: option.address.streetNameAndNumber ? option.address.streetNameAndNumber : ' ',
          routeNumbers: option.address.routeNumbers ? option.address.routeNumbers : ' ',
          crossStreet: option.address.crossStreet ? option.address.crossStreet : ' ',
        },   
        position: {
          coordinates: [option.lat, option.long]
        }
        
        
        // {
        //   lat: option.lat ? option.lat : ' ',
        //   long: option.long ? option.long : ' ',
        // }
      
      } ,
    });
  }

  return (
    <div>
      <Paragraph>Search: </Paragraph>
      <AutoComplete
        options={addresses}
        style={{
          width: '75%',
          paddingBottom: '10px',
        }}
        filterOption={ false } 
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        
      >
      </AutoComplete>
        
      <Form 
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
        style={{
          width: '75%',
        }}
      >
        
        <Form.Item name={["location","address", "streetNumber"]} label="Street Number">
          <Input disabled placeholder='Street Number'></Input>
        </Form.Item>
        <Form.Item name={["location","address", "streetName"]} label="Street Name">
          <Input disabled placeholder='Street Name'></Input>
        </Form.Item>
        <Form.Item name={["location","address", "countryTertiarySubdivision"]} label="Country Tertiary Subdivision">
          <Input disabled placeholder='Country Tertiary Subdivision' ></Input>
        </Form.Item>
        <Form.Item name={["location","address", "countrySecondarySubdivision"]} label="Country Secondary Subdivision">
          <Input disabled placeholder='Country Secondary Subdivision' ></Input>
        </Form.Item>
        <Form.Item name={["location","address", "countrySubdivision"]} label="Country Subdivision">
          <Input disabled placeholder='Country Subdivision'></Input>
        </Form.Item>
        <Form.Item name={["location","address", "countrySubdivisionName"]} label="Country Subdivision Name">
          <Input disabled placeholder='Country Subdivision Name'></Input>
        </Form.Item>
        <Form.Item name={["location","address", "municipality"]} label="Municipality">
          <Input disabled placeholder='Country Municipality' ></Input>
        </Form.Item>
        <Form.Item name={["location","address", "municipalitySubdivision"]} label="Municipality Subdivision">
          <Input disabled placeholder='Country Municipality Subdivision' ></Input>
        </Form.Item>
        <Form.Item name={["location","address", "localName"]} label="Local Name">
          <Input disabled placeholder='Local Name' ></Input>
        </Form.Item>
        <Form.Item name={["location","address", "postalCode"]} label="Zip Code">
          <Input disabled placeholder='Zip Code'></Input>
        </Form.Item>
        <Form.Item name={["location","address", "extendedPostalCode"]} label="Extended Zip Code">
          <Input disabled placeholder='Extended Zip Code'></Input>
        </Form.Item>
        <Form.Item name={["location","address", "country"]} label="Country">
          <Input disabled placeholder='Country' ></Input>
        </Form.Item>
        <Form.Item name={["location","address", "countryCode"]} label="Country Code">
          <Input disabled placeholder='Country Code' ></Input>
        </Form.Item>
        <Form.Item name={["location","address", "countryCodeISO3"]} label="Country Code ISO3">
          <Input disabled placeholder='Country Code ISO3' ></Input>
        </Form.Item>
        <Form.Item name={["location","address", "freeformAddress"]} label="Free Form Address">
          <Input disabled placeholder='Free Form Address' ></Input>
        </Form.Item>
        <Form.Item name={["location","address", "streetNameAndNumber"]} label="Street Name and Number">
          <Input disabled placeholder='Free Form Address' ></Input>
        </Form.Item>
        <Form.Item name={["location","address", "routeNumbers"]} label="Route Numbers">
          <Input disabled placeholder='Route Numbers' ></Input>
        </Form.Item>
        <Form.Item name={["location","address", "crossStreet"]} label="Cross Street">
          <Input disabled placeholder='Cross Street' ></Input>
        </Form.Item>
        <Form.Item name={["location", "position","coordinates"]} label="Coordinates (Lat, Lon)">
          <Input disabled placeholder='Coordinates' ></Input>
        </Form.Item>

        {/* <Form.Item name={["location","coordinates", "lat"]} label="Latitude">
          <Input disabled placeholder='Latitude' ></Input>
        </Form.Item>
        <Form.Item name={["location","point", "long"]} label="Longitude">
          <Input disabled placeholder='Longitude' ></Input>
        </Form.Item> */}
        <Form.Item>
          <Button type="primary" htmlType="submit" value={'save'} loading={formLoading}>
            Save
          </Button>
        </Form.Item>
      </Form>

    </div>
  )
}