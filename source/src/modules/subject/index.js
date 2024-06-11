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
    objectName: 'Môn học',
});

const SubjectListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFilter } = useListBase({
        apiConfig: apiConfig.subject,
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
    // console.log(data);
    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên môn học" />,
            dataIndex: ['subjectName'],
            render: (_, { id, subjectName }) => {
                return (
                    <div
                        onClick={() => {
                            navigate(`detail/${id}`);
                        }}
                        style={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                    >
                        {subjectName}
                    </div>
                );
            },
        },
        {
            title: <FormattedMessage defaultMessage="Mã môn học" />,
            dataIndex: ['subjectCode'],
            width: '220px',
        },
        {
            title: <FormattedMessage defaultMessage="Ngày tạo" />,
            dataIndex: ['createdDate'],
            width: '220px',
            render: (date) => {
                const result = convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{result}</div>;
            },
        },
        mixinFuncs.renderStatusColumn({ width: '150px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '150px' }),
    ];

    const searchFields = [
        {
            key: 'subjectName',
            placeholder: translate.formatMessage(commonMessage.subjectName),
        },
        {
            key: 'subjectCode',
            placeholder: translate.formatMessage(commonMessage.subjectCode),
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
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.subject) }]}>
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
export default SubjectListPage;
