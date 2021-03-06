import PropTypes from 'prop-types';
import { Upload } from 'antd';
import axios from 'axios';
import ImgCrop from 'antd-img-crop';
import imageCompression from 'browser-image-compression';
import React, { useState } from 'react';

import { UploadFile, UploadProps, RcFile } from 'antd/lib/upload/interface';


const ComponentProps = {
  data: PropTypes.shape({
    permittedContentTypes: PropTypes.arrayOf(PropTypes.string),
    
    permittedFileExtensions: PropTypes.arrayOf(PropTypes.string),
    maxFileSizeBytes: PropTypes.number,
    maxWidthOrHeight: PropTypes.number,
    blobPath: PropTypes.string.isRequired

  }),
  authorizeRequest: PropTypes.func.isRequired,
  onInvalidContentType: PropTypes.func,
  onInvalidContentLength: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  cropperProps: PropTypes.object,
  uploadProps: PropTypes.object,
}
export interface AuthResult {
  isAuthorized: boolean;
  authHeader: string;
  blobName: string;
  requestDate: string;
}
interface ComponentProp {
  data: {
    permittedContentTypes?: string[];
    permittedExtensions?: string[];
    maxFileSizeBytes?: number;
    maxWidthOrHeight?: number;
    notificationCount?: number;
  }    
  onInvalidContentType?: () => void
  onInvalidContentLength?: () => void
  onSuccess?: (file:UploadFile) => void
  onError?: (file:File,error:any) => void
  onRemoveRequested?: (file:UploadFile<unknown>) => Promise<boolean>
  authorizeRequest: (file:File) => Promise<AuthResult>
  cropperProps?: object
  uploadProps?: UploadProps
}

export type AzureUploadProps = PropTypes.InferProps<typeof ComponentProps> & ComponentProp;


export const AzureUpload:React.FC<AzureUploadProps> = (props) => {
  const [authResult, setAuthResult] = useState<AuthResult|undefined>(undefined);
  
  const beforeUpload = async (file:any) => {
    const isValidContentType = props.data.permittedContentTypes && props.data.permittedContentTypes.includes(file.type);

    if (!isValidContentType) {
      if(props.onInvalidContentType) {props.onInvalidContentType() }
      return Upload.LIST_IGNORE;
    }
    var newFile: RcFile ;
    if(file.type.startsWith('image/') && (props.data.maxFileSizeBytes || props.data.maxWidthOrHeight)) {
      try {
        console.log('beforeCompression size:', file.size);
        var options:any = {};
        if(props.data.maxFileSizeBytes) { options.maxSizeMB = props.data.maxFileSizeBytes / 1024 / 1024; }
        if(props.data.maxWidthOrHeight) { options.maxWidthOrHeight = props.data.maxWidthOrHeight; }
        console.log('beforeCompression options:', options);
        const uid = file.uid;
        newFile = (await imageCompression(file, options)) as RcFile;
        file.uid = uid;
        

      } catch (error) {
        console.error('cannot compress:',error);
        return Upload.LIST_IGNORE;
      } 
    }else{
      newFile = file;
    }
    console.log('afterCompression size:', newFile.size);
    const isValidContentLength = props.data.maxFileSizeBytes && newFile.size <= props.data.maxFileSizeBytes;

    if (!isValidContentLength) {
      if(props.onInvalidContentLength) {props.onInvalidContentLength() }
    }
    if( isValidContentType && isValidContentLength){
      const result =  await props.authorizeRequest(newFile) as AuthResult;
      if(result.isAuthorized) {
        //@ts-ignore
        newFile['url'] = `${props.data.blobPath}/${result.blobName}`;
        console.log('file',newFile);
        setAuthResult(result);
        return newFile;
      }
    }
      return Upload.LIST_IGNORE;;
  }

  const customizeUpload =  async (option:any) => {
 //   const result =  await props.authorizeRequest(option.file) as AuthResult;
    if(authResult && authResult.isAuthorized) {
      const {authHeader,blobName,requestDate} = authResult;
      try {
        option.file.url = `${props.data.blobPath}/${blobName}`;
        var response = await axios.request({
          method: 'put',
          url: `${props.data.blobPath}/${blobName}`, 
          data: new Blob([option.file],{type:option.file.type}),
          headers: {
            ...option.headers,
            "Authorization": authHeader,
            "x-ms-blob-type": "BlockBlob",
            "x-ms-version": "2021-04-10",
            "x-ms-date": requestDate,
            "Content-Type": option.file.type, 
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            option.onProgress({percent:percentCompleted},option.file);
          }
          
        });
        
        
        console.log('uploaded:',option.file);
        if(props.onSuccess) {props.onSuccess(option.file) }
        option.onSuccess(response,option.file);
      } catch (uploadError) {
        if(props.onError) {props.onError(option.file,uploadError) }
        option.onError(uploadError,option.file);
      }
    } else {
    // not authorized - do nothing
    }
    return option;
  }
  const validFileExtensions = props.data.permittedExtensions?('.' + props.data.permittedExtensions.join(', .')):undefined;
  console.log('validFileExtensions',validFileExtensions);

  if(props.cropperProps) {
    return(
      <ImgCrop
        {...props.cropperProps}
        >
         <Upload
            accept={validFileExtensions}
            customRequest={customizeUpload}
            beforeUpload={beforeUpload}
            onRemove={(file) => {return props.onRemoveRequested?props.onRemoveRequested(file):undefined}}
            progress={{
              strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
              },
              strokeWidth: 3,
              format: percent => percent?`${parseFloat(percent.toFixed(2))}%`:''
            }}
            {...props.uploadProps}
          >
            {props.children}
          </Upload>
      </ImgCrop>
    )
  }
  return (
    <Upload
      accept={validFileExtensions}
      customRequest = {customizeUpload}
      beforeUpload={beforeUpload}
      onRemove={(file) => {return props.onRemoveRequested?props.onRemoveRequested(file):undefined}}
      progress={{
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068',
        },
        strokeWidth: 3,
        format: percent => percent?`${parseFloat(percent.toFixed(2))}%`:''
      }}
      {...props.uploadProps}
    >
      {props.children}
    </Upload>
  )
}