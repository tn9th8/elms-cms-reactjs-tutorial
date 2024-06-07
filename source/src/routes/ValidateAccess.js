import React from 'react';

import { accessRouteTypeEnum } from '@constants';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';

import routes from '.';
import PublicLayout from '@modules/main/PublicLayout';
import MainLayout from '@modules/main/MainLayout';
import HasPermission from '@components/common/elements/HasPermission';
import PageUnauthorized from '@components/common/page/unauthorized';

const ValidateAccess = ({
    authRequire,
    component: Component,
    componentProps,
    isAuthenticated,
    profile,
    layout,
    permissions: routePermissions,
    onValidatePermissions,
    path,
    separate,
    breadcrumbs,
}) => {
    const location = useLocation();
    const { id } = useParams();
    const getRedirect = (authRequire) => {
        if (authRequire === accessRouteTypeEnum.NOT_LOGIN && isAuthenticated) {
            return routes.homePage.path;
        }

        if (authRequire === accessRouteTypeEnum.REQUIRE_LOGIN && !isAuthenticated) {
            return routes.loginPage.path;
        }

        // check permistion

        return false;
    };

    const redirect = getRedirect(authRequire);

    if (redirect) {
        return <Navigate state={{ from: location }} key={redirect} to={redirect} replace />;
    }

    // currently, only support custom layout for authRequire route
    const Layout = authRequire ? layout || MainLayout : PublicLayout;
    return (
        <Layout>
            <HasPermission
                onValidate={onValidatePermissions}
                requiredPermissions={routePermissions}
                path={{ name: path, type: id === 'create' ? 'create' : 'update' }}
                separate={separate}
                fallback={<PageUnauthorized />}
            >
                <Component {...(componentProps || {})} breadcrumbs={breadcrumbs}>
                    <Outlet />
                </Component>
            </HasPermission>
        </Layout>
    );
};

export default ValidateAccess;
