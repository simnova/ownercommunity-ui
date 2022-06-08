import { useNode } from "@craftjs/core";
import { useEffect, useState } from"react";
import { useParams } from 'react-router-dom';
import { Carousel, Image, Form, Modal, Button, Skeleton, Slider, Space, Row, Col, InputNumber, Switch } from 'antd';
import { FileImageOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { GetImagesInCommunityDocument } from '../../../generated';

interface CarouselComponentProp {
  images: string[];
  width: number;
  autoplay: boolean;
}

let CarouselComponent: any;

CarouselComponent = ({ images, width, autoplay }: CarouselComponentProp) => {
  const { connectors: { connect, drag } } = useNode();

  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <div
      className="px-4 py-2 carousel-component"
      ref={ref => connect(drag(ref as HTMLDivElement))}
    >
      <div className='bg-white sm:rounded shadow' style={{ overflow: 'hidden', maxWidth: '68vw' }}>
        {images.length > 0 && 
          <Carousel afterChange={onChange} autoplay={autoplay} >
            {images.map((image, index) => {
              return (
                <div key={index}>
                  <Image src={image} preview={false} width={width} />
                </div>
              )
            })}
          </Carousel>
        }
        {images.length === 0 && 
          <div 
            style={{ 
              height: '100px', 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center' 
            }}>
              <FileImageOutlined style={{ fontSize: '32px'}}/>
          </div>
        }
      </div>
    </div>
  )
}

var CarouselComponentSettings = () => {
  const params = useParams();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const { actions: { setProp}, images, width, autoplay } = useNode((node) => ({
    images: node.data.props.images,
    width: node.data.props.width,
    autoplay: node.data.props.autoplay,
  }));

  const handleClick = (index: number) => {
    setProp((props: any) => {
      props.images.splice(index, 1);
      return props;
    })
  }

  const toggleAutoplay = () => {
    setProp((props: any) => props.autoplay = !autoplay);
  }

  const { data, loading, error } = useQuery(GetImagesInCommunityDocument, {
    variables: { communityId: params.communityId ?? ''}
  });


  if (loading) {
    return <Skeleton active />
  }
  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }
  if (data) {
    return (
      <div>
        <Form layout="vertical">
          <Form.Item>
            <Button type='primary' onClick={() => setModalVisible(true)}>
              Add an image
            </Button> 
            <Modal 
              title="Add an image"
              visible={isModalVisible}
              onOk={() => {
                setProp((props: any) => props.images = [...images, imageUrl]);
                setModalVisible(false);
              }}
              onCancel={() => setModalVisible(false)}
            >
              {data.communityById && data.communityById.filesByType && data.communityById.filesByType.length > 0 && data.communityById.filesByType.map((file: any) => (
                <Image
                  src={file.url}
                  fallback="https://joeschmoe.io/api/v1/random"
                  preview={false}
                  onClick={(e: any) => setImageUrl(e.target.src)}
                  className={imageUrl === file.url ? 'selected-img' : ''}
                  style={{ margin: '0 5px', maxWidth: '100px', minWidth: '32px'}}
                />
              ))}
              {data.communityById && data.communityById.filesByType && data.communityById.filesByType.length === 0 && <div>No images in this community</div>}
            </Modal>
            {images && images.length > 0 && 
              images.map((_: any, index: number) => {
                return (
                  <div key={index} style={{ margin: '5px' }}>
                    <Space size="middle">
                      <span>Image #{index+1}</span>
                      <CloseCircleTwoTone twoToneColor="red" onClick={e => handleClick(index)}/>
                    </Space>
                  </div>
                )
            })}
          </Form.Item>
          <Form.Item label="Image Width">
            <Row>
              <Col span={12}>
                <Slider 
                  min={1} 
                  max={2000} 
                  value={width} 
                  onChange={(value: number) => setProp((props: any) => props.width = value)} 
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={2000}
                  style={{ margin: '0 16px' }}
                  value={width}
                  onChange={(inputElement) => setProp((props: any) => props.width = inputElement)}
                />
                </Col>
            </Row>
          </Form.Item>
          <Form.Item label="Autoplay">
            <Switch checked={autoplay} onChange={toggleAutoplay} />
          </Form.Item>
        </Form>
      </div>
    )
  }
  return <div>Upload images to your community using the Files tab above</div>
}

CarouselComponent.craft = {
  props: {
    images: [],
    width: 600,
    autoplay: false,
  },
  related: {
    settings: CarouselComponentSettings
  }
}

export {
  CarouselComponent
}