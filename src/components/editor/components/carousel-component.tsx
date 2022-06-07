import { useNode } from "@craftjs/core";
import { useState, } from"react";
import { useParams } from 'react-router-dom';
import { Carousel, Image, Form, Modal, Button, Skeleton } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { GetImagesInCommunityDocument } from '../../../generated';


interface CarouselComponentProp {
  images: string[];
}

let CarouselComponent: any;

CarouselComponent = ({ images }: CarouselComponentProp) => {
  const { connectors: { connect, drag } } = useNode();

  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <div
      className="px-4 py-2"
      ref={ref => connect(drag(ref as HTMLDivElement))}
    >
      <div className="bg-white shadow overflow-hidden sm:rounded" >
        {images.length > 0 && 
          <Carousel afterChange={onChange} autoplay infinite={false}>
            {images.map(image => {
              return (
                <div>
                  <Image preview={false} src={image} />
                </div>
              )
            })}
          </Carousel>
        }
        {images.length === 0 && 
          <div 
            style={{ 
              height: '50px', 
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

  const { actions: { setProp}, images } = useNode((node) => ({
    images: node.data.props.images,
  }));

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
          <Form.Item label="Images">
            <Button type='primary' onClick={() => setModalVisible(true)}>
              Add an image
            </Button> 
            <Modal 
              title="Add an image"
              visible={isModalVisible}
              onOk={() => {
                setProp((props: any) => props.images = [...props.images, imageUrl]);
                setModalVisible(false);
                setImageUrl("");
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
          </Form.Item>
        </Form>
      </div>
    )
  }
  return <div>Upload images to your community using the Files tab above</div>
}

CarouselComponent.craft = {
  related: {
    settings: CarouselComponentSettings
  }
}

export {
  CarouselComponent
}