import React, { useState } from 'react';
import { Layout } from 'antd';

import NavSider from './NavSider';
import AppHeader from './AppHeader';

import styles from './MainLayout.module.scss';
import { brandName } from '@constants';

const { Content, Footer } = Layout;

const SIDEBAR_WIDTH_EXPAND = 320;

const MainLayout = ({ children }) => {
    const [ collapsed, setCollapsed ] = useState(false);

    const toggleCollapsed = () => setCollapsed(prev => !prev);

    return (
        <Layout hasSider>
            <NavSider
                collapsed={collapsed}
                onCollapse={toggleCollapsed}
                width={SIDEBAR_WIDTH_EXPAND}
            />
            <Layout>
                <AppHeader
                    collapsed={collapsed}
                    onCollapse={toggleCollapsed}
                />
                <Content className={styles.appContent}>
                    <div className={styles.wrapper}>{children}</div>
                    <Footer className={styles.appFooter}>
                        <strong>{brandName} </strong>
                        - © Copyright {new Date().getFullYear()}. All Rights Reserved.
                    </Footer>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
