import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { generatePath } from 'react-router-dom';
import routes from './routes';
import apiConfig from '@constants/apiConfig';
import DeveloperForm from './DeveloperForm';
import { showErrorMessage } from '@services/notifyService';
import { commonMessage } from '@locales/intl';
import useFetch from '@hooks/useFetch';
import { commonStatus } from '@constants';

const messages = defineMessages({
    objectName: 'Lập trình viên',
});

const DeveloperSavePage = () => {
    const translate = useTranslate();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.developer.getById,
            create: apiConfig.developer.create,
            update: apiConfig.developer.update,
        },
        options: {
            getListUrl: generatePath(routes.developerListPage.path, {}),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    developerId: detail.id,
                    status: commonStatus.ACTIVE,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    status: commonStatus.ACTIVE,
                };
            };
            funcs.onSaveError = (err) => {
                if (err.response.data.code === 'ERROR-ACCOUNT-ERROR-0001') {
                    showErrorMessage('Lập trình viên đã tồn tại');
                    mixinFuncs.setSubmit(false);
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                    mixinFuncs.setSubmit(false);
                }
            };
        },
    });

    const { execute: executeLeaderRefer } = useFetch(apiConfig.developer.leaderRefer, { immediate: false });


    return (
        <PageWrapper
            loading={loading}
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.developer),
                    path: generatePath(routes.developerListPage.path, {}),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <DeveloperForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};

export default DeveloperSavePage;
