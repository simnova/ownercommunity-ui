import React from 'react';
import { Form,Input,Button,Descriptions, Select } from 'antd';
import dayjs from 'dayjs';
import { MemberUpdateInput } from '../../../../generated';

export interface MembersDetailProps {
  data: {
    member: any
    roles: any[];
  };
  onSave: (member: MemberUpdateInput) => void;
}

export const MembersDetail: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  return(
    <div>
      <Descriptions title="Member Info" size={'small'} layout={'vertical'}>
        <Descriptions.Item label="Id">{props.data.member.id}</Descriptions.Item>
        <Descriptions.Item label="Created At">{dayjs(props.data.member.createdAt).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Updated At">{dayjs(props.data.member.createdAt).format('DD/MM/YYYY')}</Descriptions.Item>
      </Descriptions>
      <Form
        layout="vertical"
        form={form}
        initialValues={props.data.member}
        onFinish={(values) => {
          var member: MemberUpdateInput = {
            id: props.data.member.id,
            memberName: values.memberName,
            role: values.role.id,
          }
          props.onSave(member);
        }}
        >
        <Form.Item
          name={['memberName']}
          label="Member Name"
          rules={[
            { required: true, message: 'Member Name is required.' },
          ]}
        >
          <Input placeholder='Name' maxLength={200} />
        </Form.Item>
        <Form.Item
          name={['role','id']}
          label="Role"
        >
          <Select allowClear={true}  placeholder="Select a role" options={props.data.roles} fieldNames={{label:'roleName', value:'id'}} />
        </Form.Item>
        <Button type="primary" htmlType="submit" value={'save'} >
          Save
        </Button>
      </Form>
    </div>
  )
}