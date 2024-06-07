import React, { useEffect } from 'react';

import { Routes, BrowserRouter, Route } from 'react-router-dom';

import ValidateAccess from './ValidateAccess';
import AppNavigate from '@modules/main/AppNavigate';

import routes from '.';
import useAuth from '@hooks/useAuth';
import Loading from '@components/common/loading';
import { useCurrency } from '@components/common/elements/Currency';
import { useDispatch } from 'react-redux';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { UserTypes } from '@constants';
import { appActions } from '@store/actions';
import { getCacheAccessToken } from '@services/userService';
import { webSocket } from '@utils/webSocket';
import useTranslate from '@hooks/useTranslate';
import { actions } from '@store/actions/app';
const routesArray = Object.values(routes);
const AppRoutes = () => {
    const { isAuthenticated, loading: loadingProfile, profile } = useAuth();
    const translate = useTranslate();
    const dispatch = useDispatch();
    const renderRoute = (route) => (
        <Route
            key={route.path || 'not-found'}
            path={route.path}
            index={route.index}
            element={
                loadingProfile ? (
                    <Loading show />
                ) : (
                    <ValidateAccess
                        permissions={route.permissions}
                        separate={route.separateCheck}
                        onValidatePermissions={route.validatePermissions}
                        authRequire={route.auth}
                        component={route.component}
                        componentProps={route.componentProps}
                        isAuthenticated={isAuthenticated}
                        profile={profile}
                        layout={route.layout}
                        path={route.path}
                        breadcrumbs={route.breadcrumbs}
                    />
                )
            }
        />
    );
    const { data: dataSetting } = useFetch(apiConfig.settings.settings, {
        immediate: true,
        mappingData: ({ data }) => data,
    });
    useEffect(() => {
        dispatch(actions.settingSystem(dataSetting));
    }, [dataSetting]);

    useEffect(() => {
        const accessToken = getCacheAccessToken();
        webSocket(accessToken, translate);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppNavigate />}>{routesArray.map(renderRoute)}</Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
