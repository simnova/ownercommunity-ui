import React, { useState } from 'react';
import './section-layout.css';
import { PageLayoutProps } from '.';
import { Link, Outlet, useParams } from 'react-router-dom';
import { LocalSettingsKeys, handleToggler } from '../../../constants';
import { CommunitiesDropdownContainer } from '../../ui/organisms/dropdown-menu/communities-dropdown-container';
import { LoggedInUserContainer } from '../../ui/organisms/header/logged-in-user-container';
import { MenuComponent } from './components/menu-component';
import { Layout } from 'antd';

const { Sider, Header } = Layout;

interface AdminSectionLayoutProps {
  pageLayouts: PageLayoutProps[];
}

export const SectionLayout: React.FC<AdminSectionLayoutProps> = (props) => {
  const params = useParams();
  const sidebarCollapsed = localStorage.getItem(
    LocalSettingsKeys.SidebarCollapsed
  );
  const [isExpanded, setIsExpanded] = useState(sidebarCollapsed ? false : true);
  return (
    <Layout className="site-layout" style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: 'black' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex' }} className="allowBoxShadow">
            <CommunitiesDropdownContainer data={{ id: params.communityId }} />
          </div>
          <Link
            className="allowBoxShadow"
            to={`/community/${params.communityId}/member/${localStorage.getItem(
              LocalSettingsKeys.UserId
            )}`}
          >
            View Member Site
          </Link>

          <LoggedInUserContainer autoLogin={true} />
        </div>
      </Header>

      <Layout hasSider={true}>
        <Sider
          theme="light"
          className="site-layout-background"
          collapsible
          collapsed={!isExpanded}
          onCollapse={() => handleToggler(isExpanded, setIsExpanded)}
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            position: 'relative',
            left: 0,
            top: 0,
            bottom: 0
          }}
        >
          <div className="logo" />

          <MenuComponent
            pageLayouts={props.pageLayouts}
            theme="light"
            mode="inline"
          />
        </Sider>

        <Layout
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 auto',
            overflowY: 'scroll',
            height: 'calc(100vh - 64px)'
          }}
        >
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
};
