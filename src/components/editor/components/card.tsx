import { Element, useNode } from "@craftjs/core";
import { Container } from "./container";
import { TextComponent } from "./text-component";
import { Form, Input, Button } from "antd";
import { TextThing } from "./text-thing";

interface CardGrop {
    bgColor: string;
    padding: number;
}

const CardTop = (props: any) => {
    const { connectors: {connect} } = useNode();
    return (
      <div ref={ref => connect(ref as HTMLDivElement)}>
        {props.children}
      </div>
    )
  }

  
CardTop.craft = {
    rules: {
        canMoveIn: (incomingNodes: any[]) => incomingNodes.every(incomingNode => incomingNode.data.type === TextComponent || TextThing)
    }
}


let Card: any;

Card = ({ bgColor, padding, ...props }: CardGrop) => {
    const { selected } = useNode((state) =>(
        {
            selected: state.events.selected,
        }
      ));
    return (
        <Container background={bgColor} >
            <div role="listitem" className="bg-white cursor-pointer shadow rounded-lg p-8 relative z-30">
                <Element is={CardTop} id="drop" canvas>
                    <TextComponent text="Card Title" fontSize={24} fontWeight={800} />
                    <TextComponent text="Card body goes here" />
                </Element>
            </div>
        </Container>
    )
}

let CardSettings = () => {
    const { actions: { setProp }, bgColor, padding } = useNode((node) => ({
        bgColor: node.data.props.bgColor,
        padding: node.data.props.padding
    }));

    return (
        <Form>
            <Form.Item label="Background Color">
                <Input
                    placeholder="#ffffff"
                    value={bgColor}
                    onChange={(inputElement) => setProp((props: any) => props.bgColor = inputElement.target.value)}
                />
            </Form.Item>
            <Form.Item label="Padding">
                <Input
                    placeholder="0px"
                    value={padding}
                    onChange={(inputElement) => setProp((props: any) => props.padding = parseInt(inputElement.target.value))}
                />
            </Form.Item>
        </Form>
    )
}

Card.craft = {
    props: {
        bgColor: '#ffffff',
        padding: 0
    },
    related: {
        settings: CardSettings
    }
}

export {
    Card,
    CardTop

}