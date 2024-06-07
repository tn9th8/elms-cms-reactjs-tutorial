import { createSelector } from "reselect";

export const selectCurrency = createSelector(
    state => state.currency.currency,
    currency => currency,
);
