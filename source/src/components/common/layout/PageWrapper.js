import React from 'react';
import { Breadcrumb, Spin, Tabs } from 'antd';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import styles from './PageWrapper.module.scss';
import { commonMessage } from '@locales/intl';
import useTranslate from '@hooks/useTranslate';

const PageWrapper = ({ loading, children, routes = [], tabs, onChangeTab, activeTab }) => {
    const translate = useTranslate();
    const hasTab = !!tabs?.length;
    routes = [{ breadcrumbName: translate.formatMessage(commonMessage.home),   path: '/' }, ...routes];
    return (
        <Spin spinning={!!loading} wrapperClassName={styles.pageWrapper}>
            <div className={classNames(styles.pageHeader, hasTab && styles.hasTab)}>
                {!!routes?.length && (
                    <Breadcrumb
                        routes={routes}
                        itemRender={(route) => {
                            const last = routes.indexOf(route) === routes.length - 1;

                            if (last) {
                                return (
                                    <span className={styles.breadcrumbLast}>{route.breadcrumbName || route.title}</span>
                                );
                            } else if (route.path) {
                                return (
                                    <Link to={route.path} style={{ color: '#1890ff' }}>
                                        {route.breadcrumbName || route.title}
                                    </Link>
                                );
                            } else {
                                return <span>{route.breadcrumbName || route.title}</span>;
                            }
                        }}
                    />
                )}
                {!!tabs?.length && (
                    <Tabs activeKey={activeTab} onChange={onChangeTab} items={tabs} className={styles.tab} />
                )}
            </div>
            <div className={styles.pageContent}>{children}</div>
        </Spin>
    );
};
export default PageWrapper;
