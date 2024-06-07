import { createSelector } from 'reselect';

export const selectAppLoading = createSelector(
    (state) => state.app.appLoading,
    (appLoading) => appLoading > 0,
);

export const selectActionLoading = (type) =>
    createSelector(
        (state) => state.app[type],
        (loading) => loading,
    );

export const selectAppTheme = createSelector(
    (state) => state.app.theme,
    (theme) => theme,
);

export const selectAppLocale = createSelector(
    (state) => state.app.locale,
    (locale) => locale,
);

export const selectRestaurantList = createSelector(
    (state) => state.app.restaurantList,
    (restaurantList) => restaurantList,
);
export const selectedRowKeySelector = createSelector(
    (state) => state.app.selectedRowKey,
    (selectedRowKey) => selectedRowKey,
);

export const settingSystemSelector = createSelector(
    (state) => state.app.settingSystem,
    (settingSystem) => settingSystem,
);
