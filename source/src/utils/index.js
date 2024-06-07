import qs from 'query-string';
import {
    CurrentcyPositions as CurrencyPositions,
    CurrentcyPositions,
    DATE_FORMAT_DISPLAY,
    DATE_SHORT_MONTH_FORMAT,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    THEMES,
    apiTenantUrl,
    apiUrl,
    storageKeys,
} from '@constants';
import dayjs from 'dayjs';
import moment from 'moment/moment';
import { getData } from './localStorage';

export const convertGlobImportToObject = (modules) =>
    modules
        .filter((module) => !!module.default)
        .reduce(
            (rs, cur) => ({
                ...rs,
                [cur.default.name]: cur.default,
            }),
            {},
        );

export const convertGlobImportToArray = (modules) =>
    modules.filter((module) => !!module.default).map((module) => module.default);

export const destructCamelCaseString = (string) => {
    const arrString = [...string];
    const newArrString = [];
    arrString.forEach((char, index) => {
        if (char.charCodeAt(0) > 90) {
            newArrString.push(char);
        } else {
            index && newArrString.push('-');
            newArrString.push(char.toLowerCase());
        }
    });
    return newArrString.join('');
};

export const getBrowserTheme = () => {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return isDark ? THEMES.DARK : THEMES.LIGHT;
};

export const makeURL = (baseURL, params, pathParams) => {
    for (let key of Object.keys(pathParams || {})) {
        const keyCompare = `:${key}`;
        if (baseURL.indexOf(keyCompare) !== -1) {
            baseURL = baseURL.replace(keyCompare, pathParams[key]);
        }
    }

    if (params) {
        baseURL = baseURL + '?' + qs.stringify(params);
    }

    return baseURL;
};

export const parseURL = (url) => {
    try {
        return new URL(url);
    } catch (error) {
        return '';
    }
};

export const getYTEmbedLinkFromYTWatchLink = (watchLink) => {
    if (!watchLink) {
        return '';
    }

    const { v } = qs.parse(parseURL(watchLink).search);
    return v ? `https://www.youtube.com/embed/${v}?autoplay=1&mute=1` : watchLink;
};

export const getYoutubeVideoID = (url) => {
    let pattern = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    return pattern.exec(url)?.[3];
};

