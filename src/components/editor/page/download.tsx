import { useEditor } from "@craftjs/core";
import copy from "copy-to-clipboard";
import { notification, Button } from "antd";
import {usePageLayouts} from "../local-data";

export const Download = () => {
  const [pageLayouts, setPageLayouts] = usePageLayouts();
  const { query } = useEditor();

  const download = () => {
    const json = query.serialize();
    copy(JSON.stringify(json));
    notification.success({
      message: "Copied to Clipboard",
      description: "The JSON has been copied to your clipboard"
    });
  }

  const downloadAll = () => {
    copy(JSON.stringify(pageLayouts));
    notification.success({
      message: "Copied to Clipboard",
      description: "The JSON has been copied to your clipboard"
    });
  }

  return (
    <div style={{display:'flex'}}>
      <Button onClick={() => download()}>Get JSON</Button>
      <Button onClick={() => downloadAll()}>Get Site JSON</Button>
    </div>
  )
}