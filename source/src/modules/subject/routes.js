import apiConfig from '@constants/apiConfig';
import SubjectListPage from '.';
import SubjectSavePage from './subjectSavePage';

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
};