export const formatNumber = (value, setting) => {
    if (value) {
        const decimalPosition = value.toString().indexOf('.');
        if (decimalPosition > 0) {
            const intVal = value.toString().substring(0, decimalPosition);
            const decimalVal = value.toString().substring(decimalPosition + 1);
            return `${intVal.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimalVal}`;
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else if (value === 0) return 0;
    return '';
};

export const formatDateString = (dateString, formatDate = DATE_SHORT_MONTH_FORMAT) => {
    return dayjs(dateString).format(formatDate);
};

export const removeAccents = (str) => {
    if (str)
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    return str;
};

export const validateUsernameForm = (rule, username) => {
    return /^[a-z0-9_]+$/.exec(username)
        ? Promise.resolve()
        : Promise.reject('Username chỉ bao gồm các ký tự a-z, 0-9, _');
};

export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

export function ensureArray(value) {
    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}

export const removePathParams = (paths) => {
    return ensureArray(paths).map((path) => {
        if (typeof path !== 'string') return path;
        return path.replaceAll(/\/:[a-zA-Z]+/g, '');
    });
};

export const validatePermission = (
    requiredPermissions = [],
    userPermissions = [],
    requiredKind,
    userKind,
    excludeKind = [],
    profile,
    path,
    separate,
) => {
    if (ensureArray(excludeKind).length > 0) {
        if (ensureArray(excludeKind).some((kind) => kind == userKind)) return false;
    }
    if (requiredKind) {
        if (requiredKind !== userKind) return false;
    }
    if (!requiredPermissions || requiredPermissions?.length == 0) return true;
    let permissionsSavePage = [];
    if (separate && requiredPermissions.length > 0) {
        permissionsSavePage.push(path?.type === 'create' ? requiredPermissions[0] : requiredPermissions[1]);
    } else {
        permissionsSavePage = requiredPermissions;
    }

    return removePathParams(permissionsSavePage).every((item) => {
        return userPermissions?.includes(new URL(item ?? apiTenantUrl).pathname);
    });
};

export const randomString = (length = 4) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const formatMoney = (value = 0, setting = {}) => {
    if ((value || value === 0) && !isNaN(value)) {
        const groupSeparator = setting.groupSeparator || '.';
        const decimalSeparator = setting.decimalSeparator || ',';
        const currentcy = setting.currentcy || '€';
        const currentcyPosition = setting.currentcyPosition || CurrentcyPositions.BACK;
        if (value % 1 !== 0) {
            if (setting.currentDecimal) {
                value = parseFloat(value.toFixed(setting.currentDecimal));
            } else {
                value = (+value).toFixed(2);
            }
        }
        // value = setting.currentDecimal ? (+value).toFixed(setting.currentDecimal) : (+value).toFixed(2);
        // value = (+value).toFixed(0);
        const decimalPosition = value.toString().indexOf('.');
        if (decimalPosition > 0) {
            const intVal = value.toString().substring(0, decimalPosition);
            const decimalVal = value.toString().substring(decimalPosition + 1);
            value = `${intVal.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator)}${decimalSeparator}${decimalVal}`;
        } else {
            value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
        }
        if (currentcyPosition === CurrentcyPositions.FRONT) {
            return `${currentcy} ${value}`;
        } else {
            return `${value} ${currentcy}`;
        }
    }
    return '';
};

export const convertUtcToLocalTime = (utcTime, inputFormat = DATE_FORMAT_DISPLAY, format = DATE_FORMAT_DISPLAY) => {
    try {
        if (utcTime) return moment(moment.utc(utcTime, inputFormat).toDate()).format(format);
        return '';
    } catch (err) {
        return '';
    }
};

export const convertLocalTimeToUtc = (localTime, inputFormat = DATE_FORMAT_DISPLAY, format = DATE_FORMAT_DISPLAY) => {
    try {
        if (localTime) return moment(localTime, inputFormat).utc().format(format);
        return '';
    } catch (err) {
        return '';
    }
};

export function convertUtcToIso(date) {
    return dayjs(convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT), DEFAULT_FORMAT);
}

export function convertIsoToUtc(date) {
    return convertLocalTimeToUtc(dayjs(date).format(DEFAULT_FORMAT), DEFAULT_FORMAT, DEFAULT_FORMAT);
}

export function getFileName(path = '') {
    return path.substring(path.lastIndexOf('/') + 1);
}

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export function formatCurrency(value) {
    if (isNaN(value)) return '';

    return value.toLocaleString('en-US');
}

export function mappingLabelValue(list = [], value) {
    const item = list.find((itemList) => itemList.value === value);
    if (item) {
        return item.label;
    }

    return '';
}

export function createPathWithData(path, data) {
    let pathResult = path;
    const params = {};
    const dataKeys = Object.keys(data);
    for (let key of dataKeys) {
        const keyCompare = ':' + key;
        const value = data[key];
        if (pathResult.indexOf(keyCompare) !== -1) {
            pathResult = pathResult.replace(keyCompare, value);
        } else {
            params[key] = value;
        }
    }

    if (Object.values(params).length) {
        pathResult += '?' + qs.stringify(params);
    }

    return pathResult;
}

export const moveArrayElement = (arr = [], from, to) => {
    if (!Array.isArray(arr)) throw new Error('The first argument must be an array.');

    const copy = arr.slice();
    copy.splice(to, 0, copy.splice(from, 1)[0]);

    return copy;
};

export const parseJson = (json) => {
    let result = null;
    if (json) {
        try {
            result = JSON.parse(json);
        } catch (err) {
            console.error(err);
        }
    }
    return result;
};

export const getPriceQrCode = (priceJson) => {
    const qrcodePrice = parseJson(priceJson) || {};
    return qrcodePrice.qr_code || { in_price: 0, out_price: 0 };
};

export const getPricePickup = (priceJson) => {
    const pickupPrice = parseJson(priceJson) || {};
    return pickupPrice.pickup || { price: 0 };
};

export const getPriceDeliver = (priceJson) => {
    const deliverPrice = parseJson(priceJson) || {};
    return deliverPrice.deliver || { price: 0 };
};

export const getDisabledHours = (minValue) => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
        if (minValue && i < minValue.hours()) {
            hours.push(i);
        }
    }
    return hours;
};

