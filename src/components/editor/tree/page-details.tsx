import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Input, FormInstance} from 'antd';
import { RuleObject } from 'antd/lib/form';

const ComponentPropTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    pageName: PropTypes.string,
    invalidPageNames: PropTypes.arrayOf(PropTypes.string),
  }),
  saveData: PropTypes.func.isRequired,
}

interface ComponentPropInterace {
  data: {  
    id: string;
    title: string;
    pageName: string;
    invalidPageNames: string[];
  },

  saveData: (data: {
    id: string,
    title: string,
    pageName: string,
  }) => void;
}

export type PageDetailsPropTypes = PropTypes.InferProps<typeof ComponentPropTypes> & ComponentPropInterace;

export const PageDetails: React.FC<PageDetailsPropTypes> = (props) => {

  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({
      title: props.data.title,
      pageName: props.data.pageName,
    });
  }, [props.data]);


  const pageNameIsNotDuplicate = (rule:RuleObject,value:any) => {
    return new Promise<void>((resolve,reject) => {
      if (props.data.invalidPageNames.indexOf(value) !== -1) {
        reject(`already in use by another page at this level.`);
      } else {
        resolve();
      }
    });
  }

  return <>
      <Form
        form={form}
        initialValues={{
          title: props.data.title,
          pageName: props.data.pageName,
        }}
        onFinish={(values) => {
          props.saveData(values);
        }}
      >
      <Form.Item 
        name="title" 
        label="Title"
        rules={[
          { required: true, message: 'Please input the title of the page' },
        ]}  
        >
        <Input />
      </Form.Item>  
      <Form.Item 
        name="pageName" 
        label="Page Name"
        rules={[
          { validator: pageNameIsNotDuplicate },
          { required: true, message: 'Please input your page name!' },
          { pattern: /^[a-zA-Z0-9-]+$/, message: 'Page name can only contain letters, numbers and dashes' },
        ]}
        >
        <Input />
      </Form.Item>  
      <Button type="primary" htmlType="submit">
        Save Page Changes
      </Button>
    </Form> 
  </>
}

