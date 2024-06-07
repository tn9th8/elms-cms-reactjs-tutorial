import { CurrentcyPositions } from '@constants';
import { currencyActions } from '@store/actions';
import { createReducer } from '@store/utils';

const { setCurrency } = currencyActions;

const initialState = {
    currency: {
        symbol: '',
        decimal: '',
        separator: '',
        position: CurrentcyPositions.BACK,
        dateFormat: 'dd.MM.yyyy',
        decimalRound: 2,
    },
};

const currencyReducer = createReducer(
    {
        reducerName: 'currency',
        initialState,
    },
    {
        [setCurrency.type]: (state, { payload }) => {
            state.currency = payload;
        },
    },
);

export default currencyReducer;