export const getDisabledMinutes = (selectedHour, minValue) => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
        if (minValue && minValue.hours() === selectedHour && i < minValue.minutes()) {
            minutes.push(i);
        }
    }
    return minutes;
};
export function generatePassword(options) {
    const { length, numbers, uppercase, lowercase, symbols, strict } = options;

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let validChars = '';

    if (uppercase) {
        validChars += uppercaseChars;
    }
    if (lowercase) {
        validChars += lowercaseChars;
    }
    if (numbers) {
        validChars += numberChars;
    }
    if (symbols) {
        validChars += symbolChars;
    }

    if (validChars.length === 0) {
        throw new Error('At least one character type should be selected.');
    }

    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * validChars.length);
        password += validChars.charAt(randomIndex);
    }

    if (strict) {
        // Ensure at least one character of each type is present
        if (uppercase && !/[A-Z]/.test(password)) {
            return generatePassword(options);
        }
        if (lowercase && !/[a-z]/.test(password)) {
            return generatePassword(options);
        }
        if (numbers && !/\d/.test(password)) {
            return generatePassword(options);
        }
        if (symbols && !/[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password)) {
            return generatePassword(options);
        }
    }

    return password;
}
export function copyToClipboard(text) {
    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
}

//Sử dụng trong trường hợp khi search rồi back về bằng breadcrumb
export const deleteSearchFilterInLocationSearch = (locationSearch, searchFilter = []) => {
    const searchParams = new URLSearchParams(locationSearch);
    searchFilter.forEach((value) => searchParams.delete(value));
    return `?${searchParams.toString()}`;
};

export const referMoneyTotal = function (arr) {
    return arr.reduce((sum, item) => {
        return item.kind === 3 ? sum + (item.money ?? 0) : sum;
    }, 0);
};

export const sumMoney = function (arr) {
    return arr.reduce((sum, item) => {
        if (!item) return sum;

        const money = item.money ?? 0;
        if (item.kind === 4 || item.kind === 5) {
            return sum - money;
        } else if (item.kind === 1 || item.kind === 2 || item.kind === 3) {
            return sum + money;
        }

        // For kinds other than 1, 2, 3, 4, or 5, we just return the current sum
        return sum;
    }, 0);
};

export const orderNumber = (pagination, index) => {
    const page = pagination?.current ? pagination.current - 1 : 1;
    return page * DEFAULT_TABLE_ITEM_SIZE + (index + 1);
};

export function convertToCamelCase(str) {
    str = str
        .normalize('NFD') // chuyển chuỗi sang unicode tổ hợp
        .replace(/[\u0300-\u036f]/g, ''); // xóa các ký tự dấu sau khi tách tổ hợp

    str = str.replace(/[đĐ]/g, 'd');
    str = str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
    str = str.replace(/(\s+)/g, '');

    // return
    return str;
}

export const convertMinuteToHour = (minu) => {
    let result = minu / 60;
    if (result % 1 !== 0) {
        return `${parseFloat(result.toFixed(2))}h`;
    } else {
        return `${result.toFixed(0)}h`;
    }
};
export const formatMoneyValue = (value) => {
    return formatMoney(value, {
        groupSeparator: ',',
        decimalSeparator: '.',
        currentcy: 'đ',
        currentcyPosition: 'BACK',
        currentDecimal: '2',
    });
};

export const calculateTimes = (data) => {
    return data.reduce(
        (acc, item) => {
            if (item?.kind === 1) {
                acc.upTime += item?.totalTime;
            } else if (item?.kind === 200) {
                acc.bugTime += item?.totalTime;
            }
            return acc;
        },
        { upTime: 0, bugTime: 0 },
    );
};

export const calculateTrainingTimes = (data) => {
    let value = 0;
    return data.reduce(
        (acc, item) => {
            acc.completeTime += item?.learnCourseTime;
            acc.assignedTime += item?.assignedCourseTime;
            value +=
                item?.learnCourseTime === 0 || item?.assignedCourseTime === 0
                    ? 0
                    : item?.assignedCourseTime - item?.learnCourseTime;
            acc.differenceTime = value < 0 ? value : 0;
            return acc;
        },
        { completeTime: 0, assignedTime: 0, differenceTime: 0 },
    );
};
