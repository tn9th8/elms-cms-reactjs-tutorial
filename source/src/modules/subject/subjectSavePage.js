import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';
import routes from './routes';
import SubjectForm from './subjectForm';
const message = defineMessages({
    objectName: 'Môn học',
    subject: 'Môn học',
});

const SubjectSavePage = () => {
    // const params = useParams();
    const translate = useTranslate();

    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.subject.getById,
            create: apiConfig.subject.create,
            update: apiConfig.subject.update,
        },
        options: {
            getListUrl: routes.subjectListPage.path,
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

    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.subject),
                    path: generatePath(routes.subjectListPage.path),
                    // path: generatePath(routes.subjectListPage.path, { objectId }),
                },
                { breadcrumbName: title },
            ]}
        >
            <SubjectForm
                formId={mixinFuncs.getFormId()}
                actions={mixinFuncs.renderActions()}
                dataDetail={detail ? detail : {}}
                onSubmit={onSave}
                setIsChangedFormValues={setIsChangedFormValues}
                isError={errors}
                isEditing={isEditing}
            />
        </PageWrapper>
    );
};
export default SubjectSavePage;
