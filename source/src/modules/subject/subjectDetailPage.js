import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

const message = defineMessages({
    objectName: 'Bài giảng',
    lecture: 'Bài giảng',
});

const SubjectDetailPage = () => {
    const params = useParams();
    const translate = useTranslate();
    const navigate = useNavigate();

    const { data, mixinFuncs, loading, pagination, queryFilter } = useListBase({
        apiConfig: {
            ...apiConfig.lecture,
            getList: (apiConfig.lecture.getBySubject = {
                ...apiConfig.lecture.getBySubject,
                baseURL: apiConfig.lecture.getBySubject.baseURL.replace(':subjectId', params.id),
            }),
        },
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
            title: <FormattedMessage defaultMessage="Tên bài giảng" />,
            dataIndex: ['lectureName'],
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.subject),
                    path: generatePath(routes.subjectListPage.path),
                },
                { breadcrumbName: translate.formatMessage(commonMessage.lecture) },
            ]}
        >
            <ListPage
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
export default SubjectDetailPage;
