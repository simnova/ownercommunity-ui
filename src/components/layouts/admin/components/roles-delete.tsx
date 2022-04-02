import { Form,Input,Button,Descriptions, Checkbox ,Select} from 'antd';
import dayjs from 'dayjs';


export interface RolesDeleteProps {
  data: {
    roleToDelete: any;
    roles: any[];
  };
  onSelectReassignment: (role: any) => void;
}

export const RolesDelete: React.FC<RolesDeleteProps> = (props) => {
  const [form] = Form.useForm();
  return (
    <div>
      <Descriptions title="Role Info" size={'small'} layout={'vertical'}>
        <Descriptions.Item label="Id">{props.data.roleToDelete.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{props.data.roleToDelete.roleName}</Descriptions.Item>
        <Descriptions.Item label="Is Default">{props.data?(props.data.roleToDelete.isDefault?"true":"false"):"false"}</Descriptions.Item>
        <Descriptions.Item label="Created At">{dayjs(props.data.roleToDelete.createdAt).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Updated At">{dayjs(props.data.roleToDelete.createdAt).format('DD/MM/YYYY')}</Descriptions.Item>
      </Descriptions>
      <Form
        layout="vertical"
        form={form}
        initialValues={props.data}
        onFinish={(values) => {
          props.onSelectReassignment(values.id);
          
        }}
        >
        <Form.Item
          name={["id"]}
          label="Role to Reassign to"
          rules={[
            { required: true, message: 'Reassignment is required' },
          ]}
        >
          <Select options={props.data.roles} fieldNames={{label:'roleName', value:'id'}} disabled={props.data.roleToDelete.isDefault} />
        </Form.Item>
        <Button type="primary" htmlType="submit" value={'save'} disabled={props.data.roleToDelete.isDefault}>
          Delete Role
        </Button>
      </Form>
    </div>
  )
}