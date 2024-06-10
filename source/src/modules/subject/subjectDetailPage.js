import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useDragDrop from '@hooks/useDragDrop';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import React, { useMemo, createContext, useContext } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'antd';
import { HolderOutlined } from '@ant-design/icons';

const message = defineMessages({
    objectName: 'Bài giảng',
    lecture: 'Bài giảng',
});

const RowContext = createContext({});
const DragHandle = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button
            type="text"
            size="small"
            icon={<HolderOutlined />}
            style={{ cursor: 'move' }}
            ref={setActivatorNodeRef}
            {...listeners}
        />
    );
};

const Row = (props) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key'],
    });

    const style = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    const contextValue = useMemo(() => ({ setActivatorNodeRef, listeners }), [setActivatorNodeRef, listeners]);

    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};

const SubjectDetailPage = () => {
    const params = useParams();
    const translate = useTranslate();

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

    const { sortedData, onDragEnd, sortColumn, handleUpdate } = useDragDrop({
        data,
        apiConfig: apiConfig.lecture.updateSort,
        indexField: 'ordering',
    });
    // console.log('sorted data', sortedData);

    const columns = [
        {
            ...sortColumn,
            render: () => <DragHandle />,
        },
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
                    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                        <SortableContext
                            items={sortedData.map((i) => i.ordering)}
                            strategy={verticalListSortingStrategy}
                        >
                            <BaseTable
                                onChange={mixinFuncs.changePagination}
                                columns={columns}
                                dataSource={sortedData}
                                loading={loading}
                                pagination={pagination}
                                components={{ body: { row: Row } }}
                            />
                        </SortableContext>
                    </DndContext>
                }
            ></ListPage>
        </PageWrapper>
    );
};
export default SubjectDetailPage;
