import apiConfig from '@constants/apiConfig';
import CategoryListPage from '.';
import CategorySavePage from './CategorySavePage';

export default {
    categoryListPageRole: {
        path: '/project-role',
        title: 'Project role',
        auth: true,
        component: CategoryListPage,
        permissions: apiConfig.category.getById.baseURL,
    },
    categorySavePageRole: {
        path: '/project-role/:id',
        title: 'Project role Save Page',
        auth: true,
        component: CategorySavePage,
        permissions: [apiConfig.category.getById.baseURL],
    },
};
