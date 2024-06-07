import PageNotFound from '@components/common/page/PageNotFound';
import categoryRoutesEdu from '@modules/category/categoryEdu/routes';
import categoryRoutesGen from '@modules/category/categoryGen/routes';
import categoryRoutesMajor from '@modules/category/categoryMajor/routes';
// import categoryRoutesKnowledge from '@modules/knowledgeManage/categoryKnowledge/routes';

import Dashboard from '@modules/entry';
import LoginPage from '@modules/login/index';
import ProfilePage from '@modules/profile/index';
import PageNotAllowed from '@components/common/page/PageNotAllowed';

import developerRoutes from '@modules/account/developer/routes';
import studentRoutes from '@modules/account/student/routes';

import subjectRoutes from '@modules/subject/routes';

/*
    auth
        + null: access login and not login
        + true: access login only
        + false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: null,
        title: 'Page not allowed',
    },
    homePage: {
        path: '/',
        component: Dashboard,
        auth: true,
        title: 'Home',
    },
    loginPage: {
        path: '/login',
        component: LoginPage,
        auth: false,
        title: 'Login page',
    },
    profilePage: {
        path: '/profile',
        component: ProfilePage,
        auth: true,
        title: 'Profile page',
    },

    ...categoryRoutesEdu,
    ...categoryRoutesGen,
    ...categoryRoutesMajor,
    // ...categoryRoutesKnowledge,
    ...developerRoutes,
    ...studentRoutes,
    ...subjectRoutes,

    // keep this at last
    //
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
