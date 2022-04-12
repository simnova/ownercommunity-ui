import React from "react";
import CmsPage from "./cms-page";
import { Header } from "../../ui/organisms/header";

export const Root: React.FC<any> = (_props) => {
  return (
    <div>
      <Header />
      <CmsPage/>
    </div>
  )
}