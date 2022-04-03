import { useMutation } from "@apollo/client";
import { AdminPropertiesAddContainerPropertyAddDocument, AdminPropertiesListContainerPropertiesByCommunityDocument, PropertyAddInput } from "../../../../generated";
import { message } from "antd";
import { PropertiesAdd } from "./properties-add";
import { useNavigate } from "react-router-dom";

export const PropertiesAddContainer: React.FC<any> = (props) => {
  const navigate = useNavigate();
  const [propertyAdd] = useMutation(AdminPropertiesAddContainerPropertyAddDocument,{

    update(cache, { data }) { // update the list with the new item
      const newProperty = data?.propertyAdd.property;
      const properties = cache.readQuery({ query: AdminPropertiesListContainerPropertiesByCommunityDocument })?.propertiesByCommunityId;
      if(newProperty && properties) {
        cache.writeQuery({
          query: AdminPropertiesListContainerPropertiesByCommunityDocument,
          data: {
            propertiesByCommunityId: [...properties, newProperty]
          }
        })
      }
    }
    
  });  

  const handleSave = async (values: PropertyAddInput) => {
    try {
      var newProperty = await propertyAdd({
        variables: {
          input: values
        }      
      });
      message.success("Property Added");
      navigate(`../${newProperty.data?.propertyAdd.property?.id}`, { replace: true });
      
    } catch (error) {
      message.error(`Error adding Property: ${JSON.stringify(error)}`);
    }
  }

  return <PropertiesAdd onSave={handleSave} />
}