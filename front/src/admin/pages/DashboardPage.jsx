import React from 'react';
import { Layout, Menu } from 'antd';
import {
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined, UserOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const { Header, Content, Sider } = Layout;

const MainLayout = styled(Layout)`
    min-height: 100vh;
`;

const StyledContent = styled(Content)`
    margin: 0;
    padding: 24px;
    width: 80vw;
    background-color: #fff;
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const DashboardPage = () => {
    const navigate = useNavigate();

    const menuItems = [
        { key: 'dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
        { key: 'services', icon: <ShopOutlined />, label: 'Services' },
        { key: 'clients', icon: <TeamOutlined />, label: 'Clients' },
        { key: 'masters', icon: <UserOutlined />, label: 'Masters' },
    ];

    const handleMenuClick = (e) => {
        navigate(`/admin/${e.key}`);
    };

    return (
        <MainLayout>
            <Sider width={250} theme="dark">
                <div className="logo" style={{ height: '64px', margin: '16px', color: 'white', textAlign: 'center' }}>
                    PMU Dashboard
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }} />
                <StyledContent>
                    <Outlet />
                </StyledContent>
            </Layout>
        </MainLayout>
    );
};

export default DashboardPage;
