import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useFetchAction from '@hooks/useFetchAction';
import useSaveBase from '@hooks/useSaveBase';
import { accountActions } from '@store/actions';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProfileForm from './ProfileForm';

import useAuth from '@hooks/useAuth';
import { UserTypes, storageKeys } from '@constants';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { getData } from '@utils/localStorage';


const messages = defineMessages({
    profile: 'Profile',
});

const userProfileType = {
    [UserTypes.MANAGER]: 'organize',
    [UserTypes.DEVELOPER]: 'developer',
    [UserTypes.STUDENT]: 'student',
    [UserTypes.COMPANY]: 'company',
};

const ProfilePage = () => {
    const { profile } = useAuth();
    const translate = useTranslate();
    const useKind = getData(storageKeys.USER_KIND);
    const { data, loading } = useFetch(apiConfig[userProfileType[useKind]].getProfile, {
        immediate: true,
        mappingData: (res) => res.data,
    });
    const { execute: executeGetProfile } = useFetchAction(accountActions.getProfile);
    const { mixinFuncs, onSave, setIsChangedFormValues, isEditing } = useSaveBase({
        options: {
            getListUrl: `/`,
            objectName: translate.formatMessage(messages.profile),
        },
        apiConfig: {
            getById: apiConfig[userProfileType[useKind]].getProfile,
            update: apiConfig[userProfileType[useKind]].updateProfile,
        },
        override: (funcs) => {
            const onSaveCompleted = funcs.onSaveCompleted;

            funcs.onSaveCompleted = (response) => {
                onSaveCompleted(response);
                executeGetProfile();
            };
        },
    });

    return (
        <PageWrapper loading={loading} routes={[{ breadcrumbName: translate.formatMessage(messages.profile) }]}>
            {useKind === UserTypes.MANAGER && (
                <ProfileForm
                    setIsChangedFormValues={setIsChangedFormValues}
                    dataDetail={data ? data : {}}
                    formId={mixinFuncs.getFormId()}
                    isEditing={isEditing}
                    actions={mixinFuncs.renderActions()}
                    onSubmit={onSave}
                    // isAdmin={isAdmin}
                />
            )}
            
        </PageWrapper>
    );
};

export default ProfilePage;
