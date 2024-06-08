import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { convertUtcToLocalTime } from '@utils/index';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import route from '@modules/account/student/routes';
import { useNavigate } from 'react-router-dom';
import { Button, Tag, Avatar } from 'antd';
import { statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import { AppConstants } from '@constants';
import { CourseIcon } from '@assets/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import routes from '@routes';

const message = defineMessages({
    objectName: 'Sinh viên',
});

const StudentListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFilter } = useListBase({
        apiConfig: apiConfig.student,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: ['account', 'avatar'],
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: <FormattedMessage defaultMessage="Họ và tên" />,
            dataIndex: ['account', 'fullName'],
        },
        {
            title: <FormattedMessage defaultMessage="Ngày sinh" />,
            dataIndex: ['account', 'birthday'],
            render: (birthday) => {
                const result = convertUtcToLocalTime(birthday, DEFAULT_FORMAT, DATE_FORMAT_VALUE);
                return <div>{result}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Số điện thoại" />,
            dataIndex: ['account', 'phone'],
        },
        {
            title: <FormattedMessage defaultMessage="Email" />,
            dataIndex: ['account', 'email'],
        },
        {
            title: <FormattedMessage defaultMessage="Trường" />,
            dataIndex: ['university', 'categoryName'],
        },
        {
            title: <FormattedMessage defaultMessage="Hệ" />,
            dataIndex: ['studyClass', 'categoryName'],
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'fullName',
            placeholder: translate.formatMessage(commonMessage.name),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
            submitOnChanged: true,
        },
    ];
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.student) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            ></ListPage>
        </PageWrapper>
    );
};
export default StudentListPage;
