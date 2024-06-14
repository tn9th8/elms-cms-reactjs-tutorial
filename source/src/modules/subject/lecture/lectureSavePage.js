import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useParams, useSearchParams } from 'react-router-dom';
import routes from '@routes';
import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import LectureForm from './lectureForm';
import useDragDrop from '@hooks/useDragDrop';
import useListBase from '@hooks/useListBase';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';

const message = defineMessages({
    objectName: 'Bài giảng',
    lecture: 'Bài giảng',
});

const LectureSavePage = () => {
    const { subjectId, id } = useParams();
    let [searchParams, setSearchParams] = useSearchParams();
    const totalLecture = searchParams.get('totalLecture');
    const selectedOrdering = searchParams.get('selectedOrdering');
    const translate = useTranslate();

    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.lecture.getById,
            create: apiConfig.lecture.create,
            update: apiConfig.lecture.update,
        },
        options: {
            getListUrl: generatePath(routes.lectureBySubjectPage.path, { subjectId }),
            // getListUrl: routes.subjectListPage.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });
    // console.log('>>> ', detail, isEditing);

    const { data, mixinFuncs2, loading2, pagination, queryFilter } = useListBase({
        apiConfig: {
            ...apiConfig.lecture,
            getList: {
                ...apiConfig.lecture.getBySubject,
                baseURL: apiConfig.lecture.getBySubject.baseURL.replace(':subjectId', subjectId),
            },
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

    const { sortedData, onDragEnd, sortColumn, handleUpdate } = useDragDrop({
        data,
        apiConfig: apiConfig.lecture.updateSort,
        indexField: 'ordering',
    });

    

    const onSortAndSave = (values) => {
        if (id === 'create') {
            const nextChapters = sortedData.filter((lecture) => {
                if (lecture.ordering > selectedOrdering && lecture.lectureKind === 1) {
                    return lecture;
                }
            });
            const createdOrdering = nextChapters.length ? nextChapters[0].ordering : +totalLecture;
            handleUpdate(createdOrdering - 1);
            onSave({
                ...values,
                ordering: createdOrdering,
            });
        } else {
            onSave(values);
        }
        
    };

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.subject),
                    path: generatePath(routes.subjectListPage.path),
                },
                {
                    breadcrumbName: translate.formatMessage(commonMessage.lecture),
                    path: generatePath(routes.lectureBySubjectPage.path, { subjectId }),
                },
                { breadcrumbName: title },
            ]}
        >
            <LectureForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail.id ? detail : { ordering: totalLecture, status: 1, subject: { id: subjectId } }}
                //  dataDetail={detail ? detail : { ordering: totalLecture, status: 1, subjectId }}
                onSubmit={onSortAndSave}
                // onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};
export default LectureSavePage;
