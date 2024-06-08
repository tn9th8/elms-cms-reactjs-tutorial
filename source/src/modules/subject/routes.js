import apiConfig from '@constants/apiConfig';
import SubjectListPage from '.';
import SubjectSavePage from './subjectSavePage';
import SubjectDetailPage from './subjectDetailPage';

export default {
    subjectListPage: {
        path: '/subject',
        title: 'Subject',
        auth: true,
        component: SubjectListPage,
        permissions: [apiConfig.subject.getList.baseURL],
    },
    subjectSavePage: {
        path: '/subject/:id',
        title: 'Subject Save Page',
        auth: true,
        component: SubjectSavePage,
        permissions: [apiConfig.subject.create.baseURL, apiConfig.subject.update.baseURL],
    },
    subjectDetailPage: {
        path: '/subject/detail/:id',
        title: 'Subject Detail Page',
        auth: true,
        component: SubjectDetailPage,
        permissions: [apiConfig.subject.create.baseURL, apiConfig.subject.update.baseURL],
    },
};
