import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useDragDrop from '@hooks/useDragDrop';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import React, { useMemo, createContext, useContext, useState, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row, Table } from 'antd';
import { HolderOutlined, SaveOutlined } from '@ant-design/icons';

const message = defineMessages({
    objectName: 'Bài giảng',
    lecture: 'Bài giảng',
});

const RowContext = createContext({});
const RenderDragCol = () => {
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

const RenderHierarchyCol = ({ lectureName, lectureKind }) => {
    return lectureKind === 2 ? (
        <div style={{ marginLeft: '20px' }}>{lectureName}</div>
    ) : (
        <div>
            <strong>{lectureName}</strong>
        </div>
    );
};

const SortableRow = (props) => {
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
    let { id } = useParams();
    // console.log('>>> param >>> subjectId >>> ', id);
    const translate = useTranslate();

    const { data, mixinFuncs, loading, pagination, queryFilter } = useListBase({
        apiConfig: {
            ...apiConfig.lecture,
            getList: (apiConfig.lecture.getBySubject = {
                ...apiConfig.lecture.getBySubject,
                baseURL: apiConfig.lecture.getBySubject.baseURL.replace(':subjectId', id),
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
    // console.log('>>> data >>> subjectId >>> ', data[0]?.subject?.id);

    const { sortedData, onDragEnd, sortColumn, handleUpdate } = useDragDrop({
        data,
        apiConfig: apiConfig.lecture.updateSort,
        indexField: 'ordering',
    });
    // console.log('sorted data', sortedData);
    // console.log('>>> sortedData >>> subjectId >>> ', sortedData[0]?.subject?.id);

    const columns = [
        {
            ...sortColumn,
            render: () => <RenderDragCol />,
        },
        {
            title: <FormattedMessage defaultMessage="Tên bài giảng" />,
            dataIndex: ['lectureName'],
            render: (_, { lectureName, lectureKind }) => (
                <RenderHierarchyCol lectureName={lectureName} lectureKind={lectureKind} />
            ),
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
                style={{ width: '744px' }}
                info={sortedData[0]?.subject?.subjectName}
                button={mixinFuncs.renderActionBar()}
                baseTable={
                    // <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                    //     <SortableContext
                    //         items={sortedData.map((i) => i.ordering)}
                    //         strategy={verticalListSortingStrategy}
                    //     >
                    //         <Table
                    //             rowKey="ordering"
                    //             components={{ body: { row: SortableRow } }}
                    //             columns={columns}
                    //             dataSource={sortedData}
                    //             loading={loading}
                    //             pagination={false}
                    //         />
                    //     </SortableContext>
                    // </DndContext>
                    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                        <SortableContext
                            items={sortedData.map((i) => i.ordering)}
                            strategy={verticalListSortingStrategy}
                        >
                            <BaseTable
                                onChange={mixinFuncs.changePagination}
                                columns={columns}
                                dataSource={sortedData}
                                pagination={pagination}
                                loading={loading}
                                rowKey={{ id: 'ordering' }}
                                components={{ body: { row: SortableRow } }}
                            />
                        </SortableContext>
                    </DndContext>
                }
            >
                <Row justify="end" align="center">
                    <Col>
                        <Button type="primary" onClick={handleUpdate} icon={<SaveOutlined />}>
                            Cập nhật vị trí
                        </Button>
                    </Col>
                </Row>
            </ListPage>
        </PageWrapper>
    );
};
export default SubjectDetailPage;
