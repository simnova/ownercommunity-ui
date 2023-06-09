import { Space } from "antd";
import { Property } from "../../../../generated";
import { ListingDetails } from "./listing-details";
import { ListingTitle } from "./listing-title";


interface ListingProps {
  property: Property;
}

export const Listing: React.FC<ListingProps> = (props) => { 
 return ( 
  <>
  <ListingTitle property={props.property}/>
  <br />
  <Space direction="vertical" style={{ width: '100%' }}>
  <ListingDetails property={props.property} />
</Space>
</>
 )
}