import React, { useState } from 'react';
import { Table, TableColumnsType, Row, message, Button, notification, Modal } from 'antd';
import { FileInfo } from '../../../../generated';
import ResizeObserver from 'rc-resize-observer';
import './site-editor-files-list.css';
import copy from "copy-to-clipboard";
import { LinkOutlined } from '@ant-design/icons';

export interface SiteEditorFilesListProps {
  data: FileInfo[];
  onRemove: (fileName: string) => void;
}

export const SiteEditorFilesList: React.FC<SiteEditorFilesListProps> = (props) => {
  const [tableHeight, setTableHeight] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileInfo | undefined>(undefined);
  //const scroll = true;

  const bytesToSize = (bytes: number): string => {
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i: number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
    if (i === 0) return `${bytes} ${sizes[i]}`
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const mimeTypeToFileType = (mimeType: string): string => {
    if (mimeType === 'text/plain') {
      return 'TEXT';
    } else if (mimeType.startsWith('image/') || mimeType.startsWith('application/') || mimeType.startsWith('text/')) {
      return mimeType.substring(mimeType.indexOf('/') + 1).toUpperCase();
    } else {
      return 'file';
    }
  }

  const copyUrl = (url:string) => {
    copy(url);
    notification.success({
      message: "Copied to Clipboard",
      description: "The link has been copied to your clipboard"
    });
  }
  
  const columns:TableColumnsType<FileInfo> = [
    {
      title: "File",
      dataIndex: "name",
      key: "name",
      width: "100%",
      sorter: ((a, b) => a.name.localeCompare(b.name)),
      render: (text: any, record:FileInfo) => text ? <a onClick={() => {setSelectedFile(record); setShowModal(true)}}>{text.substring(text.indexOf('/')+1)}</a> : <span>n/a</span>
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      width: "100px",
      filters: [
        { text: '< 1 MB', value: '1' },
        { text: '1 MB - 2 MB', value: '2' },
        { text: '2 MB - 5 MB', value: '3' },
        { text: '>  5 MB', value: '4' },
      ],
      onFilter: (value: string|number|boolean, record:FileInfo) => {
        switch (value) {
          case '1':
            return record.size < (1 * 1024 * 1024);
          case '2':
            return record.size >= (1 * 1024 * 1024) && record.size < (2 * 1024 * 1024);
          case '3':
            return record.size >= (2 * 1024 * 1024) && record.size < (5 * 1024 * 1024);
          case '4':
            return record.size >= (5 * 1024 * 1024);
          default:
            return true
        }
      },
      sorter: (a, b) => a.size - b.size,
      render: (text: any) => text ? <span>{bytesToSize(text)}</span> : <span>n/a</span>
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "100px",
      filters: [
        { text: 'Images', value: 'IMAGE' },
        { text: 'PDFs', value: 'PDF' },
        { text: 'Files', value: 'FILE' },
      ],
      onFilter: (value: string|number|boolean, record:FileInfo) => {
        switch (value) {
          case 'IMAGE':
            return record.type.startsWith('image/');
          case 'PDF':
            return record.type.startsWith('application/pdf');
          case 'FILE':
            return record.type.startsWith('text/') || record.type.startsWith('application/json');
          default:
            return true
        }
      },
      sorter: ((a, b) => mimeTypeToFileType(a.type).localeCompare(mimeTypeToFileType(b.type))),
      render: (text: any) => text ? <span>{mimeTypeToFileType(text)}</span> : <span>n/a</span>
    },
    {
      title: "Link",
      dataIndex: "url",
      key: "url",
      width: "80px",
      render: (text: any) => text ? <Button icon={<LinkOutlined />} onClick={()=> copyUrl(text)}></Button> : <span>n/a</span>
    },
  ]

  let spaceUsed = (props.data.reduce((acc: number, cur: any) => {
    return acc + cur.size
  }, 0));


  let preview = (file: FileInfo) : JSX.Element => {
    if(file.type.startsWith('image/')) {
      return <img src={file.url} alt="File Preview" />
    } else if (file.type.startsWith('application/pdf')) {
      return <embed src={file.url} />
    } else {
      return <p>Preview not available for this file type</p>
    }
  }


  return (<>
      <Modal
        title="File Preview"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => setShowModal(false)}
        >
          <div>
          {selectedFile && 
            preview(selectedFile)
          }
          </div>
      </Modal>
    <div className="site-editor-files-list">

      <div className="site-editor-files-list-header">
        <div className="site-editor-files-list-header-title">Files</div>
        <div className="site-editor-files-list-header-space-used">
          <div>Space Used:</div>
          <div>{bytesToSize(spaceUsed)}</div>
        </div>
      </div>

      <div className="site-editor-files-list-table">
        <ResizeObserver onResize={(rect) => setTableHeight(rect.height)}>
          <Table
            //scroll={scroll}
            columns={columns}
            dataSource={props.data}
            pagination={false}
            rowKey="name"
  
            size="small"
            style={{ height: tableHeight }}
          />
        </ResizeObserver>
      </div>
    </div>
  </>);
}