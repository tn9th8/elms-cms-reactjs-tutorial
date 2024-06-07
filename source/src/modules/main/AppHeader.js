import { DownOutlined, LoginOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Menu, Space } from 'antd';
import React from 'react';
const { Header } = Layout;

import { NotificationForm } from '@components/common/form/NotificationForm';
import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { removeCacheToken } from '@services/userService';
import { accountActions } from '@store/actions';
import { defineMessages } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './AppHeader.module.scss';

const messages = defineMessages({
    profile: 'Profile',
    logout: 'Logout',
});

const AppHeader = ({ collapsed, onCollapse }) => {
    const { profile } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const translate = useTranslate();
    const { execute: executeLogout } = useFetch(apiConfig.account.logout);

    const onLogout = () => {
        removeCacheToken();
        dispatch(accountActions.logout());
    };

    const {
        data: dataMyNotification,
        execute: executeGetDataMyNotification,
        loading: loadingDataMyNotification,
    } = useFetch(apiConfig.notification.myNotification, {
        immediate: true,
        mappingData: ({ data }) => {
            const pageTotal = data?.totalPages;
            const unReadTotal = data?.totalUnread;
            const listNotification = data?.content?.map((item) => {
                const msg = JSON.parse(item?.msg);

                return {
                    id: item?.id,
                    kind: item?.kind,
                    createdDate: item?.createdDate,
                    state: item?.state,
                    projectId: msg?.projectId,
                    taskName: msg?.taskName,
                    projectName: msg?.projectName,
                    courseId: msg?.courseId,
                    lectureName: msg?.lectureName,
                    courseName: msg?.courseName,
                };
            });
            return {
                pageTotal,
                unReadTotal,
                listNotification,
            };
        },
    });
    const { execute: executeUpdateState } = useFetch(apiConfig.notification.changeState, {
        immediate: false,
    });

    return (
        <Header className={styles.appHeader} style={{ padding: 0, background: 'white' }}>
            <span className={styles.iconCollapse} onClick={onCollapse}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <Menu
                mode="horizontal"
                className={styles.rightMenu}
                selectedKeys={[]}
                items={[
                    {
                        key: 'menu',
                        label: (
                            <Space>
                                <Avatar
                                    icon={<UserOutlined />}
                                    src={`${AppConstants.contentRootUrl}${
                                        profile.logoPath || profile?.account?.avatar || profile.accountDto?.avatar
                                    }`}
                                />
                                {profile?.careerName ||
                                    profile?.name ||
                                    profile?.account?.fullName ||
                                    profile?.accountDto?.fullName ||
                                    profile?.companyName}
                                <DownOutlined />
                            </Space>
                        ),
                        children: [
                            {
                                label: (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <UserOutlined />
                                        <span>{translate.formatMessage(messages.profile)}</span>
                                    </div>
                                ),
                                key: 'profile',
                                onClick: () => navigate('/profile'),
                            },
                            {
                                label: (
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        <LoginOutlined />
                                        <span>{translate.formatMessage(messages.logout)}</span>
                                    </div>
                                ),
                                key: 'logout',
                                onClick: onLogout,
                            },
                        ],
                    },
                    {
                        key: 'notification',
                        label: (
                            <NotificationForm
                                data={dataMyNotification?.listNotification}
                                executeGetData={executeGetDataMyNotification}
                                executeUpdateState={executeUpdateState}
                                loading={loadingDataMyNotification}
                                unReadTotal={dataMyNotification?.unReadTotal}
                                pageTotal={dataMyNotification?.pageTotal}
                            />
                        ),
                    },
                ]}
            />
        </Header>
    );
};

export default AppHeader;