import { BulbOutlined } from '@ant-design/icons';
import routes from '@routes';
import {
    IconBuildingCommunity,
    IconClipboardText,
    IconSchool,
    IconSettings,
    IconUserBolt,
    IconBook2,
} from '@tabler/icons-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import apiConfig from './apiConfig';
import { categoryKind } from './masterData';
const navMenuConfig = [
    {
        label: <FormattedMessage defaultMessage="Quản lý admin" />,
        key: 'account-management',
        icon: <IconUserBolt size={16} />,
        children: [],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý Khoá học" />,
        key: 'quan-ly-mon-hoc',
        icon: <IconSchool size={16} />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản lý sinh viên" />,
                key: 'student-management',
                path: routes.studentListPage.path,
                permission: apiConfig.student.getList.baseURL,
            },
            {
                label: <FormattedMessage defaultMessage="Quản lý khóa học" />,
                key: 'subject-management',
                path: routes.subjectListPage.path,
                permission: apiConfig.subject.getList.baseURL,
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý dự án" />,
        key: 'quan-ly-du-an',
        icon: <IconClipboardText size={16} />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản lý lập trình viên" />,
                key: 'developer-management',
                path: generatePath(routes.developerListPage.path, {}),
                permission: apiConfig.developer.getList.baseURL,
            },
        ],
    },
];

export default navMenuConfig;
