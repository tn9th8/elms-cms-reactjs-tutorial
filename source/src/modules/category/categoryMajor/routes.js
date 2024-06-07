import apiConfig from '@constants/apiConfig';
import CategoryListPage from '.';
import CategorySavePage from './CategorySavePage';

export default {
    categoryListPageMajor: {
        path: '/category-major',
        title: 'Category major',
        auth: true,
        component: CategoryListPage,
        permissions: [apiConfig.category.getById.baseURL],
    },
    categorySavePageMajor: {
        path: '/category-major/:id',
        title: 'Category Save Page',
        auth: true,
        component: CategorySavePage,
        permissions: [apiConfig.category.getById.baseURL],
    },
};
