import { DATE_DISPLAY_FORMAT } from '@constants';
import { selectCurrency } from '@selectors/currency';
import { convertUtcToIso, convertUtcToLocalTime, formatDateString } from '@utils';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';

const DateFormat = ({ children, format, onlyDate = false }) => {
    const setting = useSelector(selectCurrency);
    let dateFormat = format ?? setting.dateFormat;
    if (onlyDate) {
        dateFormat = dateFormat.replace('HH:mm', '');
    }
    return <span>{moment(children, DATE_DISPLAY_FORMAT).format(dateFormat)}</span>;
};

export default DateFormat;
