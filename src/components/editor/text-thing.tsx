import {useNode,useEditor} from "@craftjs/core";
import { Button, Input, Form} from "antd";
import ListBody from "antd/lib/transfer/ListBody";
import ContentEditable from 'react-contenteditable'

interface TextProp {
  title: string;
  body: string;
  fontSize: number
}

let TextThing:any;

TextThing = ({ title,body , fontSize, ...props } : TextProp) => {
  const { connectors: {connect,drag}, selected, actions } = useNode((state) =>(
    {
      selected: state.events.selected,
    
    }
  ));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));


  return (
    <div 
      className="px-4 py-2"
      ref={ref => connect(drag(ref as HTMLDivElement))} 
      {...props}
      >
        <div role="listitem" className="bg-white cursor-pointer shadow rounded-lg p-8 relative z-30">
            <div className="md:flex items-center justify-between">
                <h2 className="text-2xl font-semibold leading-6 text-gray-800">{title}</h2>
            </div>
            <div className="md:w-80 text-base leading-6 mt-4 text-gray-600">
              
            <ContentEditable
              html={body} 
              disabled={!enabled}
              onChange={e => 
                actions.setProp((prop:TextProp) => 
                  prop.body = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")  
                )
              } 
              tagName="p"
              style={{fontSize: `${fontSize}px`}}
            />  
              
            </div>
        </div>
      
    </div>
  )
}


var TextThingSettings = () => {
  const { actions: { setProp}, title, body, fontSize  } = useNode((node) => ({  
    title: node.data.props.title,
    body: node.data.props.body,
    fontSize: node.data.props.fontSize

  }));
  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="Title">
          <Input placeholder="Title" value={title} onChange={(inputElement) => setProp((props:any) => props.title = inputElement.target.value)}  />
        </Form.Item>  
        <Form.Item label="Body">
          <Input placeholder="Body" value={body} onChange={(inputElement) => setProp((props:any) => props.body = inputElement.target.value)}  />
        </Form.Item>  
        <Form.Item label="Font Size">
          <Input placeholder="Font Size" value={fontSize} onChange={(inputElement) => setProp((props:any) => props.fontSize = parseInt(inputElement.target.value))}  />
        </Form.Item>
      </Form>
    </div>
  )
}

TextThing.craft = {
  props: {
    title: 'Title',
    body: 'Body',
    fontSize: 24
  },
  related: {
    settings: TextThingSettings
  }

}

export  {
  TextThing
}