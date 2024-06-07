import produce from 'immer';
import { call, cancelled } from 'redux-saga/effects';

import { sendRequest } from '@services/api';
import axios from 'axios';
import { getData, setData } from '@utils/localStorage';
import { destructCamelCaseString } from '@utils';
import { apiUrl, appName } from '@constants';
import unidecode from 'unidecode';
function makeAction(actionType) {
    const newAction = (payload) => ({
        type: actionType,
        payload,
    });
    newAction.type = actionType;

    return newAction;
}

export const createSuccessActionType = (type) => `${type}_SUCCESS`;
export const createFailureActionType = (type) => `${type}_FAILURE`;

export function createAction(actionType, options) {
    const rootAction = makeAction(actionType);

    // refactor
    if (options?.success) {
        rootAction.success = makeAction(createSuccessActionType(actionType));
    }

    if (options?.fail) {
        rootAction.fail = makeAction(createFailureActionType(actionType));
    }

    return rootAction;
}

const makeObject = (data, condition) => {
    const newData = {};
    Object.keys(data)
        .filter(condition)
        .forEach((key) => {
            newData[key] = data[key];
        });

    return newData;
};

const getStorageData = (storage, defaultKey) => {
    if (!storage) {
        return {};
    }

    const { key, whiteList, blackList } = storage;
    const data = getData(key || `${appName}-${defaultKey}`) || {};

    if (!blackList && !whiteList) {
        return data;
    }

    if (whiteList) {
        return makeObject(data, (key) => whiteList.includes(key));
    }

    if (blackList) {
        return makeObject(data, (key) => !blackList.includes(key));
    }
};

const storageData = (storage, defaultKey, data) => {
    if (!storage) {
        return;
    }

    const { key, whiteList, blackList } = storage;
    let dataWillStorage = data;

    if (blackList) {
        dataWillStorage = makeObject(data, (key) => !blackList.includes(key));
    }

    if (whiteList) {
        dataWillStorage = makeObject(data, (key) => whiteList.includes(key));
    }

    setData(key || `${appName}-${defaultKey}`, dataWillStorage);
};

export function createReducer({ reducerName, initialState, storage }, handler) {
    const reducerNameDestructed = destructCamelCaseString(reducerName);
    const mergedInitialState = {
        ...initialState,
        ...getStorageData(storage, reducerNameDestructed),
    };
    const reducer = (state, action = {}) => {
        if (state === undefined) {
            return mergedInitialState;
        }
        if (handler?.[action.type]) {
            const newState = produce(state, (draft) => handler[action.type](draft, action));
            storageData(storage, reducerNameDestructed, newState);
            return newState;
        }
        return state;
    };
    Object.defineProperty(reducer, 'name', { value: reducerName });

    return reducer;
}

export function* processAction(options, { payload }) {
    const { onError, onCompleted } = payload;
    const cancelTokenSource = axios.CancelToken.source();

    try {
        const response = yield call(sendRequest, options, payload, cancelTokenSource.token);
        if (!response?.data.result) throw response;
        onCompleted?.(response);
    } catch (error) {
        onError?.(error);
    } finally {
        if (yield cancelled()) {
            cancelTokenSource.cancel();
        }
    }
}
export const fitString = (text = '', length) => {
    if (!text) return text;

    if (text.length < length) return text;
    else return `${text.slice(0, length)}...`;
};

export function convertToUrlFriendly(string) {
    // Remove diacritics using unidecode
    const stringWithoutDiacritics = unidecode(string);

    // Replace spaces with hyphens and convert to lowercase
    const urlFriendlyString = stringWithoutDiacritics.replace(/\s+/g, '-').toLowerCase();

    return urlFriendlyString;
}
