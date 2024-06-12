import apiConfig from '@constants/apiConfig';
import SubjectListPage from '.';
import SubjectSavePage from './subjectSavePage';
import LectureBySubjectPage from './lecture/lectureBySubjectPage';
import LectureSavePage from './lecture/lectureSavePage';

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
    lectureBySubjectPage: {
        path: '/subject/lecture/:subjectId',
        title: 'Lecture By Subject Page',
        auth: true,
        component: LectureBySubjectPage,
        permissions: [apiConfig.subject.create.baseURL, apiConfig.subject.update.baseURL],
    },
    lectureSavePage: {
        path: '/subject/lecture/:subjectId/:id',
        title: 'Lecture Save Page',
        auth: true,
        component: LectureSavePage,
        permissions: [apiConfig.subject.create.baseURL, apiConfig.subject.update.baseURL],
    },
};
