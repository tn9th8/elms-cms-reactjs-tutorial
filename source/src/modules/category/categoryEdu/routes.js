import apiConfig from '@constants/apiConfig';
import CategoryListPage from '.';
import CategorySavePage from './CategorySavePage';

export default {
    categoryListPageEdu: {
        path: '/category-education',
        title: 'Category education',
        auth: true,
        component: CategoryListPage,
        permissions: apiConfig.category.getById.baseURL,
    },
    categorySavePageEdu: {
        path: '/category-education/:id',
        title: 'Category Save Page',
        auth: true,
        component: CategorySavePage,
        permissions: [apiConfig.category.getById.baseURL],
    },
};
