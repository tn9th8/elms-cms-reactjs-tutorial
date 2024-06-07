import { createReducer } from '@store/utils';
import { appActions } from '@store/actions';
import { defaultLocale, storageKeys } from '@constants';
import { setData } from '@utils/localStorage';

const {
    hideAppLoading,
    showAppLoading,
    toggleActionLoading,
    changeLanguage,
    setRestaurantTenantId,
    getRestaurantListByCustomer,
    setSelectedRowKey,
    settingSystem,
} = appActions;

const initialState = {
    appLoading: 0,
    locale: defaultLocale,
    tenantId: null,
    restaurantList: [],
    apiUrl: null,
    selectedRowKey: null,
    settingSystem: [],
};

const appReducer = createReducer(
    {
        reducerName: 'app',
        initialState,
        storage: {
            whiteList: ['theme', 'locale'],
        },
    },
    {
        [showAppLoading.type]: (state) => {
            state.appLoading++;
        },
        [hideAppLoading.type]: (state) => {
            state.appLoading = Math.max(0, state.appLoading - 1);
        },
        [toggleActionLoading.type]: (state, action) => {
            if (action.payload.isLoading) {
                state[action.payload.type] = true;
            } else {
                delete state[action.payload.type];
            }
        },
        [changeLanguage.type]: (state, { payload }) => {
            state.locale = payload;
        },
        [setRestaurantTenantId.type]: (state, { payload: { tenantId, apiUrl } }) => {
            state.tenantId = tenantId;
            state.apiUrl = apiUrl;
            setData(storageKeys.TENANT_ID, tenantId);
            setData(storageKeys.TENANT_API_URL, `${apiUrl}/`);
            setData(storageKeys.RESTAURANT_ID, tenantId.split('_')[2]);
        },
        [getRestaurantListByCustomer.type]: (state, { payload }) => {
            state.restaurantList = payload.data?.content || [];
        },
        [setSelectedRowKey.type]: (state, { payload }) => {
            state.selectedRowKey = payload;
        },
        [settingSystem.type]: (state, { payload }) => {
            state.settingSystem = payload;
        },
    },
);

export default appReducer;
