import { useNode } from "@craftjs/core";
import React, { useEffect, useState } from"react";
import { useParams } from 'react-router-dom';
import { Carousel, Image, Form, Modal, Button, Skeleton, Layout, Slider, Space } from 'antd';
import { FileImageOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { GetImagesInCommunityDocument } from '../../../generated';

const { Content } = Layout;
interface CarouselComponentProp {
  images: string[];
  imageWidth: number;
}

let CarouselComponent: any;

CarouselComponent = ({ images, imageWidth }: CarouselComponentProp) => {
  const { connectors: { connect, drag } } = useNode();

  useEffect(() => {
    var carouselDivs = document.getElementsByClassName('carousel-component');
    console.log("DIVS ", carouselDivs);
    for (var i = 0; i < carouselDivs.length; i++) {
      var carouselDiv = carouselDivs[i];
      console.log(carouselDiv.parentElement);
      if (carouselDiv.parentElement) {
        carouselDiv.parentElement.style.display = 'block';
        carouselDiv.parentElement.style.maxWidth = `68vw`;
      }
    }
  }, [images, imageWidth]);

  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <div
      className="px-4 py-2 carousel-component"
      ref={ref => connect(drag(ref as HTMLDivElement))}
    >
      <div className='bg-white sm:rounded shadow' style={{ overflow: 'hidden' }}>
        {images.length > 0 && 
          <Carousel afterChange={onChange} >
            {images.map((image, index) => {
              return (
                <div key={index}>
                  <Image src={image} preview={false} width={imageWidth} />
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

  const { actions: { setProp}, images, imageWidth } = useNode((node) => ({
    images: node.data.props.images,
    imageWidth: node.data.props.imageWidth
  }));

  const handleClick = (image: string) => {
    setProp((props: any) => props.images = props.images.filter((str: string) => str !== image));
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
                setProp((props: any) => {
                  console.log("IMAGES ", images);
                  props.images = [...images, imageUrl];
                });
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
              images.map((image: string, index: any) => {
                return (
                  <div key={index}>
                    <Space size="middle">
                      <p>Image #{index+1}</p>
                      <CloseCircleTwoTone twoToneColor="red" onClick={e => handleClick(image)}/>
                    </Space>
                  </div>
                )
            })}
          </Form.Item>
          <Form.Item label="Image Width">
            <Slider min={1} max={2000} defaultValue={imageWidth} onChange={(value: number) => setProp((props: any) => props.imageWidth = value)} />
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
    imageWidth: 600,
  },
  related: {
    settings: CarouselComponentSettings
  }
}

export {
  CarouselComponent
}