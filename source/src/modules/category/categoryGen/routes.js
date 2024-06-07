import apiConfig from '@constants/apiConfig';
import CategoryListPage from '.';
import CategorySavePage from './CategorySavePage';

export default {
    categoryListPageGen: {
        path: '/category-generation',
        title: 'Category generation',
        auth: true,
        component: CategoryListPage,
        permissions: apiConfig.category.getById.baseURL,
    },
    categorySavePageGen: {
        path: '/category-generation/:id',
        title: 'Category Save Page',
        auth: true,
        component: CategorySavePage,
        permissions: [apiConfig.category.getById.baseURL],
    },
};
